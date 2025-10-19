import { Request, Response } from "express";
import Usuario from "../models/usuario";
import jwt from 'jsonwebtoken';

export const loginUsuario = async (req: Request, res: Response) => {
    try {
        const { email, contrasena } = req.body;
        if (!email || !contrasena) {
            return res.status(400).json({ msg: "Email y contraseña son obligatorios." });
        }

        const usuarioEncontrado = await Usuario.findOne({ email });
        if (!usuarioEncontrado) {
            return res.status(400).json({ msg: "Credenciales inválidas." });
        }

        const contrasenaValida = await usuarioEncontrado.compararContrasena(contrasena);
        if (!contrasenaValida) {
            return res.status(400).json({ msg: "Credenciales inválidas." });
        }

        const payload = { id: usuarioEncontrado._id, nombre: usuarioEncontrado.nombre};

        const token = jwt.sign(payload, process.env.JWTSIGN|| 'c0ntr4s3n4sup3rs3cr3t4', {
            expiresIn: '24h'
        });

        res.status(200).json({
            msg: "Login exitoso.",
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error al intentar iniciar sesión.",
            error: (error as Error).message
        });
    }
};