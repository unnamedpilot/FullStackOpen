import { useState, useEffect } from 'react'
import {
  Link,
  Routes,
  Route,
  Navigate,
  useMatch,
  useNavigate,
} from 'react-router-dom'
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
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationOptions, setNotificationOptions] = useState(null)

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const showNotification = (message, options) => {
    setNotificationMessage(message)
    setNotificationOptions(options)
    setTimeout(() => setNotificationMessage(null), 5000)
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
      showNotification(`A new blog ${newBlog.title} added`, {
        type: 'success',
      })
      navigate('/blogs')
    } catch (error) {
      showNotification(error, { type: 'error' })
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
      showNotification(error.response.data.error, { type: 'error' })
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

  const padding = { padding: 5 }
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((note) => note.id === match.params.id) : null

  return (
    <div>
      <div>
        <Link style={padding} to="/blogs">
          blogs
        </Link>
        <Link style={padding} to="/create">
          new blog
        </Link>
        {user && (
          <button type="button" onClick={cleanLoggedUser}>
            logout
          </button>
        )}
        {!user && (
          <Link style={padding} to="/login">
            log in
          </Link>
        )}
      </div>
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
      <Notification
        message={notificationMessage}
        options={notificationOptions}
      />
    </div>
  )
}

export default App
