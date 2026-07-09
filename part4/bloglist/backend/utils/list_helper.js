const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, currBlog) => total + currBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const blogsPerAuthor = blogs
        .reduce((accBlogs, blog) => {
            const author = blog.author
            const newBlogsNumber = accBlogs.has(author) 
                ? accBlogs.get(author) + 1 
                : 1
            return accBlogs.set(author, newBlogsNumber)
        }, new Map())

    let mostBlogAuthor = {author: "", blogs: 0}
    
    for (const [author, blogs] of blogsPerAuthor) {
        if (blogs > mostBlogAuthor.blogs) {
            mostBlogAuthor = { author, blogs }
        }
    }

    return mostBlogAuthor
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }

