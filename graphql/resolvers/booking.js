const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("./helper");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UnAuthenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UnAuthenticated");
    }
    const fetchedEvent = await Event.findById({ _id: args.eventId });
    console.log(fetchedEvent.id);
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent.id,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("UnAuthenticated");
    }
    try {
      const booking = await Booking.findById({ _id: args.bookingId }).populate(
        "event"
      );
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
