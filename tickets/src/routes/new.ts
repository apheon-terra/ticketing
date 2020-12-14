import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@grider-ms-tickets/common';
import { Ticket } from '../models/ticket';
import { natsWrapper} from '../nats-wrapper'

import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    [
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id,//that is otional but dont need to check because requireauth middleware handles for us
        });
        await ticket.save();

        //added after pub sub upgrade            //nats client inside index.ts is a getter
        await new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,//this is in interface defined will be updated
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
        });
    // if anything goes wrong with the 2 await cmds the error is caught by error middlewares
        return res.status(200).send(ticket);
    }
);

export { router as createTicketRouter };
