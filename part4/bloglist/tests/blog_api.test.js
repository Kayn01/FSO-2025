const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'return to future',
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
}, )

describe('Blog API', () => {
    test('blogs are returned as json and have the correct amount', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('all blogs have an id property and no _id property', async () => {
        const response = await api.get('/api/blogs')

        response.body.forEach(blog => {
            expect(blog.id).toBeDefined()
            expect(blog._id).not.toBeDefined()
        })
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'fated place & time',
            author: 'John doe',
            url: 'https://placeandtime/async-await',
            likes: 12
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-type', /application\/json/)
        
        const response  = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        expect(response.body).toHaveLength(initialBlogs.length + 1)
        expect(titles).toContain('fated place & time')
    })

    test('blog without likes property defaults to 0 likes', async () => {
        const newBlogWithoutLikes = {
            title: 'Blog without likes',
            author: 'jerry',
            url: 'https://thisisblog.com/nothing'
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)

        const blogs = await Blog.find({})
        const addedBlog = blogs.find(blog => blog.title === 'Blog without likes')

        expect(addedBlog.likes).toBe(0)
    })

    test('blog without title is not added and returns 400', async () => {
        const newBlogWithoutTitle = {
            author: 'jack white',
            url: 'https://missing.com/title',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitle)
            .expect(400)

        const blogsAtEnd = await api.get('/api/blogs')
        expect(blogsAtEnd.body).toHaveLength(initialBlogs.length)
    })

    test('blog without url is not added and returns 400', async () => {
        const newBlogWithoutUrl = {
            title: 'Missing URL',
            author: 'jack orange',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .expect(400)
        
        const blogsAtEnd = await api.get('/api/blogs')
        expect(blogsAtEnd.body).toHaveLength(initialBlogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})