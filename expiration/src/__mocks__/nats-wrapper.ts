export const natsWrapper = {
    client: {
        publish: jest
            .fn()//without it the implementation is fake, provide testing and parameter monitoring
            .mockImplementationOnce(//without it the implementation is fake, with them the implementation is mocked . mocked vs fakedfunctions. mocked allows us to make tests or expectations around it 
                //mockimplemetatino hadles the execution of the body and invoke it to make sure publisher is happy
                (subject: string, data: string, callback: () => void) => {
                    callback();
                }
            ),
    },
};

//between test we need to reset data
//go to setup
