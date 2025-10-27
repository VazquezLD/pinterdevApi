import express, {Express} from "express";
import { dbinitializer } from "../database/dbconfig";
import usuariosRoutes from "../routes/userRoutes"
import coleccionRoutes from "../routes/coleccionRoutes"
import cors from 'cors';

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
        this.app.use(express.json());
        this.app.use(cors({
            origin: [
                "http://localhost:5173",
                "https://pinterdev-api.vercel.app"
            ],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
            }));
    }

    routes():void{
        this.app.use("/api/usuarios", usuariosRoutes)
        this.app.use("/api/colecciones", coleccionRoutes)
    }
}