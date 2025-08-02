import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/usersReducer'
import { initializeBlogs } from '../reducers/blogReducer' 

const Users = () => {
  const dispatch = useDispatch()

  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    if (!users || users.length === 0) {
      dispatch(initializeUsers())
    }
    if (!blogs || blogs.length === 0) { 
      dispatch(initializeBlogs())
    }
  }, [dispatch, users, blogs]) 

 
  const getBlogCountForUser = (userId) => {
    if (!blogs || !Array.isArray(blogs) || blogs.length === 0) {
      return 0
    }
    return blogs.filter(blog => blog.user && blog.user.id === userId).length
  }

  if (!users || !Array.isArray(users) || users.length === 0) {
    return <div>Loading users...</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {user.name || user.username}
              </td>
              <td>{getBlogCountForUser(user.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users;