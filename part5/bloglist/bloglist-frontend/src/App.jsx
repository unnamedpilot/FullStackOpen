import { useState, useEffect } from 'react'
import {
  Link,
  Routes,
  Route,
  Navigate,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
} from '@mui/material'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification/Notification'
import Blog from './components/Blog'
import BlogTable from './components/BlogTable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(() => {
    const user = window.localStorage.getItem('loggedUser')
    return user === null ? null : JSON.parse(user)
  })
  const [blogs, setBlogs] = useState([])
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 5000)
  }

  const updateLoggedUser = (userData) => {
    window.localStorage.setItem('loggedUser', JSON.stringify(userData))
    setUser(userData)
    blogService.setToken(userData.token)
  }

  const cleanLoggedUser = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const content = await blogService.create(newBlog)
      setBlogs(blogs.concat(content))
      const notificationObject = {
        text: `A new blog ${newBlog.title} added`,
        type: 'success',
      }
      showNotification(notificationObject)
      navigate('/blogs')
    } catch (error) {
      const notificationObject = {
        text: error.response.data.error,
        type: 'error',
      }
      showNotification(notificationObject)
    }
  }

  const increaseLikes = async (blog) => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    const returnedBlog = await blogService.update(newBlog)

    setBlogs((blogs) =>
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog)),
    )
  }

  const removeBlog = async (deletingBlog) => {
    const userConfirmed = confirm(
      `Are you sure that you want to delete ${deletingBlog.title}`,
    )
    if (!userConfirmed) {
      return
    }
    try {
      await blogService.remove(deletingBlog.id)
      setBlogs(blogs.filter((blog) => blog.id !== deletingBlog.id))
      navigate('/blogs')
    } catch (error) {
      const notificationObject = { text: error.response.data.error, type: 'error' }
      showNotification(notificationObject)
    }
  }

  const loginForm = () => {
    if (user) {
      return <div>{user.name} is logged in</div>
    }

    return (
      <LoginForm
        showNotification={showNotification}
        updateLoggedUser={updateLoggedUser}
      />
    )
  }

  const blogList = () => {
    if (!user) {
      return <Navigate to="/login" replace />
    }

    return (
      <>
        <h2>blogs</h2>
        <BlogTable
          blogs={blogs}
          increaseLikes={increaseLikes}
          removeBlog={removeBlog}
          user={user}
        />
      </>
    )
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((note) => note.id === match.params.id) : null

  return (
    <Container>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Blog App</Typography>
          <Box>
            <Button color="inherit" component={Link} to="/blogs">
              Blogs
            </Button>
            <Button color="inherit" component={Link} to="/create">
              New Blog
            </Button>
            {user && (
              <Button color="inherit" onClick={cleanLoggedUser}>
                Log out
              </Button>
            )}
            {!user && (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ alignSelf: 'end' }}
              >
                Log In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/blogs" element={blogList()} />
        <Route path="/login" element={loginForm()} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              increaseLikes={increaseLikes}
              removeBlog={removeBlog}
              user={user}
            />
          }
        />
        <Route path="/create" element={<BlogForm addBlog={addBlog} />} />
      </Routes>
      <Notification notification={notification} />
    </Container>
  )
}

export default App
