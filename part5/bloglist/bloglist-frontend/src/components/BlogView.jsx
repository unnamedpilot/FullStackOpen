import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import BlogForm from "./BlogForm";
import BlogTable from "./BlogTable";
export default function BlogView({ showNotification }) {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const addBlog = (newBlog) => {
    setBlogs(blogs.concat(newBlog));
  };

  return (
    <>
      <BlogForm showNotification={showNotification} addBlog={addBlog} />
      <BlogTable blogs={blogs} />
    </>
  );
}
