import Blog from './Blog'

export default function BlogTable({ blogs, increaseLikes, removeBlog, user }) {
  const orderedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
  return (
    <>
      {orderedBlogs.map((blog) => {
        return (
          <Blog
            key={blog.id}
            blog={blog}
            increaseLikes={increaseLikes}
            removeBlog={removeBlog}
            canRemove={user.username === blog.user.username}
          />
        )
      })}
    </>
  )
}
