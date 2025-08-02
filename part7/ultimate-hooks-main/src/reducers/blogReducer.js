import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state,action) {
            return action.payload.sort((a, b) => b.likes - a.likes)
        },
        appendBlog(state, action){
            state.push(action.payload)
            state.sort((a, b) => b.likes - a.likes)
        },
        updateBlog(state, action){
            const updatedBlog = action.payload
            return state
                .map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
                .sort((a, b) => b.likes - a.likes)
        },
        removeBlog(state,action){
            const idToRemove = action.payload
            return state.filter(blog => blog.id !== idToRemove)
        },
        addCommentToBlog(state, action){
            const updatedBlog = action.payload
            return state.map(blog =>
                blog.id === updatedBlog.id ? updatedBlog : blog
            ).sort((a, b) => b.likes - a.likes)
        }
    },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog, addCommentToBlog} = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs =await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blogObject) => {
    return async dispatch => {
        const newBlog = await blogService.create(blogObject)
        dispatch(appendBlog(newBlog))
    }
}

export const likeBlog = (blog) => {
    return async dispatch => {
        const likedBlog = { ...blog, likes: blog.likes + 1}
        const returnedBlog = await blogService.update(blog.id, likedBlog)
        dispatch(updateBlog(returnedBlog))
    }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlog(id))
    }
}

export const commentBlog = (blogId, commentContent) => {
    return async dispatch => {
        try {
            const updatedBlog = await blogService.addComment(blogId, commentContent)
            dispatch(addCommentToBlog(updatedBlog))
            dispatch(setNotification('Comment added!', 3))
        }catch(error){
            dispatch(setNotification(`Error adding comment: ${error.message}`, 5))
            console.error('Error adding comment:', error)
        }
    }
}

export default blogSlice.reducer