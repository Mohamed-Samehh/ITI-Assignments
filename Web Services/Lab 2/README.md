Lab 2 GraphQL Server

Implemented types: `Article (id, title, content)`, `User (fullname, email, dob)`, `Comment (title, content)`.

Queries:

- `getAllArticles` returns articles including their `author` and `comments`.
- `getArticleById(id: ID!)` returns a single article with `author` and `comments`.

Mutation:

- `createArticle(input: { title, content, authorId })` creates a new article.

Run:

1. cd Code
2. npm install
3. npm start

GraphQL endpoint: http://localhost:4000/graphql

Sample queries:

Fetch all articles with author and comments:

query {
getAllArticles {
id
title
content
author { id fullname email dob }
comments { id title content }
}
}

Fetch article by id:

query {
getArticleById(id: "a1") {
id title content
author { fullname }
comments { title }
}
}

Create an article:

mutation {
createArticle(input: { title: "New", content: "Body", authorId: "1" }) {
id title
}
}
