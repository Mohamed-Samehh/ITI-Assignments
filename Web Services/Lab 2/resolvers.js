const { articles, users, comments } = require('./data');
const { GraphQLError } = require('graphql');

const resolvers = {
    Query: {
        getAllArticles: () => articles,
        getArticleById: (parent, { id }) => articles.find(a => a.id === id),
    },

    Mutation: {
        createArticle: (parent, { input }) => {
            const { title, content, authorId } = input;
            if (!users.find(u => u.id === authorId)) {
                throw new GraphQLError('Author not found', { extensions: { code: 'BAD_USER_INPUT' } });
            }

            const newArticle = {
                id: String(articles.length + 1) + Date.now().toString(36),
                title,
                content,
                authorId
            };
            articles.push(newArticle);
            return newArticle;
        }
    },

    Article: {
        author: (parent) => users.find(u => u.id === parent.authorId),
        comments: (parent) => comments.filter(c => c.articleId === parent.id)
    }
};

module.exports = resolvers;
