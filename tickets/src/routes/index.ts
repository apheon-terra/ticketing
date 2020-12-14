import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    // const tickets = await Ticket.find({});

    //rather giving us all, giveus all where the orderId property is undefined or not set, those are clear tickets
    const tickets = await Ticket.find({orderId:undefined});


    return res.send(tickets);
});

export { router as indexTicketRouter };
