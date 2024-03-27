import { model, Schema } from "mongoose";

const GroupSchema = new Schema({
  group: String,
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, set: (value) => value.toLowerCase() },
    password: { type: String, required: true },
    activationLink: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    groups: { type: [GroupSchema], default: [{ group: "user" }] },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
