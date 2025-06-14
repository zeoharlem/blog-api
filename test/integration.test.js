const mongoose = require('mongoose')
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const supertest = require('supertest')
const UserModel = require('../models/User');
const server = require('../server')


beforeEach(async () => {
    await mongoose.connect(config.MONGO_URI)
})

afterAll(async () => {
    await mongoose.disconnect()
})

describe('Auth Route', ()=>{
    it ('it should signup a user', async ()=>{
        const response = await supertest(server).post('/register')
            .set('content-type', 'application/json')
            .send({
                email: "a@fake.com",
                first_name: "Benjamin",
                last_name: "Simpson",
                password: "1234567"
            })
        expect(response.status).toBe(201)
    })

    it('should login a user', async () => {

        // login user
        const response = await request(app)
            .post('/login')
            .set('content-type', 'application/json')
            .send({
                email: 'a@fake.com',
                password: '1234567'
            });


        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')
    })
})


describe('BlogPost Route', ()=>{

    it('it should fail without token', async () => {
        const res = await request(app).get('/v1/posts/');
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('No token provided.');
    });
})