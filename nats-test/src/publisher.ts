import nats from 'node-nats-streaming';
import {TicketCreatePublisher} from './events/ticket-created-publisher'
console.clear();
                                    //client id
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect',async () => {
    console.log('Publisher connected to NATS');

    // const data = JSON.stringify({//stringify due to nature of the share , not raw objects
    //     id: '123',
    //     title: 'concert',
    //     price: 20,
    // });
    // //the publish () function in base publisher
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published');
    // });

    // const publisher = new TicketCreatePublisher(stan);
    // publisher.publish({//async
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });


//v2 async await
    const publisher = new TicketCreatePublisher(stan);
    try {
        await publisher.publish({//async
            id: '123',
            title: 'concert',
            price: 20
        });
    }
    catch (err) {
        console.error(err);
    }

});



