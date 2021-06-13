const supertest = require('supertest')
const app = require('../../../app');
const User = require('./../../../src/models/user')

describe('Login', () => {
    const completeUserPayload = {
        'password': 'password',
        'email': 'example2@example.com'
    }
    const userPayloadWithInvalidEmail = {
        'password': 'password',
        'email': 'example@example'
    }

    const userPayloadWithIncorrectEmail = {
        'password': 'password',
        'email': 'example@example.com'
    }

    before(async () => {
        const user = new User({
            'firstName': 'FirstName',
            'lastName': 'LastName',
            'password': 'password',
            'email': 'example2@example.com'
        })

        await user.save()
    })

    describe('# Login', async () => {
        it('Should store new user data', async () => {
            await supertest(app)
                .post('/api/auth/login')
                .send(completeUserPayload)
                .expect(200)
        })

        it('Should give Unprocessable error', async () => {
            await supertest(app)
                .post('/api/auth/login')
                .send(userPayloadWithInvalidEmail)
                .expect(422)
        })

        it('Should give unauthorized error', async () => {
            await supertest(app)
                .post('/api/auth/login')
                .send(userPayloadWithIncorrectEmail)
                .expect(401)
        })
    })
})