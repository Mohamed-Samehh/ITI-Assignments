const users = [
    { id: "1", fullname: "John Doe", email: "john@example.com", dob: "1990-01-01" },
    { id: "2", fullname: "Jane Smith", email: "jane@example.com", dob: "1985-05-10" }
];

const articles = [
    { id: "a1", title: "GraphQL Basics", content: "Intro to GraphQL", authorId: "1" },
    { id: "a2", title: "Resolvers Deep Dive", content: "How resolvers work", authorId: "2" }
];

const comments = [
    { id: "c1", title: "Great article", content: "Very helpful.", articleId: "a1" },
    { id: "c2", title: "Question", content: "Can you expand on inputs?", articleId: "a1" },
    { id: "c3", title: "Nice read", content: "Well explained.", articleId: "a2" }
];

module.exports = { users, articles, comments };
