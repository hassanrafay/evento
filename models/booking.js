const mongoose = require("mongoose");
const schema = require("../graphql/schema");

const Schema = mongoose.Schema;
const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
