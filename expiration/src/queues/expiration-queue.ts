import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

//type of payload stored
interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {//connect to instance of redis server, from expiration-depl env-var
        host: process.env.REDIS_HOST,
    },
});

//role of proces is to dequeue the job at return
                            //similar to msg object, wrapps the data and has some info about the job aswell
expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
    });

    // console.log('publish expiration:complete event for orderId', job.data.orderId);
});

export { expirationQueue };
