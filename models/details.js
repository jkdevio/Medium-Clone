const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const detailsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"], // Validation for email format
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"], // Restrict to specific values
      required: true,
    },
    rememberToken: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
      default:
        "https://miro.medium.com/v2/resize:fit:1400/1*psYl0y9DUzZWtHzFJLIvTw.png", // Default Medium logo
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    uploadedImages: [
      {
        url: String,
        name: String,
        uploadedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

// Add password validation method
detailsSchema.methods.validatePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error("Password validation failed");
  }
};

// Add pre-save middleware to handle password updates
detailsSchema.pre("save", async function (next) {
  // Only hash password if it's been modified or is new
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = process.env.NODE_ENV === "production" ? 12 : 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

const details = mongoose.model("blog-details", detailsSchema);
module.exports = details;
