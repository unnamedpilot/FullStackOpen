import { useState } from 'react'
import blogService from '../services/blogs'

export default function BlogForm({ showNotification, addBlog }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }
    try {
      const content = await blogService.create(newBlog)
      addBlog(content)
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`A new blog ${content.title} added`, { type: 'success' })
    } catch {
      showNotification('Something went wrong', { type: 'error' })

    }
  }

  return (
    <>
      <h2>Blog Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">submit</button>
      </form>
    </>
  )
}
