import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer' 
import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer'
import { Routes, Route, Link, useParams } from 'react-router-dom' 
import Users from './components/Users'
import User from './components/User' 
import Blog from './components/Blog'
import { initializeUsers } from './reducers/usersReducer'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// Keep useResource for notes and persons, it's fine
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl)
      .then(response => {
        setResources(response.data)
      })
      .catch(error => {
        console.error('Error fetching resources:', error)
      })
  }, [baseUrl])

  const create = async (resource) => {
    try{
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
      return response.data
    }catch(error){
      console.error('Error creating resource:', error)
      throw error
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}


const Notification = () => {
  const notification = useSelector(state => state.notification)

  if(!notification){
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    marginBottom: 10, 
    backgroundColor: 'lightgreen'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

const Home = ({
  user, blogs,
  handleLogout, handleBlogSubmit, handleLike, handleDelete,
  title, author, url,
  notes, handleNoteSubmit, content,
  persons, handlePersonSubmit, name, number
}) => {
  return (
    <div>
      <h2>Blog App</h2>

      <h3>Create New Blog</h3>
      <form onSubmit={handleBlogSubmit}>
        <div>
          title:
          <input {...title} />
        </div>
        <div>
          author:
          <input {...author} />
        </div>
        <div>
          url:
          <input {...url} />
        </div>
        <button type="submit">create</button>
      </form>

      <h3>Blogs</h3>
      {blogs.map(blog => (
        <p key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>{' '}
           {blog.author} (Likes: {blog.likes})
          <button onClick={() => handleLike(blog)}>like</button>
          <button onClick={() => handleDelete(blog)}>delete</button>
        </p>
      ))}

      <h2>Notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>Persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}



const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const username = useField('text')
  const password = useField('password')

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user) 

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers()) 
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      await dispatch(loginUser({
        username: username.value,
        password: password.value
      }))
      dispatch(setNotification(`Welcome ${username.value}`, 5))
      username.onChange({ target: { value: ''}})
      password.onChange({ target: { value: ''}})
    }catch(exception){
      dispatch(setNotification('Wrong username or password', 5))
      console.error('Login error:', exception)
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setNotification('Logged out', 5))
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try{
      const newBlogObject = {
        title: title.value,
        author: author.value,
        url: url.value,
        likes: 0,
        user: user ? { id: user.id, username: user.username, name: user.name } : null // Ensure user info is attached
      }
      dispatch(createBlog(newBlogObject))
      dispatch(setNotification(`a new blog '${newBlogObject.title}' by ${newBlogObject.author} added`, 5))

      title.onChange({target: { value: ''}})
      author.onChange({target: { value: ''}})
      url.onChange({target: { value: ''}})
    }catch(exception){
      console.error('Error creating blog', exception)
      dispatch(setNotification('Error creating blog', 5))
    }
  }

  const handleLike = async (blog) => {
    try{
      dispatch(likeBlog(blog))
      dispatch(setNotification(`you liked '${blog.title}'`, 3))
    }catch(exception){
      console.error('Error liking blog:', exception)
      dispatch(setNotification(`Error liking '${blog.title}'`, 5))
    }
  }

  const handleDelete = async (blog) => {
    if(window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)){
      try{
        dispatch(deleteBlog(blog.id))
        dispatch(setNotification(`blog '${blog.title}' removed`, 5))
      }catch(exception){
        console.error('Error deleting blog:', exception)
        dispatch(setNotification(`Error removing '${blog.title}'`, 5))
      }
    }
  }

  const handleNoteSubmit = async (event) => {
    event.preventDefault()
    try {
      await noteService.create({ content: content.value }) // Use content.value
      dispatch(setNotification(`a new note '${content.value}' created`, 5))
      content.onChange({ target: {value: ''}})
    }catch(error){
      dispatch(setNotification('Error creating note', 5))
    }
  }
 
  const handlePersonSubmit = async (event) => {
    event.preventDefault()
    try {
      await personService.create({ name: name.value, number: number.value})
      dispatch(setNotification(`a new person '${name.value}' added`, 5))
      name.onChange({ target: { value: '' }})
      number.onChange({ target: { value: '' }})
    }catch(error){
      dispatch(setNotification('Error adding person', 5))
    }
  }

  const padding = {
    padding: 5
  }

  if(user === null){
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input {...username} />
          </div>
          <div>
            password
            <input {...password} />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification/>

      {/* Navigation Bar */}
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={
          <Home
            user={user} blogs={blogs}
            handleLogout={handleLogout} handleBlogSubmit={handleBlogSubmit}
            handleLike={handleLike} handleDelete={handleDelete}
            title={title} author={author} url={url}
            notes={notes} handleNoteSubmit={handleNoteSubmit} content={content}
            persons={persons} handlePersonSubmit={handlePersonSubmit} name={name} number={number}
          />
        } />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  )
}

export default App