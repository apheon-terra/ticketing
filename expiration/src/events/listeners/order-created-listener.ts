import { Message } from 'node-nats-streaming';
import {
    ListenerAbstract,
    OrderCreatedEventInterface,
    SubjectsEnum,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends ListenerAbstract<
    OrderCreatedEventInterface
    > {
    subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEventInterface['data'], msg: Message) {

        //time in miliseconds future - present
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

        console.log('wait in ms', delay);
        //enqueue job to be send to redis
        await expirationQueue.add(
            {
                orderId: data.id,//from onMessage function
            },//options object for redis
            {
                delay:10000, // miliseconds //delaying the message // also expiration windows is set in orders new.ts route 
            }
        );

        msg.ack();
    }
}
