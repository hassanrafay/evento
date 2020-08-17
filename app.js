const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const Event = require("./models/event");
const User = require("./models/user");

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
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type User {
      _id: ID!
      email: String!
      password: String
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input UserInput {
      email: String!
      password: String!
    }
    type rootQuery {
        events: [Event!]!
    },
    type rootMutation {
        createEvent(eventInput:EventInput): Event!
        createUser(userInput: UserInput): User!
    }
    schema {
        query: rootQuery
        mutation: rootMutation
    }`),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, _id: event.id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: args.eventInput.date,
          creator: "5f39f741c7aae10fe92a8b39",
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc, _id: result.id };
            return User.findById("5f39f741c7aae10fe92a8b39");
          })
          .then((user) => {
            if (!user) {
              throw new Error("User doesn't exists");
            }
            console.log(user);
            user.createdEvents.push(createdEvent._id);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("User already exists.");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null, _id: result.id };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
  })
);
