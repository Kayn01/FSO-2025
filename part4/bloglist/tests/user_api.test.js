const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('../utils/list_helpers')
const assert = require('assert')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluulu',
            name: 'Maaaata',
            password: 'slaala',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error && (result.body.error.includes('unique') || result.body.error.includes('duplicate key')))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Missing Username',
            password: 'validpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert(result.body.error.includes('username must be at least 3 characters long'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 and message if password is missing', async () =>{
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'user',
            name: 'missingPass',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert(result.body.error.includes('password must be at least 3 characters long'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})