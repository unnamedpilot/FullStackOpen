import { Link } from 'react-router-dom'

export default function BlogTable({ blogs }) {
  const orderedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
  return (
    <ul>
      {orderedBlogs.map((blog) => {
        return (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        )
      })}
    </ul>
  )
}
