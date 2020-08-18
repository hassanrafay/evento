const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformEvent, transformBooking } = require("./helper");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
    const fetchedEvent = await Event.findById({ _id: args.eventId });
    console.log(fetchedEvent.id);
    const booking = new Booking({
      user: "5f39f741c7aae10fe92a8b39",
      event: fetchedEvent.id,
    });
    const result = await booking.save();
    return transformBooking(result);
  },
  cancelBooking: async (args) => {
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
