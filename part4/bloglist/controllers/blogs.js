const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
    // Blog.find({}).then(blogs => {
    //     response.json(blogs)
    // })
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    if(!user){
        return response.status(401).json({ error: 'authentication required' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user._id
    })

    try{
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    }catch(error){
        console.error('Error saving blog:', error.message)
        response.status(400).json({ error: 'Failed to save blog'})
    }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    try {
        const id = request.params.id
        const user = request.user

        if (!user) {
            return response.status(401).json({ error: 'authentication required' })
        }

        const blog = await Blog.findById(id)

        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if (blog.user.toString() !== user.id) {
            return response.status(401).json({ error: 'unauthorized to delete this blog' })
        }

        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        console.error('Error deleting blog:', error.message)
        response.status(400).json({ error: error.name })
    }
})


blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const id = request.params.id

    const updatedBlogData = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedBlogData, { new: true, runValidators: true})

        if(updatedBlog){
            response.json(updatedBlog)
        }else{
            response.status(404).json({ error: 'Blog not found'})
        }
    } catch (error) {
        console.error('Error updating blog:', error.message)
        response.status(400).json({ error: error.name})
    }
})


module.exports = blogsRouter