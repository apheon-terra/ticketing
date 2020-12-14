import { Message } from 'node-nats-streaming';
import {
    ListenerAbstract,
    OrderCreatedEventInterface,
    SubjectsEnum,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends ListenerAbstract<
    OrderCreatedEventInterface
    > {
    subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEventInterface['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        });

        await order.save();

        msg.ack();
    }
}
