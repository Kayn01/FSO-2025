const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const helper = require('../utils/list_helpers'); 
const api = supertest(app);

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
];

const blogsInDb = async () => await helper.blogsInDb();
const usersInDb = async () => await helper.usersInDb();

let token = null;
let testUserId = null;

beforeAll(async () => {

    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10); 
    const user = new User({ username: 'testuser', name: 'Test user', passwordHash });
    const savedUser = await user.save();
    testUserId = savedUser._id;

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

    token = loginResponse.body.token;
});

beforeEach(async () => {
    await Blog.deleteMany({});

    for(let blog of initialBlogs){
        let blogObject = new Blog({ ...blog, user: testUserId });
        await blogObject.save();
    }
});

describe('Blog API', () => {
    test('blogs are returned as json and have the correct amount', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toHaveLength(initialBlogs.length);
    });

    test('all blogs have an id property and no _id property', async () => {
        const response = await api.get('/api/blogs');

        response.body.forEach(blog => {
            expect(blog.id).toBeDefined();
            expect(blog._id).not.toBeDefined();
        });
    });

    describe('addition of a new blog', () => {
        test('a valid blog can be added with a token', async () => {
            const newBlog = {
                title: 'fated place & time',
                author: 'John doe',
                url: 'https://placeandtime/async-await',
                likes: 12
            };

            const blogsAtStart = await blogsInDb(); 

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/); 
            
            const blogsAtEnd = await blogsInDb(); 
            expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

            const titles = blogsAtEnd.map(r => r.title);
            expect(titles).toContain('fated place & time');
        });

        test('blog without likes property defaults to 0 likes with a token', async () => {
            const newBlogWithoutLikes = {
                title: 'Blog without likes',
                author: 'jerry',
                url: 'https://thisisblog.com/nothing'
            };

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}` )
                .send(newBlogWithoutLikes)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            expect(response.body.likes).toBe(0);

            const blogs = await Blog.find({}); 
            const addedBlog = blogs.find(blog => blog.title === 'Blog without likes');

            expect(addedBlog.likes).toBe(0);
        });

        test('blog without title is not added and returns 400 with a token', async () => {
            const newBlogWithoutTitle = {
                author: 'jack white',
                url: 'https://missing.com/title',
                likes: 5
            };

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlogWithoutTitle)
                .expect(400);

            const blogsAtEnd = await blogsInDb(); 
            expect(blogsAtEnd).toHaveLength(initialBlogs.length);
        });

        test('blog without url is not added and returns 400 with a token', async () => {
            const newBlogWithoutUrl = {
                title: 'Missing URL',
                author: 'jack orange',
                likes: 5
            };

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlogWithoutUrl)
                .expect(400);
            
            const blogsAtEnd = await blogsInDb(); 
            expect(blogsAtEnd).toHaveLength(initialBlogs.length);
        });

        test('adding blog fails with status 401 unauthorized if token is not provided', async () => {
            const newBlog = {
                title: 'Unauthorized',
                author: 'unauthor',
                url: 'https://example.com/unauth',
                likes: 1,
            };

            await api
                .post('/api/blogs')
                .send(newBlog) 
                .expect(401)
                .expect('Content-Type', /application\/json/)
                .expect(res => {
                    expect(res.body.error).toBe('authentication required');
                });

            const blogsAtEnd = await blogsInDb(); 
            expect(blogsAtEnd).toHaveLength(initialBlogs.length);
        });
    });
});

describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid and user is authorized', async () => {
        const blogsAtStart = await blogsInDb(); 
        const blogToDelete = blogsAtStart[0]; 

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`) 
            .expect(204);
        
        const blogsAtEnd = await blogsInDb(); 
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
        const titles = blogsAtEnd.map(blog => blog.title);
        expect(titles).not.toContain(blogToDelete.title);
    });
});

describe('updating a blog', () => {
    test('succeeds with status code 200 and update likes', async () => {
        const blogsAtStart = await blogsInDb(); 
        const blogToUpdate = blogsAtStart[0];
        const updatedLikes = blogToUpdate.likes + 5;

        const updatedBlogData = { ...blogToUpdate, likes: updatedLikes};

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.likes).toBe(updatedLikes);

        const blogAfterUpdate = await Blog.findById(blogToUpdate.id);
        expect(blogAfterUpdate.likes).toBe(updatedLikes);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
