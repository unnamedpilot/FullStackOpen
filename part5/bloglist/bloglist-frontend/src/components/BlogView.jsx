import { useEffect, useRef, useState } from 'react'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'
import BlogTable from './BlogTable'
import Toggable from './Toggable'
export default function BlogView({ showNotification, user }) {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    setBlogs(blogs.concat(newBlog))
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
    const userConfirmed = confirm(`Are you sure that you want to delete ${deletingBlog.title}`)
    if(!userConfirmed) { return }
    try {
      await blogService.remove(deletingBlog.id)
      setBlogs(blogs.filter(blog => blog.id !== deletingBlog.id))
    } catch (error) {
      showNotification(error.response.data.error, { type: 'error' })
    }
  }

  return (
    <>
      <Toggable buttonLabel="show form" ref={blogFormRef}>
        <BlogForm showNotification={showNotification} addBlog={addBlog} />
      </Toggable>

      <BlogTable blogs={blogs} increaseLikes={increaseLikes} removeBlog={removeBlog} user={user}/>
    </>
  )
}
