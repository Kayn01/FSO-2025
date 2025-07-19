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
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('log in')
        await expect(locator).toBeVisible()
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            loginWith(page, 'david', 'hill')
            await expect(page.getByText('david logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            loginWith(page, 'david', 'wrong')

            await expect(page.getByText('Wrong credentials')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            loginWith(page, 'david', 'hill')
            await expect(page.getByText('david logged in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
 
            await createBlog(page, 'newest blog', 'jocab', 'www.glom.com')
            
            await expect(page.getByText('newest blog jocab')).toBeVisible()
        })

        test('a blog can be liked', async ({page}) => {

            await createBlog(page, 'newest blog', 'jocab', 'www.glom.com')
            await expect(page.getByText('newest blog jocab')).toBeVisible()
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('A blog "newest blog" by jocab likes updated')).toBeVisible()
        })

        test('a blog can be deleted with the right user', async ({page}) => {
      
            await createBlog(page, 'newest blog', 'jocab', 'www.glom.com')
            
            page.on('dialog', async dialog => {
                expect(dialog.type()).toBe('confirm');
                expect(dialog.message()).toContain('Remove blog "newest blog" by jocab?');
                await dialog.accept(); // 
                
            })
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.getByText('Blog "newest blog" by jocab removed')).toBeVisible()
        })

        test('only the user who added the blog sees delete button', async ({page, request}) => {
   
            const blogTitle = 'newest blog by david';
            const blogAuthor = 'jocab';
            const blogUrl = 'www.glom.com';

            await createBlog(page, blogTitle, blogAuthor, blogUrl);
            await expect(page.getByText(`A new blog "${blogTitle}" by ${blogAuthor} added`)).toBeVisible();

            await page.getByRole('button', { name: 'logout' }).click();
            await expect(page.getByText('log in to application')).toBeVisible();

            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'John Dill',
                    username: 'john',
                    password: 'dill'
                }
            });

            await loginWith(page, 'john', 'dill');
            await expect(page.getByText('john logged in')).toBeVisible();

            const blogTitleAndAuthorText = page.getByText(`${blogTitle} ${blogAuthor}`);
            await expect(blogTitleAndAuthorText).toBeVisible(); 

            const blogContainer = page.locator('div')
                .filter({
                    has: blogTitleAndAuthorText, 
                    has: page.getByRole('button', { name: 'view' }) 
                })
                .first(); 
            await expect(blogContainer).toBeVisible(); 

            await blogContainer.getByRole('button', { name: 'view' }).click();

            await expect(blogContainer.getByRole('button', { name: 'remove' })).not.toBeVisible();
        })

        test('blogs are arranged in the order according to most likes', async({page,request}) => {
            const likeAndHideBlog = async (title, author, likesCount) => {
                const blogLocator = page.locator('.blog-item').filter({ hasText: `${title} ${author}` }).first()
                await expect(blogLocator).toBeVisible()
                await blogLocator.getByRole('button', { name: 'view' }).click()

                const likeButton = blogLocator.getByRole('button', { name: 'like' })

                for (let i = 1; i <= likesCount; i++) {
                    await likeButton.click();
            
                    await expect(blogLocator.getByText(new RegExp(`likes\\s+${i}`, 'i'))).toBeVisible({ timeout: 3000 })
                }

                await blogLocator.getByRole('button', { name: 'hide' }).click()
            };

            await createBlog(page, 'one', 'jay', 'www.url1.com')
            await expect(page.getByText('A new blog "one" by jay added')).toBeVisible()
            await createBlog(page, 'two', 'job', 'www.url2.com')
            await expect(page.getByText('A new blog "two" by job added')).toBeVisible()
            await createBlog(page, 'three', 'joy', 'www.url3.com')
            await expect(page.getByText('A new blog "three" by joy added')).toBeVisible()

            await likeAndHideBlog('one', 'jay', 5)
            await likeAndHideBlog('two', 'job', 2)

            await page.reload()

            const viewButtons = await page.getByRole('button', { name: 'view' }).all()
            for (const button of viewButtons) {
                await button.click()
            }

            await page.waitForTimeout(500)

            const blogElements = await page.locator('.blog-item').all()
        
            const blogs = []
            for (const blog of blogElements) {
                const blogText = await blog.textContent()
                const likesMatch = blogText.match(/Likes\s(\d+)/i)
                const likes = likesMatch ? parseInt(likesMatch[1]) : 0
                blogs.push({ text: blogText.trim(), likes })
            }

            const sortedLikes = [...blogs.map(b => b.likes)].sort((a, b) => b - a)
            expect(blogs.map(b => b.likes)).toEqual(sortedLikes)

        })

        
    })
})