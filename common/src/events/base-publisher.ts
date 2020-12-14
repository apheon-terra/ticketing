import { Stan } from 'node-nats-streaming';
import { SubjectsEnum } from './subjects';

interface Event {
    subject: SubjectsEnum;
    data: any;
}

export abstract class PublisherAbstract<T extends Event> {
    abstract subject: T['subject'];
    //v1
    // private client: Stan;

    //v2
    protected client: Stan;//accessed by it's children and friends

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']): Promise<void> {

        //v1
        // this.client.publish(this.subject, JSON.stringify(data), () => { console.log('event published') });

        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to subject', this.subject);
                resolve();
            });
        });
    }
}
