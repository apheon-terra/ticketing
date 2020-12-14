import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import  mongoose from 'mongoose'
const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    return ticket;
};

it('fetches orders for an particular user', async () => {
    
    //create three tickets
    
    //create one order as User#1
    
    //create one order as User#2
    
    //make request to get orders for user #2
    
    //make sure we only got the orders for user #2

    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)//supertest lexic 
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({
            ticketId: ticketOne.id,
        })
        .expect(201);
    // const repsonseOne =...
    //we will destructure and rename at the same time , this is why looks so fucking confusing
    //destructure the body prop and rename it as an alias for lizibility
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticketTwo.id,
        })
        .expect(201);
    // console.log(orderOne);
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticketThree.id,
        })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
