const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");

const port = 3000;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/event-booking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`App is running on port: ${port}`));
  })
  .catch((error) => console.log(error));

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
  })
);
