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





//nats-wrapper
import {natsWrapper} from './nats-wrapper' //an instance of the class low cappital consems

import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-update-listener';
import {ExpirationCompleteListener} from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';



// concurency explanation cpthr 19 video 10 11  managed by mongoose


//connect to db
const start = async () => {
    console.log('starting....');
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
        

        //hook the listeners

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        
        new ExpirationCompleteListener(natsWrapper.client).listen();

        new PaymentCreatedListener(natsWrapper.client).listen();
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

