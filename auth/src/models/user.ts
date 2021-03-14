import mongoose from "mongoose";
import { Password } from "../services/password";

// User interface describes the properties
interface UserProperties {
  username: string;
  email: string;
  password: string;
}

// UserModel interface describes the properties the User model have
interface UserModel extends mongoose.Model<UserDoc> {
  build(properties: UserProperties): UserDoc;
}

// interface that describes the properties a singgle User Has
interface UserDoc extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  username: {
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
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (properties: UserProperties) => {
  return new User(properties);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// User.build({
//   username: "jengjet",
//   email: "rad@rad.com",
//   password: "jengjet",
// });

export { User };
