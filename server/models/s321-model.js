import { model, Schema } from "mongoose";

const S321Schema = new Schema({
  system: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  port: { type: Number, required: true },
  host: { type: String, required: true },
});

export default model("S321", S321Schema);
