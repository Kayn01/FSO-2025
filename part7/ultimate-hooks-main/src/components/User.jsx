import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
    const { id }  = useParams()

    const users = useSelector(state => state.users)
    const blogs = useSelector(state => state.blogs)
    const user = users.find(u => u.id === id)

    if(!user){
        return null
    }

    const userBlogs = blogs.filter(blog => blog.user && blog.user.id === user.id)

    return (
        <div>
            <h2>{user.name || user.username}</h2>
            <h3>added blogs</h3>
            {userBlogs.length === 0 ? (
                <p>No blogs added by this user yet.</p>
            ) : (
                <ul>
                    {userBlogs.map(blog => (
                        <li key={blog.id}>{blog.title}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default User