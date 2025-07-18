import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

const blog = {
        title : 'rice porridge',
        author: 'yono',
        url: 'http://www.ypo.com',
        likes: 2,
        user: { username: 'user', id: '456'}
    }

test('renders content', () => {
    

    render(<Blog blog = {blog} />)

    const element = screen.getByText('rice porridge yono', { exact: false})
    expect(element).toBeDefined()

    expect(screen.queryByText('http://www.ypo.com')).toBeNull()
    expect(screen.queryByText('likes 2')).toBeNull()
    
})

test('clicking the button expand details', async () => {


    render(
        <Blog blog = {blog} />
    )

    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)

    expect(screen.getByText('http://www.ypo.com')).toBeDefined()
    expect(screen.getByText('likes 2')).toBeDefined()
})

test('clicking like button twice make like button event handler called twice', async () => {
    const mockHandler = vi.fn()

    render(
        <Blog blog = {blog} handleLike={mockHandler}/>
    )

    const viewButton = screen.getByText('view')
    await userEvent.click(viewButton)
    
    const likeButton = screen.getByText('like')

    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)


})

test('<BlogForm /> calls the event handler as props with right details when new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const {container} = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Blog Author')
    await user.type(urlInput, 'http://testblogurl.com')

    const createButton = screen.getByRole('button', {name: 'create'})
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'Test Blog Title',
        author: 'Test Blog Author',
        url: 'http://testblogurl.com',
    })
})