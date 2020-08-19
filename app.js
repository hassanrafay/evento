const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");

const graphQLSchema = require("./graphql/schema/index");
const graphQLResolvers = require("./graphql/resolvers/index");
const isAuthenticated = require("./middlewares/isAuthenticated");

const port = 8000;
const app = express();

app.use(bodyParser.json());
app.use(isAuthenticated);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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
