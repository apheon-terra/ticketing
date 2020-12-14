import { Message } from 'node-nats-streaming';
import {
    ListenerAbstract,
    ExpirationCompleteEventInterface,
    SubjectsEnum,
    OrderStatusEnum,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends ListenerAbstract<
    ExpirationCompleteEventInterface
    > {
    queueGroupName = queueGroupName;
    subject: SubjectsEnum.ExpirationComplete = SubjectsEnum.ExpirationComplete;

    async onMessage(
        data: ExpirationCompleteEventInterface['data'],
        msg: Message
    ) {
        const order = await Order.findById(data.orderId).populate('ticket');//hydrate the ticket ref to get our ticket id

        if (!order) {
            throw new Error('Order not found');
        }

        //if order has been paid for and completed
        if (order.status === OrderStatusEnum.Complete) {
            return msg.ack();
        }
        
        order.set({
            status: OrderStatusEnum.Cancelled,//once canceled the ticket that is asociated with it is going to  considered to be no longer reserved, that is going to unlock the ticket as far as the order service is reserved . So we do not need to reset or clear the ticket property . see ticket.ts in orders/src/models/ticket.ts . Reserved is only for created /await/complete. If order is canceled ser can see what ticket was asociated with it
            //if we reset ticket there would be no ties between order and given ticket anymore
            // ticket: null, // ?
        });

        await order.save();
        //informer services that order is cancelled
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        msg.ack();
    }
}
