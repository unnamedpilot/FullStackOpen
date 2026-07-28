import { render, screen } from '@testing-library/react'
import Togglable from './Togglable'
import { beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Toggable', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>this should be visible</div>
      </Togglable>,
    )
  })

  test('children component renders', () => {
    const child = screen.getByText('this should be visible')
    expect(child).toBeDefined()
  })

  test('at start children are not displayed', () => {
    const element = screen.getByText('this should be visible')
    screen.debug(element)
    expect(element).not.toBeVisible()
  })

  test('clicking the button show the children', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)
    const child = screen.getByText('this should be visible')
    expect(child).toBeVisible()
  })

  test('when clicking the cancel button, hides the children', async () => {
    const showButton = screen.getByText('show...')
    const hideButton = screen.getByText('cancel')
    const child = screen.getByText('this should be visible')
    const user = userEvent.setup()
    await user.click(showButton)
    await user.click(hideButton)
    expect(showButton).toBeVisible()
    expect(hideButton).not.toBeVisible()
    expect(child).not.toBeVisible()
  })
})
