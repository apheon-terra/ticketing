import { OrderCancelledEventInterface } from './../../common/src/events/order-cancelled-event-interface';
// import express from 'express';
import mongoose from 'mongoose'
// import cookieSession from 'cookie-session'
// import { json } from 'body-parser';

// import { currentUserRouter } from './routes/current-user';
// import { signinRouter } from './routes/signin';
// import { signoutRouter } from './routes/signout';
// import { signupRouter } from './routes/signup';
// import { errorHandler } from './middlewares/error-handler';
// import { NotFoundError } from './errors/not-found-error';
import {app} from './app'

// app.get('/api/users/currentuser', (req, res) => {
//     res.send('Hi there!');
// });

import { OrderCreatedListener } from './events/listeners//order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

//nats-wrapper
import {natsWrapper} from './nats-wrapper' //an instance of the class low cappital consens



//connect to db
const start = async () => {

    //from nats depl yaml
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

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
        new OrderCancelledListener(natsWrapper.client).listen();

        
        /*******************/
        await mongoose.connect(process.env.MONGO_URI, {
            //configuration topology
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('connected to mongodb');
    }
    catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('listening on port verify 3000~!!');
    })

};

start();

