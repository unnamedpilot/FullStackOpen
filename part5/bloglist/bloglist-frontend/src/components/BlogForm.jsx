import { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'
export default function BlogForm({ addBlog }) {
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
    addBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>Blog Form</h2>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            rowGap: '10px',
          }}
        >
          <TextField
            label="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            submit
          </Button>
        </Box>
      </form>
    </>
  )
}
