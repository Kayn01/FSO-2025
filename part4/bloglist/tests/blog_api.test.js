const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Diminishing return',
        author: 'cheryl',
        url: 'https://place.com/',
        likes: 7
    },
    {
        title: 'probable encounter',
        author: 'kay',
        url: 'https://time.com/',
        likes: 5
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

describe('Blog API', () => {
    test('blogs are returned as json and have the correct amount', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialBlogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})