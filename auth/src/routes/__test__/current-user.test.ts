import request from 'supertest';
import { app } from '../../app';

it('response with details about the current user', async () => {
    //v1
    // await request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         email: 'test@test.com',
    //         password: 'password'
    //     })
    //     .expect(201);

    //v2
    // const authResponse =await request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         email: 'test@test.com',
    //         password: 'password'
    //     })
    //     .expect(201);

    // const cookie = authResponse.get('Set-Cookie');

    // const response = await request(app)
    //     .get('/api/users/currentuser')
    //     .set('Cookie', cookie)
    //     .send()
    //     .expect(200);

    //v3
    //this is after we figure it  out that supertest does not handle cookies
    const cookie = await global.signin(); //without this , body bellow is null
    
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)//previous cookie is not transmited courtesy of supertest
        .send()
        .expect(200);
    
    //console.log(response.body)//=> supertest does not manage cookies for us automatically like postman or browser
    
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('response with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});
