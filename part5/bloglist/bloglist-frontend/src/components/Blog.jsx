import { Box, Link, Paper, Typography, Button } from '@mui/material'

const Blog = ({ blog, increaseLikes, removeBlog, user }) => {
  if (!blog) {
    return <span>Wait a moment, it's loading...</span>
  }

  const canRemove = user ? user.username === blog.user.username : false
  const canLike = user ? true : false

  return (
    <Box
      data-testid="blog"
      component={Paper}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px',
        padding: '15px',
        rowGap: 1,
      }}
    >
      <Typography variant="h5">{blog.title}</Typography>
      <Typography variant="h7" sx={{ color: 'text.secondary' }}>
        By {blog.author}
      </Typography>
      <Link>{blog.url}</Link>
      <Typography variant="h8" sx={{ color: 'text.secondary', fontSize: 15 }}>
        Added By {blog.user.name}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 1,
        }}
      >
        <Typography>{blog.likes} likes</Typography>
        {canLike && (
          <Button
            variant="outlined"
            type="button"
            onClick={() => increaseLikes(blog)}
          >
            like
          </Button>
        )}
        {canRemove && (
          <Button
            variant="outlined"
            type="button"
            onClick={() => removeBlog(blog)}
            color='error'
          >
            remove
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Blog
