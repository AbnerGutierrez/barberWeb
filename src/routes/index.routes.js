import { Router } from "express";
import Usuario from "../models/User";
const router = Router();

/*----------RUTES NORMALES, CUANDO NO HA INGRESADO SESION NI NADA----------*/
router.get("/", (req, res) => {
  res.render("index");
}); //rute de index

router.get("/agendar", (req, res) => {
  res.redirect("/registro");
  console.log("No se indentifico ningun id");
}); //rute agenda sin id

router.get("/servicios", (req, res) => {
  res.render("servicios");
}); //rute servicios

router.get("/acceder", (req, res) => {
  res.render("acceder");
}); //ruter acceder osea para iniciar secion
router.get("/registro", (req, res) => {
  res.render("registro");
}); //rute para registrarse
/*----------RUTAS PARA LOS FORMULARIOS, LOGIN, CREAR UNA CUENTA Y LO DE LA CITA----------*/
router.post("/registro", async (req, res) => {
  const usuario = new Usuario();

  const con1 = req.body.contraseña;
  const con2 = req.body.contraseña2;
  const id = req.body._id;
  if (con1 == con2) {
    usuario.nombre = req.body.nombre;
    usuario.apellido = req.body.apellido;
    usuario.telefono = req.body.telefono;
    usuario.correo = req.body.correo;
    usuario.contraseña = req.body.contraseña;
    await usuario.save();
    res.redirect("/acceder");
  } else {
    res.status("La contrasela no coicide");
  }
}); //formulario de registro
router.post("/acceder", async (req, res) => {
  const correofrm = req.body.correo;
  const contraseñafrm = req.body.contraseña;
  const usuario = await Usuario.findOne({
    contraseña: contraseñafrm,
    correo: correofrm,
  });

  if (usuario) {
    const id = usuario._id;
    res.redirect(`/index/${id}`);
  } else if (correofrm == "admin@gmail.com" && contraseñafrm == "admin") {
    const db = await Usuario.find().lean();
    res.render("adminp", { db });
  } else {
    res.redirect("/acceder");
  }
}); //formulario de acceder

/*----------RUTAS PARA LA NAVEGACION CUANDO YA SE INICIO SESION----------*/
router.get("/index/:id", async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findOne({ _id: id });
  const nombre = usuario.nombre;
  //res.redirect(`/index/${id}/cita`);
  res.render("indexlog", { id, nombre });
  //console.log("TU ID ES :"+nombre);
});
//RUTA QUE MANDA AL AGENDAR CITAS AL USUARIO
router.get("/index/:id/cita", (req, res) => {
  const { id } = req.params;
  res.render("agendarcitalog", { id });
});
//RUTA QUE MANDA A VER LOS SERVICIOS AL USUARIO
router.get("/index/:id/servicios", (req, res) => {
  const { id } = req.params;
  res.render("servicioslog", { id });
});
router.post("/index/:id/agenda", async (req, res) => {
  const { id } = req.params;
  const dia = req.body.dia;
  const hora = req.body.hora;
  const servicios = req.body.servicios;
  const srv = "Servicio: " + servicios + ", Fecha: " + dia + ", Hora: " + hora;

  try {
    const usuariob = await Usuario.findById(id);
    if (!usuariob) {
      return res.status(404).send("Documento no encontrado");
    }
    //Aqui se agregan los datos
    usuariob.citas = srv;
    //Aqui se guarda segun
    await usuariob.save();

    console.log(
      "Esto no se que es: " +
        usuariob +
        "Esto se supone que es el string de la cita: " +
        srv
    );
  } catch (error) {
    console.error("Error al agregar datos al documento:", error);
    res.status(500).send("Error interno del servidor");
  }

  res.redirect(`/index/${id}`);
  console.log(srv);
}); //obtener los datos de la cita

router.get("/index/:id/salir", (req, res) => {
  res.redirect("/");
});
//RUTA PARA SALIR DE LA CUENTA

/*----------ESTO ES DEL ADMIN----------*/

export default router;
