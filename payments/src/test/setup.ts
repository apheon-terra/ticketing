import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?:string): string[];
        }
    }
}

let mongo: any;//acccess to multi functions beforeAll and afterAll


jest.mock('../nats-wrapper.ts');//always use fake nats
process.env.STRIPE_KEY ='sk_test_51HxzdEG23zb0WP2zfrVROSln9qxjyFJhH3m8amCP4SK86wOoQo1OlLlMdEIzwmfXT7KdWxZfYvzZYzt3RRDemJmX00pX2Ve8FM'
//the secret needs to be defined asap because it's going to the instant that we first require in the stripe file
beforeAll(async () => {

    process.env.JWT_KEY = 'asdf';//so we set it manually because now the app is splitted

    /*const*/ mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    //perform sanitation

    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});



//easy of use , available in the app inside test environment

//faking a cookie
global.signin = (id?:string) => {

    //build jwt payload
    const payload = {
        //v1 initial we had only one id so we could not test some edge cases , hence for every call on signin we generate a new cookie 
        // id: 'asfsdg',
        //v2 uniq id
        id: id ||new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    //create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);//dont sweat is defined

    //build session object
    const session = { jwt: token };

    //turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    //take json and encode base 64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`express:sess=${base64}`];
};
