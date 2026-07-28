import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('note updates parent state and calls onSubmit', async () => {
  const onAddNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm onAddNote={onAddNote} />)

  const input = screen.getByRole('textbox')
  const submitButton = screen.getByText('submit')

  await user.type(input, 'testing form')
  await user.click(submitButton)

  expect(onAddNote.mock.calls).toHaveLength(1)
  expect(onAddNote.mock.calls[0][0].content).toBe('testing form')
})
