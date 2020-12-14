import express from 'express';
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { json } from 'body-parser';

// import { errorHandler } from './middlewares/error-handler';
// import { NotFoundError } from './errors/not-found-error';

import { NotFoundError, errorHandler,currentUser } from '@grider-ms-tickets/common';

import {createChargeRouter} from './routes/new'

const app = express();

app.set('trust proxy', true);//thru ingress to trust traffic as is beeing routed from ngnx

app.use(json());


app.use(
    cookieSession({
        signed: false,//no encrypt
        //secure: true,//htpps only =>cookies sent=> postman issues?=> ssl certification off
                     // change this secure property to false if we are in a test environment
                     //with an envar =>false 
        secure:process.env.NODE_ENV !=='test'
    })
);

app.use(currentUser);
app.use(createChargeRouter);


//v5 fuck the next
import 'express-async-errors';

// v3 copied from 4_micro
app.all('*', async (req, res) => {
    throw new NotFoundError();
});



app.use(errorHandler);


export { app };