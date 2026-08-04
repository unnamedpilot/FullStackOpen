const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'show login' }).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, note) => {
    await page.getByRole('button', { name: 'show notes' }).click()
    await page.getByLabel('content').fill(note)
    await page.getByRole('button', { name: 'submit' }).click()
}

module.exports = { loginWith, createNote }