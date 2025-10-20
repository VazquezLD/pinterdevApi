import { Router } from "express";
import { crearColeccion, eliminarColeccion, obtenerColeccionesPorUsuario, agregarFotoAColeccion, obtenerTodasLasFotos, eliminarFotoDeColeccion } from "../controllers/coleccionControllers";
import { verificarToken } from "../middlewares/autenticarMiddleware";

const router = Router();
router.use(verificarToken)
router.get("/", obtenerColeccionesPorUsuario)
router.post("/", crearColeccion)
router.delete("/:id", eliminarColeccion)
router.patch("/:id", agregarFotoAColeccion)
router.get('/:id', obtenerTodasLasFotos);
router.patch("/:id/fotos", eliminarFotoDeColeccion)

export default router;

// 3- ELIMINAR FOTO DE COLECCION


