import express from "express";
import { engine } from "express-handlebars";
import indexRoutes from "./routes/index.routes";
import path from "path";
import morgan from "morgan";
const app = express();

app.set("views", path.join(__dirname, "views")); //configuracion para que pueda agarrar la carpeta de las vistas

app.engine(
  ".hbs",
  engine({
    layoutDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "main",
    extname: ".hbs",
  })
); //configuracion del motor de plantilla hbs y el archivo main
app.set("view engine", ".hbs"); //para que pueda utilizar el motor
app.use(morgan("dev"));

app.use(express.json()); //
app.use(express.urlencoded({ extended: false })); //Estos por lo de la bd despues

app.use(express.static(path.join(__dirname, "public"))); //de una ves lo de los archivos estaticos

app.use(indexRoutes); //para que utilice lo de las rutas 

export default app;
