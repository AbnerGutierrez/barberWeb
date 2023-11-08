import mongoose, { Schema, isValidObjectId, model, mongo } from "mongoose";

const diasSchema = new Schema({
  nowork: {
    type: String,
  },
});
module.exports = model("Dia", diasSchema);
