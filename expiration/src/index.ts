
//nats-wrapper
import {natsWrapper} from './nats-wrapper' //an instance of the class low cappital consens

import {OrderCreatedListener} from './events/listeners/order-created-listener'

//connect to db
const start = async () => {

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    //mongoose internaly keeps a record of all internall records that exists

    //nats does not keep record of who connected previous. 

    //stan needs to be shared between  files of our project



    try {
        /*with nats wrapper*/

        //the ticketing id cluster id comes from nats-depl.yaml file

        // await natsWrapper.connect('ticketing', 'sdadf', 'http://nats-srv:4222');
        

        //refactoring natsWrapper connect
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

  
        //v4 from nats-wrapper
        
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit(); //more central location close to surface
        });
        
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
    }
    catch (err)
    {
        console.error(err);
    }

};

start();