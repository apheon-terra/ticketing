import express, { Request, Response } from 'express';
import { requireAuth } from '@grider-ms-tickets/common';
import { Order } from '../models/order';

const router = express.Router();



router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {

    //v1
    // res.send({});


    //v2
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('ticket');//populate system in mongoose

    return res.send(orders);
});

export { router as indexOrderRouter };
