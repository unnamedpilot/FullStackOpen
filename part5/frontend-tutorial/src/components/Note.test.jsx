import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'This thing should can be seen',
    important: true
  }

  render(<Note note={note}/>)

  const element = screen.getByText('This thing should can be seen')

  expect(element).toBeDefined()
})

test('clicking the button calls the event handler once', async () => {
  const note = {
    content: 'It should call the function now',
    important: true
  }

  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler}/>)
  const button = screen.getByText('make not important')
  const user = userEvent.setup()
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
