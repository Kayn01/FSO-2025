const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then(result => {
        response.status(202).json(result)
    })
    .catch(error => {
        console.error('Error saving blog:', error.message)
        response.status(400).json({ error: 'Failed to save blog' })
    })
})

module.exports = blogsRouter