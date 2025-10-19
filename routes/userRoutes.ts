import { Router } from "express";
import { crearUsuario, eliminarUsuario } from "../controllers/usuarioControllers";
import { loginUsuario } from "../controllers/autenticacionController"

const router = Router();
router.post("/", crearUsuario)
router.post("/login", loginUsuario)
router.delete("/:id", eliminarUsuario)

export default router;