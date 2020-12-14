import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequstError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatusEnum,
} from '@grider-ms-tickets/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();


router.post(
    '/api/payments',
    requireAuth,
    [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
    validateRequest,
    async (req: Request, res: Response) => {

        //v1
        // res.send({ success: true });

        const { token, orderId } = req.body;
        //find order the user is trying to pay
        const order = await Order.findById(orderId);
        //if no order
        if (!order) {
            throw new NotFoundError();
        }
        //check if the user who pays = user in the order
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        //make sure it's not already cancelled
        if (order.status === OrderStatusEnum.Cancelled) {
            throw new BadRequstError('Cannot pay for an cancelled order');
        }
        //create the charge
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,//converted to cents
            source: token,
        });

        //we get back a data{
            // id,object,amount,amount_refunded ...
    //   }

        //if we want to look up the charge we use retrieve a charge endpoint , in the stripe doc

        // stripe.charges.retrieve(id, function (err, charge) { })
        //use the response from the api to create a new payment record
        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        });

        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            // @ts-ignore
            id: payment.id,
            orderId: payment.orderId,///take infodirectly from the record we just saved, kinda final form 
            stripeId: payment.stripeId,//same
        });
        
        // return res.status(201).send({ idsuccess:true });

        return res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };
