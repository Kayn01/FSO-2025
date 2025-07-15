const Blog = require('../models/blog') // import blog model
const blogsRouter = require('express').Router() // the router so it could directly route to /
const { userExtractor } = require('../utils/middleware') // get user info

blogsRouter.get('/', (request, response) => { //when browser get get request
  Blog.find({}) // search in blog model
    .populate('user', { username: 1, name: 1, id: 1 }) // show user tab for username, name, id
    .then(blogs => {
      response.json(blogs) // return all blogs that found in json format
    })
})

blogsRouter.post('/', userExtractor, async (request, response) => { //when browser receive post request, asyncly
  const user = request.user
  const blog = new Blog(request.body)

  blog.likes = blog.likes | 0
  blog.user = user._id

  if (!blog.title || !blog.url) {
    return response.status(400).send({ error: 'title or url missing' })
  }

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogsRouter