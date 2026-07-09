const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, currBlog) => total+currBlog.likes, 0)
}

const favoriteBlog = (blogs) => {
    return undefined
}

module.exports = { dummy, totalLikes, favoriteBlog }

