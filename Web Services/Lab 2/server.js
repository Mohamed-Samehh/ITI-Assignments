const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { users } = require('./data');

async function startServer() {
    const app = express();
    const PORT = 4000;

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('<h1>Lab 2 GraphQL Server</h1><p>Visit <a href="/graphql">/graphql</a></p>');
    });

    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}/graphql`);
    });
}

startServer();
