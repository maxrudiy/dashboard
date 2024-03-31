import { model, Schema } from "mongoose";

const motorSchema = new Schema({
  name: String,
  power: Number,
  voltage: Number,
  current: Number,
  rpm: Number,
  frequency: Number,
  cosPhi: Number,
});

const S321Schema = new Schema({
  system: { type: String, required: true, unique: true },
  address: { type: Number, required: true },
  port: { type: Number, required: true },
  host: { type: String, required: true },
  motor: { type: motorSchema, required: true },
});

export default model("S321", S321Schema);
