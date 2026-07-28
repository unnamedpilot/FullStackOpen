import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { beforeEach } from 'vitest'

let addBlogMock
let showNotificationMock

describe('<BlogForm/>', () => {
  beforeEach(() => {
    showNotificationMock = vi.fn()
    addBlogMock = vi.fn()
    render(
      <BlogForm
        showNotification={showNotificationMock}
        addBlog={addBlogMock}
      />,
    )
  })

  test('when submiting a form it calls the callback given in props', async () => {
    const title = screen.getByLabelText('title')
    const author = screen.getByLabelText('author')
    const url = screen.getByLabelText('url')
    const submitButton = screen.getByText('submit')

    const user = userEvent.setup()
    await user.type(title, 'test title')
    await user.type(author, 'test author')
    await user.type(url, 'test url')
    await user.click(submitButton)
    console.log('These are the calls:', addBlogMock.mock.calls)

    expect(addBlogMock.mock.calls).toHaveLength(1)
    expect(addBlogMock.mock.calls[0][0]).toMatchObject({
      title: 'test title',
      author: 'test author',
      url: 'test url',
    })
  })
})
