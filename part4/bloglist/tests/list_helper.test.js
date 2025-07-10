const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helpers')


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
    title: "Canonical string representation of JSON",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
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

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogsWithTie = [
    { title: "Blog 1", author: "Author A", likes: 10 },
    { title: "Blog 2", author: "Author B", likes: 5 },
    { title: "Blog 3", author: "Author A", likes: 12 },
    { title: "Blog 4", author: "Author C", likes: 7 },
    { title: "Blog 5", author: "Author C", likes: 3 },
    { title: "Blog 6", author: "Author C", likes: 1 } // Author C now has 3 blogs
  ];

const emptyList = []

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has multiple blogs, equals the sum of their likes', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    })
  })

  test('when list has multiple blogs, returns the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string representation of JSON",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    })
  })

  const testTie = [
    { title: "Blog A", author: "Author 1", likes: 8 },
    { title: "Blog B", author: "Author 2", likes: 21 },
    { title: "Blog C", author: "Author 3", likes: 21 }
  ];

  test('when multiple blogs have the same max likes, returns any one of them', () => {
    const result = listHelper.favoriteBlog(testTie);
    assert.deepStrictEqual(result, { title: "Blog B", author: "Author 2", likes: 21 });
  });
})



describe('most blogs', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author and count 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1
    })
  })

  test('when list has multiple blogs, returns the author with most blogs and their count', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test('when multiple authors have the same max blogs, returns any one of them', () => {
    const result = listHelper.mostBlogs(blogsWithTie);
    assert.deepStrictEqual(result, {
      author: "Author C",
      blogs: 3
    });
  });
})


describe('most likes', () => {
  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes(emptyList)
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, returns that author and their likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5
    })
  })

  test('when list has multiple blogs, returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    // Robert C. Martin: 10 + 0 + 2 = 12
    // Edsger W. Dijkstra: 5 + 12 = 17
    // Michael Chan: 7
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

  // Test case for a tie (e.g., two authors with same max total likes)
  const blogsWithTieInLikes = [
    { title: "A1", author: "Author X", likes: 10 },
    { title: "A2", author: "Author X", likes: 5 }, // Author X total: 15
    { title: "B1", author: "Author Y", likes: 8 },
    { title: "B2", author: "Author Y", likes: 7 }, // Author Y total: 15
    { title: "C1", author: "Author Z", likes: 12 }  // Author Z total: 12
  ];

  test('when multiple authors have the same max total likes, returns any one of them', () => {
    const result = listHelper.mostLikes(blogsWithTieInLikes);
    // Both Author X and Author Y have 15 likes.
    // Our implementation will return the first one it encounters with max likes.
    // In this case, it should be Author X.
    assert.deepStrictEqual(result, {
      author: "Author X",
      likes: 15
    });
  });
})