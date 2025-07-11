const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0){
        return 0
    }

    const sumOfLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return sumOfLikes
}

const favoriteBlog = (blogs) => {
    if(blogs.length == 0){
        return null
    }

    let highest = -1
    let favorite = null

    blogs.forEach(blog => {
        if(blog.likes > highest){
            highest = blog.likes
            favorite = blog
        }
    })

    return favorite
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) {
        return null
    }

    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

    // const authorBlogCounts = {}

    // blogs.forEach(blog => {
    //     authorBlogCounts[blog.author] = (authorBlogCounts[blog.author] || 0) + 1
    // })

    // let topAuthor = ''
    // let maxBlogs = 0

    // for(const author in authorBlogCounts){
    //     if(authorBlogCounts[author] > maxBlogs){
    //         maxBlogs = authorBlogCounts[author]
    //         topAuthor = author
    //     }
    // }

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if(blogs.length === 0){
        return null
    }

    const groupedByAuthor = _.groupBy(blogs, 'author')

    const authorLikesSum = _.mapValues(groupedByAuthor, (authorBlogs) => 
        _.sumBy(authorBlogs, 'likes')
    )

    const topAuthor = _.maxBy(Object.keys(authorLikesSum), (author) => authorLikesSum[author])

    return {
        author: topAuthor,
        likes: authorLikesSum[topAuthor]
    }

    // const authorLikes = {}

    // blogs.forEach(blog => {
    //     authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    // })

    // let topAuthor = ''
    // let maxLikes = -1

    // for(const author in authorLikes){
    //     if(authorLikes[author] > maxLikes){
    //         maxLikes = authorLikes[author]
    //         topAuthor = author
    //     }
    // }

    // return {
    //     author: topAuthor,
    //     likes: maxLikes
    // }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}