import { screen, render } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

let increaseLikesMock

describe('<Blog/>', () => {
  beforeEach(() => {
    increaseLikesMock = vi.fn()
    const removeBlogMock = vi.fn()
    const blog = {
      title: 'Designing Data-Intesive Systems',
      url: 'example.com/DDIA',
      author: 'Alverth De La Barrera',
      likes: 1009,
    }
    render(
      <Blog
        blog={blog}
        increaseLikes={increaseLikesMock}
        removeBlog={removeBlogMock}
        canRemove={true}
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
