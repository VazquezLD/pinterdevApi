import express, {Express} from "express";
import { dbinitializer } from "../database/dbconfig";
import usuariosRoutes from "../routes/userRoutes"
import coleccionRoutes from "../routes/coleccionRoutes"

export class Server{

    app:Express;

    constructor(){
        this.app = express();
        this.conexionABD();
        this.middlewares();
        this.routes();
    }

    async conexionABD(): Promise<void>{
        await dbinitializer();
    }

    middlewares():void{
        this.app.use(express.json())
    }

    routes():void{
        this.app.use("/api/usuarios", usuariosRoutes)
        this.app.use("/api/colecciones", coleccionRoutes)
    }
}