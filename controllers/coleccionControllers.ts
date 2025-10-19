import { Request, Response } from "express";
import Coleccion from "../models/coleccion";
import Usuario from "../models/usuario";
import { RequestConUsuario } from "../middlewares/autenticarMiddleware"

export const crearColeccion = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, usuarioId } = req.body;

        if (!titulo || !descripcion || !usuarioId) {
            return res.status(400).json({ msg: "Título, descripción y usuarioId son obligatorios." });
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


export const eliminarColeccion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: "El ID de la coleccion es obligatoria." });
        }
    
         const coleccionEliminada = await Coleccion.findByIdAndDelete(id);
        if (!coleccionEliminada) {
            return res.status(404).json({ msg: "Coleccion no encontrada." });
        }
        const usuarioId = coleccionEliminada.usuario; 
        await Usuario.findByIdAndUpdate(usuarioId, { $pull: { coleccion: coleccionEliminada._id }});

        res.status(200).json({
            msg: "Coleccion eliminada correctamente.",
            coleccion: coleccionEliminada
        });
    
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al eliminar la coleccion.",
            error: (error as Error).message
        });
    }
};

export const obtenerColeccionesPorUsuario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: "El ID del usuario es obligatorio." });
        }
        
        const usuarioExistente = await Usuario.findById(id);
        if(!usuarioExistente){
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const colecciones = await Coleccion.find({usuario: id})
        res.status(200).json({ colecciones });

    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las colecciones." });
    }
};

export const agregarFotoAColeccion = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { fotoId } = req.body;

            if (!fotoId) {
                return res.status(400).json({ msg: "El ID de la foto es obligatorio en el body." });
            }

            if (!id){
                return res.status(400).json({ msg: "El ID de la coleccion es obligatoria." });
            }

            const coleccionExistente = await Coleccion.findById(id);
            if (!coleccionExistente){
                return res.status(404).json({ msg: "Coleccion no encontrada." });
            }
            const coleccionActualizada = await Coleccion.findByIdAndUpdate(id, { $push: { fotos: fotoId } }, { new: true });
            
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

        if (!id){
            return res.status(400).json({ msg: "El ID de la colección es obligatorio." });
        }

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
        console.error(error);
        res.status(500).json({ msg: "Error al buscar las fotos de la colección." });
    }
};
