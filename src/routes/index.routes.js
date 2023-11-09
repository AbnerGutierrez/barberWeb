import { Router } from "express";
import Usuario from "../models/User";
import Citas from "../models/Citas";
import Dias from "../models/Dias"
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
    res.redirect("/admin/table");
  } else {
    res.redirect("/acceder");
  }
}); //formulario de acceder

/*----------RUTAS PARA LA NAVEGACION CUANDO YA SE INICIO SESION----------*/
router.get("/index/:id", async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findOne({ _id: id });
  const nombre = usuario.nombre;
  const citas = await Citas.find({ user: id }).populate("user");
  const citasTransformadas = citas.map((cita) => ({
    servicios: cita.servicios,
    fecha: cita.fecha,
    hora: cita.hora,
  }));
  //res.redirect(`/index/${id}/cita`);
  console.log(citasTransformadas);
  res.render("indexlog", { id, nombre, citasTransformadas });
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
  const dia = req.body.dia + "";
  const hora = req.body.hora + "";
  const servicios = req.body.servicios + "";

  try {
    const usuario = await Usuario.findById(id); // Verificar que el usuario existe
    if (!usuario) {
      return res.status(404).send("Documento no encontrado");
    }

    const citaExistente = await Citas.findOne({ fecha: dia, hora: hora });

    if (citaExistente) {
      return res
        .status(400)
        .send("La cita ya está ocupada en esta fecha y hora.");
    }
     const diasn = await Dias.find({});
      const nowork = diasn.map((now)=>now.nowork);
      // Comprobar si la fecha seleccionada está en el array "nowork"
    if (nowork.includes(dia)) {
      return res.status(400).send("No se puede agendar una cita en esta fecha :( .");
    }
    // Guardar los valores en la cita
    const cita = new Citas({
      servicios: servicios,
      fecha: dia,
      hora: hora,
      user: usuario,
    });

    await cita.save();

    // Guardar la cita en el usuario si es necesario (no está claro en tu código)
    // usuario.citas = cita;
    // await usuario.save();
    res.redirect(`/index/${id}`);
   // res.redirect(`/index/${id}`);
  } catch (error) {
    console.error("Error al agregar datos al documento:", error);
    res.status(500).send("Error interno del servidor");
  }
});
//obtener los datos de la cita

router.get("/index/:id/salir", (req, res) => {
  res.redirect("/");
});
//RUTA PARA SALIR DE LA CUENTA

/*----------ESTO ES DEL ADMIN----------*/

router.get("/admin/table", async (req, res) => {
  const allcitas = await Citas.find().lean();
  const citas = await Citas.find().populate("user");
  const dias = await Dias.find().lean();
  const citasTransformadas = citas.map((cita) => ({
    _id:cita._id,
    nombre: cita.user.nombre,
    servicios: cita.servicios,
    fecha: cita.fecha,
    hora: cita.hora,
  }));
  console.log(citasTransformadas);
  res.render("adminp", { citasTransformadas,dias });
});

router.post("/descanso",async(req,res)=>{
  const des = req.body.descanso;
  const dias = new Dias({
    nowork:des,
  });
    await dias.save();
  res.redirect("/admin/table");
  console.log(des)
})

router.get("/eliminarDia/:id",async(req,res)=>{
  const {id} = req.params;
   await Dias.findByIdAndDelete({_id:id});
    res.redirect("/admin/table");
})

router.get("/eliminarCita/:id",async(req,res)=>{
  const {id} = req.params;
   await Citas.findByIdAndDelete({_id:id});
    res.redirect("/admin/table");
})

// POR FAVOR HACER CA CARPETA DE CONTROLADORES Y ACOMODAR ESTAS FUNCIONES 
export default router;
