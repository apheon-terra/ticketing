import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    BadRequstError,
} from '@grider-ms-tickets/common';
import { Ticket } from '../models/ticket';

import {TicketUpdatedPublisher}from '../events/publisher/ticket-updated-publisher'

import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be provided and must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }
        
        if (ticket.orderId)//the presence of an order ID means this thing is reserved and we should prevent edits
        {
            throw new BadRequstError('cannot edit areserved ticket');
            }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });

        await ticket.save();

        //emit event updated api type in postman is PUT for update
        //see bellow there is no await , if error triggers on updating it's already too late because reposnse was already sent to the user.
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })
            

            //resolve test
        return res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };
 