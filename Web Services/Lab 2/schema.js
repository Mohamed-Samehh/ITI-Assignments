const typeDefs = `#graphql

type User {
  id: ID!
  fullname: String!
  email: String!
  dob: String
}

type Comment {
  id: ID!
  title: String!
  content: String!
}

type Article {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]
}

input CreateArticleInput {
  title: String!
  content: String!
  authorId: ID!
}

type Query {
  getAllArticles: [Article]
  getArticleById(id: ID!): Article
}

type Mutation {
  createArticle(input: CreateArticleInput!): Article
}
`;

module.exports = typeDefs;
