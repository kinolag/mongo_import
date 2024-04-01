import { Schema, model } from "mongoose";

const contractSchema = new Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
  },
});
const Contract = model("Contract", contractSchema);

const trackSchema = new Schema({
  ID: String,
  Title: {
    type: String,
    required: true,
  },
  Version: String,
  Artist: String,
  ISRC: {
    type: String,
    required: true,
  },
  "P Line": String,
  Aliases: [String],
  Contract: String,
  "Contract ID": { type: Schema.Types.ObjectId, ref: Contract },
});

const Track = model("Track", trackSchema);

export { Track, Contract };
