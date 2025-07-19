
const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()

}


const createBlog = async (page, title, author, url) => {
    const newBlogButton = page.getByRole('button', { name: 'new blog' });

    if (await newBlogButton.isVisible()) {
        await newBlogButton.click();
    }

    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

export { loginWith, createBlog }