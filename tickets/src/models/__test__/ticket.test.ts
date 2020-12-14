import { Ticket } from '../Ticket';

it('Implements optimistic concurrency control', async (done) => {

    //create an instance of a ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    //save the ticket to the db
    await ticket.save();

    //fetch the ticket twice
    const firsetInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    
    //make two separate changes to the tickets we fetched
    firsetInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    //save the first fetched ticket
    await firsetInstance!.save();


    //v1 jest own expect looks like this
    // expect(async () => {
    //     await secondInstance!.save();
    // }).toThrow();

    //save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();//to help jet figure it out when the test is finished we need to receive a callback and return it we could return nothing but the jest wont stop the test. manually invoke done () to specify jest that we are done with the test
    }

    throw new Error('Should not reach this point');
});

it('Increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: '123',
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});
