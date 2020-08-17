const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
let events = [];

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type rootQuery {
        events: [Event!]!
    },
    type rootMutation {
        createEvent(eventInput:EventInput): Event!
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    schema {
        query: rootQuery
        mutation: rootMutation
    }`),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
  })
);

app.listen(3000);
