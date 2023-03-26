const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      optional: true,
    },
    collectionPermissions: {
      type: [
        {
          collectionName: String,
          permissions: [String],
        },
      ],
      optional: true,
    },
    role: {
      type: String,
      optional: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
