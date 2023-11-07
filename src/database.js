import { connect } from "mongoose";
//creamos la ejecucion de la conexion de la base de datos

(async()=>{
  try{
    const db = await connect("mongodb://localhost/barber-mongo"); //esto es asincrono
    console.log("DB connected to",db.connection.name)
  }catch(error){
    console.error(error)
  }
})()  //Funcion inmediatamente invocada 
