const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./helper");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: args.eventInput.date,
      creator: "5f39f741c7aae10fe92a8b39",
    });

    try {
      const result = await event.save();
      let createdEvent = transformEvent(result);
      const creator = await User.findById("5f39f741c7aae10fe92a8b39");
      if (!creator) {
        throw new Error("User doesn't exists");
      }
      creator.createdEvents.push(createdEvent._id);
      await creator.save();
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
};
