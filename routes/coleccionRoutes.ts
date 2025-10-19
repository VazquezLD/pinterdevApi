import { Router } from "express";
import { crearColeccion, eliminarColeccion, obtenerColeccionesPorUsuario, agregarFotoAColeccion, obtenerTodasLasFotos } from "../controllers/coleccionControllers";
import { verificarToken } from "../middlewares/autenticarMiddleware";

const router = Router();
router.use(verificarToken)
router.get("/", obtenerColeccionesPorUsuario)
router.post("/", crearColeccion)
router.delete("/:id", eliminarColeccion)
router.patch("/:id", agregarFotoAColeccion)
router.get('/:id', obtenerTodasLasFotos);

export default router;

// FALTAN ENDPOINTS
// 1- OBTENER FOTOS POR COLECCION
// 2- OBTENER FOTOS POR CATEGORIA
// 3- ELIMINAR FOTO DE COLECCION


