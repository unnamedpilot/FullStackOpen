const { test, describe, beforeEach, expect, beforeAll } = require('@playwright/test')
const helper = require('./helper')

describe('Blog application', () => {

    beforeEach(async ({ page, request }) => {
        const user = {
            name: 'Alverth',
            username: 'unnamedpilot',
            password: 'secret'
        }
        await request.post('/api/test/reset')
        await request.post('/api/users', { data: user })
        await page.goto('/')

    })

    describe('Login', () => {
        beforeEach(async ({ page }) => {
            await page.getByText('log in').click()
        })
        test('login form is shown', async ({ page }) => {
            const usernameField = page.getByLabel('username')
            const passwordField = page.getByLabel('password')
            const loginButton = page.getByRole('button', { name: 'login' })

            await expect(usernameField).toBeVisible()
            await expect(passwordField).toBeVisible()
            await expect(loginButton).toBeVisible()
        })

        test('can be logged in successfully', async ({ page }) => {
            await helper.loginWith(page, 'unnamedpilot', 'secret')
            await expect(page.getByText('Alverth is logged in')).toBeVisible()
        })

        test('can not login with a wrong password', async ({ page }) => {
            await helper.loginWith(page, 'unnamedpilot', 'wrong')
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await helper.loginWith(page, 'unnamedpilot', 'secret')
        })
        test('a new blog can be created', async ({ page }) => {
            const title = 'Designing Data Intensive Systems'
            const author = 'Alverth'
            const url = 'alverth.site/ddia'
            await helper.createBlog(page, title, author, url)

            await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
            await expect(page.getByText(`new blog ${title} added`)).toBeVisible()
            await expect(page.getByText(title, { exact: true })).toBeVisible()
        })

        describe('when a blog exists', () => {
            beforeEach(async ({ page }) => {
                const title = 'Designing Data Intensive Systems'
                const author = 'Alverth'
                const url = 'alverth.site/ddia'
                await helper.createBlog(page, title, author, url)
                await page.getByRole('link', { name: 'blogs' }).click()
            })
            test('a blog can be liked', async ({ page }) => {
                const blogs = page.getByRole('list')
                await blogs.getByRole('link').click()
                const detailedBlog = page.getByTestId('blog')
                await detailedBlog.getByRole('button', { name: 'show', exact: true }).click()

                await detailedBlog.getByRole('button', { name: 'like' }).click()
                expect(detailedBlog.getByText('likes 1')).toBeVisible()
            })

            test('a blog can be removed by its owner', async ({ page }) => {
                const blogs = page.getByRole('list')
                await blogs.getByRole('link').click()
                const detailedBlog = page.getByTestId('blog')
                await detailedBlog.getByRole('button', { name: 'show', exact: true }).click()
                page.on('dialog', dialog => dialog.accept())
                await detailedBlog.getByRole('button', { name: 'remove' }).click()
                await expect(detailedBlog).not.toBeAttached()
        })

        test('only the owner can see the remove button', async ({ page, request }) => {
            const user = {
                name: 'Tester',
                username: 'thetester',
                password: 'secret2'
            }
            await request.post('/api/users', { data: user })

            await page.getByRole('button', { name: 'logout' }).click()
            await helper.loginWith(page, 'thetester', 'secret2')
            await expect(page.getByText('Tester is logged in')).toBeVisible()
            
            await page.getByRole('link', { name: 'blogs' }).click()
            const blogs = page.getByRole('list')
            await blogs.getByRole('link').click()
            const detailedBlog = page.getByTestId('blog')
            await detailedBlog.getByRole('button', { name: 'show'}).click()
            await expect(detailedBlog.getByRole('button', { name: 'remove' })).not.toBeAttached()
        })
        test('ensure blog post are being showing in ascending order considering likes', async ({ page, request }) => {
            await request.post('/api/test/blog')
            await page.reload()
            const blogs = await page.getByTestId('blog').all()
            let previous_value = Infinity

            for (const blog of blogs) {
                await blog.getByRole('button', { name: 'show' }).click()
                const text = await blog.innerText()
                const strLikesNumber = text.match(/likes \d+like/)[0].match(/\d+/)[0]
                const likesNumber = parseInt(strLikesNumber)
                expect(likesNumber).toBeLessThanOrEqual(previous_value)
                previous_value = likesNumber
            }

        })

    })




})



})