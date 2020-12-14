import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();//generate the id 

    //v1 
    // const response = await request(app)
    //     .get('/api/tickets/sagffhd')//400 for generic error handle 400 bug , the id not found
    //     .send();
    // console.log(response.body);

    await request(app).get(`/api/tickets/${id}`).send().expect(404);//some bug error  400 generic error fix
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price,
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});