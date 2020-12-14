import { Message } from 'node-nats-streaming';
import {
    SubjectsEnum,
    ListenerAbstract,
    PaymentCreatedEventInteface,
    OrderStatusEnum,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends ListenerAbstract<
    PaymentCreatedEventInteface
    > {
    subject: SubjectsEnum.PaymentCreated = SubjectsEnum.PaymentCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEventInteface['data'], msg: Message) {

        // /find the order we just payd
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }
        //update the status property
        order.set({
            status: OrderStatusEnum.Complete,
        });

        // technically we could do another event for vers update ,the order wont be updated ahain after complete so no point in doing it
        //save
        await order.save();
        //done
        msg.ack();
    }
}
