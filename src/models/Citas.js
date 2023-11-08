import mongoose, { Schema, isValidObjectId, model, mongo } from "mongoose";

const citaSchema = new Schema({
  servicios: {
    type: String,
  },
  fecha: {
    type: String,
  },
  hora: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },
  notrabajo: {
    type: Schema.Types.ObjectId,
    ref: "Dia",
  },
});
module.exports = model("Cita", citaSchema);
