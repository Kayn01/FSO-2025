import axios from 'axios'
const baseUrl = 'http://localhost:3005/api/login'

const login = async credentials => {
    const response = await axios.get(baseUrl, credentials)
    return response.data
}

export default { login }