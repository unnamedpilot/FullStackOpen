const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../../utils/list_helper')

describe('most blogs', () => {
    test('when there is no blogs, it should return an empty object', () => {
        const result = listHelper.mostBlogs([])
        assert.deepStrictEqual(result, {})
    })

    test('when there is only one author, it should choose that author', () => {
        const blogs = [{
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }]
        const expected = {
            author: "Michael Chan",
            blogs: 1
        }

        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, expected)
    })

    test('when there is one author with clear most blogs, it should choose him', () => {
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
        const result = listHelper.mostBlogs(blogs)
        const expected = {
            author: "Robert C. Martin",
            blogs: 3
        }

        assert.deepStrictEqual(result, expected)

    })

    test('when there are several authors, many with the same amount of posts, it should choose any of the possible candidates', () => {
        const blogsWithTie = [
            {
                title: "Understanding Closures",
                author: "Alice",
                url: "https://example.com/closures",
                likes: 12,
            },
            {
                title: "Promises Explained",
                author: "Alice",
                url: "https://example.com/promises",
                likes: 15,
            },
            {
                title: "Testing with Jest",
                author: "Alice",
                url: "https://example.com/jest",
                likes: 18,
            },
            {
                title: "Node.js Streams",
                author: "Bob",
                url: "https://example.com/streams",
                likes: 20,
            },
            {
                title: "REST API Design",
                author: "Bob",
                url: "https://example.com/rest",
                likes: 30,
            },
            {
                title: "Docker Basics",
                author: "Bob",
                url: "https://example.com/docker",
                likes: 25,
            },
            {
                title: "CSS Grid Guide",
                author: "Charlie",
                url: "https://example.com/grid",
                likes: 8,
            },
        ];
        const result = listHelper.mostBlogs(blogsWithTie)
        const expected_results = [
            {
                author: 'Alice',
                blogs: 3
            },
            {
                author: 'Bob',
                blogs: 3
            }

        ]

        const isValidResult = expected_results.some(
            expected => expected.author === result.author && expected.blogs === result.blogs)

        assert.ok(isValidResult, "The object is not any of the expected")
    })
    
    test('when the author with most blogs has non-consecutive blogs, it should still choose him', () => {
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
        const result = listHelper.mostBlogs(blogsNonConsecutive)
        const expected = {
            author: "Alice",
            blogs: 4
        }

        assert.deepStrictEqual(result, expected)
    })
})