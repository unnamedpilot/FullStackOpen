import { useState } from 'react'

const Blog = ({ blog, increaseLikes, removeBlog, canRemove }) => {
  const [isDetailsVisible, setIsDetailVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setIsDetailVisible(!isDetailsVisible)
  }

  const showWhenVisible = { display: isDetailsVisible ? '' : 'none' }

  return (
    <div style={blogStyle} data-testid='blog'>
      <div>
        <div>{blog.title}</div>
        <div>{blog.author}</div>
      </div>
      <button type="button" onClick={toggleVisibility}>
        {isDetailsVisible ? 'hide' : 'show'}
      </button>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
            likes {blog.likes}
          <button type="button" onClick={() => increaseLikes(blog)}>
              like
          </button>
        </div>
        {canRemove && (
          <button type="button" onClick={() => removeBlog(blog)}>
              remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog
