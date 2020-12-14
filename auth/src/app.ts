import express from 'express';
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
// import { errorHandler } from './middlewares/error-handler';
// import { NotFoundError } from './errors/not-found-error';

import { NotFoundError, errorHandler } from '@grider-ms-tickets/common';

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

// req.session is an object that is created by the cookie session middleware . any info will be serialized by cookie session and insisde the cookie

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//v1 express catches err and sends it to middleware and sed resp back to whoo sent it 
// app.get('*', () => {
//     throw new NotFoundError();
// });



//v2 for any  type get post patch put delete
// app.all('*', () => {
//     throw new NotFoundError();
// });

//breaking it 

// app.get('*', async () => {
//     throw new NotFoundError();
// });



//v4

// as express states for async f invoked by route handlers and middleware you must pass them to the next() function and express will catch and process them

// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });


//v5 fuck the next
import 'express-async-errors';

// v3 copied from 4_micro
app.all('*', async (req, res) => {
    throw new NotFoundError();
});



app.use(errorHandler);


export { app };