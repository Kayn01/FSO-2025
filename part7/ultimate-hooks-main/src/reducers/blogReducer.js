import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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
        }
    },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog} = blogSlice.actions

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

export default blogSlice.reducer