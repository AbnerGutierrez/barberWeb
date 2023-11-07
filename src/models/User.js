import { Schema, model } from "mongoose";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  telefono: {
    type: String,
  },
  correo: {
    type: String,
  },
  contraseña: {
    type: String,
  },
  citas: {
    type: String,
  },
});
module.exports = model("Usuario", usuarioSchema);
