const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'David hill',
                username: 'david',
                password: 'hill'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in')
        await expect(locator).toBeVisible()
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('david')
            await page.getByTestId('password').fill('hill')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('david logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('david')
            await page.getByTestId('password').fill('wrong')
            await page.getByRole('button',  { name: 'login' }).click()

            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            loginWith(page, 'david', 'hill')
            await expect(page.getByText('david logged in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            createBlog(page, 'newest blog', 'jocab', 'www.glom.com')
            await expect(page.getByText('A new blog "newest blog" by jocab added')).toBeVisible()
        })

        test('a blog can be liked', async ({page}) => {
            createBlog(page, 'newest blog', 'jocab', 'www.glom.com')
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('A blog "newest blog" by jocab likes updated')).toBeVisible()
        })
    })
})