import nats, { Message, Stan } from 'node-nats-streaming';
import { SubjectsEnum } from './subjects';



interface Event {
    subject: SubjectsEnum;
    data: any;
}



export abstract class Listener<T extends Event> {
    // abstract subject: string;
    abstract subject: T['subject'];

    abstract queueGroupName: string;

    private client: Stan;

    private ackWait = 5 * 1000;

    abstract onMessage(data:/* any*/T['data'], msg: Message): void;

    constructor(client: Stan) {
        this.client = client;

    }
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data) : JSON.parse(data.toString('utf8'));//parse buffer to get the data
    }
}
