const { test, expect, describe, beforeEach, beforeAll } = require('@playwright/test')
const helper = require('./helper')

describe('note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'secret'
            }
        })
        await page.goto('/')
    })
    describe('when not logged in', () => {

        test('can open the frontend app', async ({ page }) => {
            const locator = page.getByText('Notes')
            await expect(locator).toBeVisible()
            expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025'))
                .toBeVisible()
        })

        test('user can login', async ({ page }) => {
            await helper.loginWith(page, 'mluukkai', 'secret')
            await expect(page.getByText('Matti Luukkainen is logged in')).toBeVisible()
        })

        test('login fails with wrong password', async ({ page }) => {
            await helper.loginWith(page, 'mluukkai', 'wrong')
            const errorDiv = await page.locator('.error')
            await expect(errorDiv).toContainText('wrong credentials')
            await expect(errorDiv).toHaveCSS('border-style', 'solid')
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await helper.loginWith(page, 'mluukkai', 'secret')
        })

        test('user can create notes', async ({ page }) => {
            await helper.createNote(page, 'This thing should exist by now')
            await expect(page.getByText('This thing should exist by now')).toBeVisible()
        })
        describe('when there is a note', async () => {
            beforeEach(async ({ page }) => {
                await helper.createNote(page, 'A playwright note')
            })

            test('can change note\'s important', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            })

        })

        describe('when several notes exists', () => {
            beforeEach(async ({ page }) => {
                await helper.createNote(page, 'first note')
                await helper.createNote(page, 'second note')
            })

            test('one of them can be made unimportant', async ({page}) => {
                const row = page.getByRole('row')
                    .filter({ has: page.getByText('second note') })
                await row.getByText('make not important').click()
                await expect(row.getByRole('button', {name: 'make important'})).toBeVisible()
            })
        })
    })
})
