const _ = require('lodash')

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

    const blogsPerAuthor = _.map(_.countBy(blogs, 'author'),
        (blogCount, author) => ({ author, blogs: blogCount }))

    return _.maxBy(blogsPerAuthor, "blogs")
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const likesPerAuthor = _.map(_.groupBy(blogs, 'author'),
        (authorBlogs, author) => ({ author, likes: _.sumBy(authorBlogs, 'likes') }))

    return _.maxBy(likesPerAuthor, 'likes')
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }

