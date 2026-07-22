const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>  
)

export default function BlogTable({ blogs }) {
  return (
    <>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
}
