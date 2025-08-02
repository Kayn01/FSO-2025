import axios from 'axios'
const baseUrl = 'http://localhost:3005/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token},
    }
    const response = await axios.get(baseUrl, config)
    return response.data
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token},
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, newObject ) => {
    const config = {
        headers: { Authorization: token},
    }
    const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
    return response.data
}

const remove = async (id) => {
    const config = {
        headers: { Authorization: token},
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

const addComment = async (blogId, commentContent) => {
    const blogRes = await axios.get(`${baseUrl}/${blogId}`)
    const blog = blogRes.data
    
    const newComment = {
        id: Date.now().toString(),
        content: commentContent
    }

    const updatedBlog = {
        ...blog,
        comments: [...blog.comments, newComment]
    }

    const response = await axios.put(`${baseUrl}/${blogId}`, updatedBlog)
    return response.data
}

export default { getAll, create, update, remove, setToken, addComment }