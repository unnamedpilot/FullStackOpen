import { screen, render } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe } from 'vitest'

let increaseLikesMock

const createBlogCustomUser = (blogUser, user) => {
  increaseLikesMock = vi.fn()
  const removeBlogMock = vi.fn()
  const blog = {
    title: 'Designing Data-Intesive Systems',
    url: 'example.com/DDIA',
    author: 'Alverth De La Barrera',
    likes: 1009,
    user: blogUser,
  }
  render(
    <Blog
      blog={blog}
      increaseLikes={increaseLikesMock}
      removeBlog={removeBlogMock}
      user={user}
    />,
  )
}

describe('<Blog/>', () => {
  describe('Check authentication-based functions', () => {
    test.only('buttons are not displayed when user its unauthenticated', async () => {
      const blog_user = { username: 'unnamedpilot' }
      const userInfo = null
      createBlogCustomUser(blog_user, userInfo)
      const user = userEvent.setup()
      const button = screen.getByText('show')
      await user.click(button)
      expect(screen.queryByText('like')).toBeNull()
      expect(screen.queryByText('remove')).toBeNull()
    })
    test.only('Authenticated users who are not the blogs creator are shown only the like button', async () => {
      const blogUser = { username: 'sirdannell' }
      const userInfo = { username: 'unnamedpilot' }
      createBlogCustomUser(blogUser, userInfo)
      const user = userEvent.setup()
      const button = screen.getByText('show')
      await user.click(button)
      expect(screen.queryByText('like')).toBeVisible()
      expect(screen.queryByText('remove')).toBeNull()
    })
    test.only('The blogs creator is also shown the delete button', async () => {
      const blogUser = { username: 'unnamedpilot' }
      const userInfo = { username: 'unnamedpilot' }
      createBlogCustomUser(blogUser, userInfo)
      const user = userEvent.setup()
      const button = screen.getByText('show')
      await user.click(button)
      expect(screen.queryByText('like')).toBeVisible()
      expect(screen.queryByText('remove')).toBeVisible()
    })
  })

  describe('check basic access things', () => {
    beforeEach(() => {
      increaseLikesMock = vi.fn()
      const removeBlogMock = vi.fn()
      const userInfo = { username: 'unnamedpilot' }
      const blog = {
        title: 'Designing Data-Intesive Systems',
        url: 'example.com/DDIA',
        author: 'Alverth De La Barrera',
        likes: 1009,
        user: { username: 'unnamedpilot' },
      }
      render(
        <Blog
          blog={blog}
          increaseLikes={increaseLikesMock}
          removeBlog={removeBlogMock}
          user={userInfo}
        />,
      )
    })

    test('<Blog/> renders title and author by default', () => {
      const title = screen.getByText('Designing Data-Intesive Systems')
      const url = screen.getByText('example.com/DDIA')
      const author = screen.getByText('Alverth De La Barrera')
      const likes = screen.getByText('likes 1009')

      expect(title).toBeVisible()
      expect(author).toBeVisible()
      expect(url).not.toBeVisible()
      expect(likes).not.toBeVisible()
    })

    test('<Blog/> when clicking the show button , url and likes are visible', async () => {
      const user = userEvent.setup()
      const showButton = screen.getByText('show')

      await user.click(showButton)

      const url = screen.getByText('example.com/DDIA')
      const likes = screen.getByText('likes 1009')

      expect(url).toBeVisible()
      expect(likes).toBeVisible()
    })

    test('When clicking the like button twice make two calls', async () => {
      const user = userEvent.setup()
      const likesButton = screen.getByText('like')

      await user.click(likesButton)
      await user.click(likesButton)

      expect(increaseLikesMock.mock.calls).toHaveLength(2)
    })
  })
})
