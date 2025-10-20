import { Response } from "express";
import Coleccion from "../models/coleccion";
import Usuario from "../models/usuario";
import { RequestConUsuario } from "../middlewares/autenticarMiddleware"
import { validarId } from "../helpers/validarId";

export const crearColeccion = async (req: RequestConUsuario, res: Response) => {
    try {
        const { titulo, descripcion } = req.body;
        const usuarioId = req.userId;

        if (!titulo || !descripcion) {
            return res.status(400).json({ msg: "Título y descripción son obligatorios." });
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const coleccionExistente = await Coleccion.findOne({ titulo, usuario: usuarioId });
        if (coleccionExistente) {
            return res.status(400).json({ msg: "Ya existe una colección con ese título para este usuario." });
        }

        const nuevaColeccion = new Coleccion({ titulo, descripcion, usuario: usuarioId});
        await nuevaColeccion.save();
        await Usuario.findByIdAndUpdate(usuarioId, { $push: { coleccion: nuevaColeccion._id }});

        res.status(201).json({
            msg: "Colección creada exitosamente.",
            coleccion: nuevaColeccion,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al crear la colección.",
            error: (error as Error).message,
        });
    }
};


export const eliminarColeccion = async (req: RequestConUsuario, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        if (!validarId(id, res)) return;
        
        const coleccionAEliminar = await Coleccion.findById(id)
        if (!coleccionAEliminar) {
            return res.status(404).json({ msg: "Coleccion no encontrada." });
        }
        if (coleccionAEliminar.usuario.toString() !== usuarioId) {
            return res.status(403).json({ msg: "No tenés permiso para eliminar esta colección." });
        }

        await Coleccion.findByIdAndDelete(id)
        await Usuario.findByIdAndUpdate(usuarioId, { $pull: { coleccion: coleccionAEliminar._id }});

        res.status(200).json({
            msg: "Coleccion eliminada correctamente.",
            coleccion: coleccionAEliminar
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al eliminar la coleccion.",
            error: (error as Error).message
        });
    }
};

export const obtenerColeccionesPorUsuario = async (req: RequestConUsuario, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        if (!validarId(id, res)) return;
        
        const usuarioExistente = await Usuario.findById(id);
        if(!usuarioExistente){
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }
        if (usuarioExistente.id.toString() !== usuarioId) {
                return res.status(403).json({ msg: "No tenés permiso para modificar colecciones." });
        }

        const colecciones = await Coleccion.find({usuario: id})
        res.status(200).json({ colecciones });

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las colecciones." });
    }
};

export const agregarFotoAColeccion = async (req: RequestConUsuario, res: Response) => {
        try {
            const { id } = req.params;
            const { titulo, descripcion, fotoId } = req.body;
            const usuarioId = req.userId;
            
            if (!validarId(id, res)) return;
            if (!fotoId) {
                return res.status(400).json({ msg: "El ID de la foto es obligatorio en el body." });
            }
            
            const coleccionExistente = await Coleccion.findById(id);
            if (!coleccionExistente){
                return res.status(404).json({ msg: "Coleccion no encontrada." });
            }
            if (coleccionExistente.usuario.toString() !== usuarioId) {
                return res.status(403).json({ msg: "No tenés permiso para modificar esta colección." });
            }
             if (coleccionExistente.fotos.includes(fotoId)) {
                return res.status(200).json({ 
                    msg: "La foto ya se encuentra en esta colección.",
                    coleccionExistente
                });
            }
            
            const coleccionActualizada = await Coleccion.findByIdAndUpdate(id, { $addToSet: { fotos: fotoId } }, { new: true });

            if(titulo && coleccionActualizada){
                coleccionActualizada.titulo = titulo
            }
            if (descripcion && coleccionActualizada){
                coleccionActualizada.descripcion = descripcion
            }

            await coleccionActualizada?.save();
            res.status(200).json({
                msg: "Foto agregada exitosamente.",
                coleccion: coleccionActualizada
            });

        } catch (error) {
            res.status(500).json({ msg: "Error al agregar la foto a la coleccion." });
        }
};

export const obtenerTodasLasFotos = async (req: RequestConUsuario, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        if (!validarId(id, res)) return;

        const coleccionExistente = await Coleccion.findById(id).select('fotos usuario');
        if (!coleccionExistente){
            return res.status(404).json({ msg: "Colección no encontrada." });
        }

        if (coleccionExistente.usuario.toString() !== usuarioId) {
            return res.status(403).json({ msg: "No tenés permiso para ver esta colección." });
        }

        res.status(200).json({
            msg: "Fotos de la colección obtenidas exitosamente.",
            fotos: coleccionExistente.fotos
        });

    } catch (error) {
        res.status(500).json({ msg: "Error al buscar las fotos de la colección." });
    }
};

export const eliminarFotoDeColeccion = async (req: RequestConUsuario, res: Response) => {
    try {
            const { id } = req.params;
            const { fotoId } = req.body;
            const usuarioId = req.userId;

            if (!validarId(id, res)) return;

            if (!fotoId) {
                return res.status(400).json({ msg: "El ID de la foto es obligatorio en el body." });
            }

            const coleccionExistente = await Coleccion.findById(id);
            if (!coleccionExistente){
                return res.status(404).json({ msg: "Coleccion no encontrada." });
            }

            if (coleccionExistente.usuario.toString() !== usuarioId) {
                return res.status(403).json({ msg: "No tenés permiso para eliminar fotos de esta colección." });
            }
            const coleccionActualizada = await Coleccion.findByIdAndUpdate(id, { $pull: { fotos: fotoId } }, { new: true });
            
            res.status(200).json({
                msg: "Foto eliminada exitosamente.",
                coleccion: coleccionActualizada
            });
        } catch (error) {
            res.status(500).json({ msg: "Error al eliminar la foto a la coleccion." });
        }
};