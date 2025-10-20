import { Request, Response } from "express";
import Usuario, { IUsuario } from "../models/usuario";
import { RequestConUsuario } from "../middlewares/autenticarMiddleware";
import { validarId } from "../helpers/validarId";

export const crearUsuario = async (req: Request, res: Response) => {

    try {
        const usuarioData: IUsuario = req.body;

        if (!usuarioData.nombre || !usuarioData.email || !usuarioData.contrasena) {
            return res.status(400).json({ msg: "Nombre, email y contraseña son obligatorios." });
        }

        const usuarioExistente = await Usuario.findOne({ email: usuarioData.email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "El email ya está registrado." });
        }

        const usuario = new Usuario(usuarioData);
        await usuario.save();

        const { contrasena, ...usuarioSinContrasena } = usuario.toObject();

        res.status(201).json({
            msg: "Usuario creado exitosamente.",
            usuario: usuarioSinContrasena
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al crear el usuario.",
            error: (error as Error).message
        });
    }

}

export const eliminarUsuario = async (req: RequestConUsuario, res: Response) => {
    try {
        const usuarioId = req.userId;
        const { id } = req.params;
        if (!validarId(id, res)) return;

        const usuarioAEliminar = await Usuario.findByIdAndDelete(id);

        if (!usuarioAEliminar) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }
        if(usuarioAEliminar.id !== usuarioId){
            return res.status(403).json({ msg: "No tenés permiso para eliminar usuarios." });
        }

        await Usuario.findByIdAndDelete(id);

        const { contrasena, ...usuarioSinContrasena } = usuarioAEliminar.toObject();
        res.status(200).json({
            msg: "Usuario eliminado correctamente.",
            usuario: usuarioSinContrasena
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al eliminar el usuario.",
            error: (error as Error).message
        });
    }
};


