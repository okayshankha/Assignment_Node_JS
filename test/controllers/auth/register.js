const supertest = require('supertest')
const app = require('../../../app');

describe('Register', () => {
    const completeUserPayload = {
        'firstName': 'FirstName',
        'lastName': 'LastName',
        'password': 'password',
        'email': 'example@example.com'
    }
    const userPayloadWithInvalidEmail = {
        'firstName': 'FirstName',
        'lastName': 'LastName',
        'password': 'password',
        'email': 'example@example'
    }




    describe('# Register', async () => {
        it('Should store new user data', async () => {
            await supertest(app)
                .post('/api/auth/register')
                .send(completeUserPayload)
                .expect(201)
        })

        it('Should give conflict error', async () => {
            await supertest(app)
                .post('/api/auth/register')
                .send(completeUserPayload)
                .expect(409)
        })

        it('Should give unprocessable entity error', async () => {
            await supertest(app)
                .post('/api/auth/register')
                .send(userPayloadWithInvalidEmail)
                .expect(422)
        })
    })
})