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

//connect to db
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }


    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }


    try {
        await mongoose.connect(process.env.MONGO_URI, {
            //configuration topology
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
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

