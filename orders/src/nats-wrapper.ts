import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;// //? undef for some preiods of time 

    get client() {//a getter for filering undef cllient
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }

        return this._client;
    }
//former connect function from listener ts in nats-test
    //the params acts as dependency inversion
    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        //v1
        // this._client.on('connect', () => { console.log('connected to nats')});


        // gracefully shutdown //v3
        /********************/
        //the fix for that 30 s time perisistence

        // this._client.on('close', () => {
        //     console.log('NATS connection closed!');
        //     process.exit();//        <<<<this is a liability
        // });

        //replaced with getters
        // process.on('SIGINT', () => this._client.close());
        // process.on('SIGTERM', () => this._client.close());

        // process.on('SIGINT', () => this.client.close());
        // process.on('SIGTERM', () => this.client.close());
        /********************/
        
        //v4 is refactoring the v3 is moved in the index

        //v2 wrap it in a promise
        return new Promise((resolve, reject) => {


        //v1 of implementation

            //ts is thinking tah we could reasign or unnasigned this_client between outside and inside
            //the fix of the bug , the temp fix is with !
            // this._client!.on('connect', () => {
            //     console.log('connect to nats');
            //     resolve();
            // })
            // this._client!.on('error', (err) => {
            //     reject(err);
            // });

        //v2 of implementation
            
            this.client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });

            this.client.on('error', (err) => {
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();
