const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../../utils/list_helper')

describe('most likes', () => {
    test('when there are not blogs, it should return an empty object', () => {
        const result = listHelper.mostLikes([])
        assert.deepStrictEqual(result, {})
    })

    test('when there is one blog, it should show the author and the likes of the blog', () => {
        const blogs = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }]
        const result = listHelper.mostLikes(blogs)
        const expected = { author: "Michael Chan", likes: 7 }
        assert.deepStrictEqual(result, expected)
    })

    test('when there is one clear author with most likes, it should choose him', () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0
            }
        ]
        const result = listHelper.mostLikes(blogs)
        const expected = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }
        assert.deepStrictEqual(result, expected)
    })

    test('when there is a tie between authors, it should return any of them', () => {
        const blogsWithLikesTie = [
            {
                title: "Understanding Closures",
                author: "Alice",
                url: "https://example.com/closures",
                likes: 20,
            },
            {
                title: "Promises Explained",
                author: "Alice",
                url: "https://example.com/promises",
                likes: 10,
            },
            {
                title: "Node.js Streams",
                author: "Bob",
                url: "https://example.com/streams",
                likes: 15,
            },
            {
                title: "REST API Design",
                author: "Bob",
                url: "https://example.com/rest",
                likes: 15,
            },
            {
                title: "CSS Grid Guide",
                author: "Charlie",
                url: "https://example.com/grid",
                likes: 18,
            },
            {
                title: "Docker Basics",
                author: "Charlie",
                url: "https://example.com/docker",
                likes: 5,
            },
        ];

        const result = listHelper.mostLikes(blogsWithLikesTie)
        const validResults = [
            { author: 'Alice', likes: 30 },
            { author: 'Bob', likes: 30 }
        ]
        const resultIsValid = validResults.some((expectedResult) =>
            (expectedResult.author === result.author) && (expectedResult.likes === result.likes))

        assert.ok(resultIsValid, 'The author object doesn\'t match any valid answer')
    })

    test('when non-consecutive authors, it should still give the correct answer', () => {
        const blogsNonConsecutive = [
            {
                title: "JavaScript Arrays",
                author: "Alice",
                url: "https://example.com/arrays",
                likes: 11,
            },
            {
                title: "Linux Tips",
                author: "Bob",
                url: "https://example.com/linux",
                likes: 9,
            },
            {
                title: "Async Await",
                author: "Alice",
                url: "https://example.com/async",
                likes: 22,
            },
            {
                title: "Kubernetes Intro",
                author: "Charlie",
                url: "https://example.com/k8s",
                likes: 17,
            },
            {
                title: "TypeScript Basics",
                author: "Alice",
                url: "https://example.com/typescript",
                likes: 19,
            },
            {
                title: "MongoDB Indexes",
                author: "Bob",
                url: "https://example.com/mongodb",
                likes: 14,
            },
            {
                title: "Functional Programming",
                author: "Alice",
                url: "https://example.com/fp",
                likes: 27,
            },
        ];

        const result = listHelper.mostLikes(blogsNonConsecutive)
        const expected = { author: 'Alice', likes: 79 }
        assert.deepStrictEqual(result, expected)
    })
})