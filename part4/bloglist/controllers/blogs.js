const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
    // Blog.find({}).then(blogs => {
    //     response.json(blogs)
    // })
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })

    try{
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }catch(error){
        console.error('Error saving blog:', error.message)
        response.status(400).json({ error: 'Failed to save blog'})
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try{
        const id = request.params.id
        const result = await Blog.findByIdAndDelete(id)

        if(result){
            response.status(204).end()
        }else{
            response.status(404).json({error: 'Blog not found'})
        }
    } catch (error){
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