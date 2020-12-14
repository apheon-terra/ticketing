import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatusEnum,
    BadRequstError,
} from '@grider-ms-tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;//>> can be in env var to kubernetes , or per user expiration settings

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))//structure of a mongo db object id, a bit o coupling due to nature of usign mongo db if we change db it will break, make assumtion that only this kind of mongo db
            .withMessage('TicketId must be provided'),
    ],
    validateRequest,//cutom err
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        //we need model of order

        //find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        //
        if (!ticket) {
            throw new NotFoundError();
        }

        //v1
        //make sure that this ticket is not already reserved
        //run query to look at all orders and find an order where the ticket is the 
        //ticket we just found and the order status is not cancelled 
        //if we find an order from that , this means the ticket is reserved
        //moved to ticket.ts

        // const existingOrder = await Order.findOne({
        //     ticket: ticket,
        //     status: {
        //         $in: [//monog db lexic , finds a ticket with status as in one of 3
        //             OrderStatusEnum.Created,
        //             OrderStatusEnum.AwaitingPayment,
        //             OrderStatusEnum.Complete
        //         ]
        //     }
        // });
        
        // if (existingOrder) {
        //     throw new BadRequstError('Ticket is already reserved');

        // }

        //v2
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequstError('Ticket is already reserved');
        }


        //calculate an expiration date for this order
        const expiration = new Date();

        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        //build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatusEnum.Created,
            expiresAt: expiration,
            ticket,
        });

        await order.save();

        //publish an event saying that order was created


        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version:order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),//if we rely the normal behavior we would end up with a date string or a timestamp that reflects whatever timezone we are living, so we comunicate them in a timezone agnostic way UTC  it is which is going to work regardless of the service that is going to receive the event so rather than relying upon this default to strign , so to get UTC timestamp pe perform this 
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
        });


        return res.status(201).send(order);
    }
);

export { router as newOrderRouter };
