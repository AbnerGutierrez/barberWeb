import app from "./app";
import "./database"; //implementamos la coneccion de la bs que tiene la funcion autoEjecutada

app.listen(3000);
console.log("server on port", 3000);
