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

  return (
    <>
      <div style={blogStyle}>
        {blog.title}
        <button type="button" onClick={toggleVisibility}>
          {isDetailsVisible ? 'hide' : 'show'}
        </button>
        {isDetailsVisible && (
          <div>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}{' '}
              <button type="button" onClick={() => increaseLikes(blog)}>
                like
              </button>
            </div>
            <div>{blog.author}</div>
            {canRemove && (
              <button type="button" onClick={() => removeBlog(blog)}>
                remove
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function BlogTable({ blogs, increaseLikes, removeBlog, user }) {
  const orderedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
  console.log(user)
  return (
    <>
      {orderedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          increaseLikes={increaseLikes}
          removeBlog={removeBlog}
          canRemove={user.username === blog.user.username}
        />
      ))}
    </>
  )
}
