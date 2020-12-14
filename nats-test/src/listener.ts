import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';//generate random bytes
import { TicketCreatedListener} from './events/ticket-created-listener'
console.clear();

//creating the client
//V1 WAS '123'
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

//listen for connect event

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    //the fix for that 30 s time perisistence
    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });


    new TicketCreatedListener(stan).listen();
});


//fix for 30 sec offline persistance ,interrupt messages , not 100% on windows
//on out or restart, interrr sig or terminate sig for this process when doing ctrl+c or rs 
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

//rs restart nats to pub listen

// Localhost: 8222 / streaming

// Localhost:8222/streaming/channelsz?subs=1

// when restart a listener / sub i stopped that listener , I restarted one so the copy of that listener that client that I was running with the subscription it was closed one and i created a new one, but for a brief period of time nats streaming server is just going to assume that maybe there is some momentary interrupt in com or conn with that client so it will still persist it for a brief period of time thinking it will come back online, and it will wait wit h the sub registred and when the wait time expires it will remove from the subscriptions

// configurable with the               '-hbi',
// '5s',
// '-hbt',
// '5s',
// '-hbf',
// '2',

//v2 configure for time perisistence of offline subs/pubs



