import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type='success') => {
    setNotification({ message, type})
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('login successful', 'success');
    }catch(exception){
      showNotification('Wrong credentials', 'error')

    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try{
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      blogService.setToken(null)
      showNotification(null)
    }catch(exception){
      showNotification('Error logging out user', 'error')
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    try{
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added`, 'success')
  
    }catch(exception){
      showNotification(`Error adding blog: ${exception.response.data.error || exception.message}`, 'error')
     
    }

  }

  const Notification = ({ notification }) => {
    if(!notification){
      return null
    }

    const style= {
      color: notification.type === 'error' ? 'red' : 'green',
      background: 'lightgrey',
      padding: 10,
      borderStyle: 'solid',
    }

    return (
      <div style={style}>
        {notification.message}
      </div>
    )
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification notification={notification}/>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <>    
    <h2>blogs</h2>
    <Notification notification={notification}/>
    <div>{user.username} logged in <button onClick={handleLogout}>logout</button></div> 
    

    <h2>create new</h2>
    <form onSubmit={addBlog}>

      <div>
        title
          <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
          <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>      

    
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    </>
    
    
  )

  return (
    <div>

      {user === null ?
      loginForm() :
      blogForm()
    }
     
      
    </div>
  )
}

export default App