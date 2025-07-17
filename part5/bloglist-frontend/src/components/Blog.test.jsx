import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

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