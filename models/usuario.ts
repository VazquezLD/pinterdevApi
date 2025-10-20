import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import Coleccion from "../models/coleccion";

export interface IUsuario extends Document {
    nombre: string;
    estado: boolean;
    email: string;
    contrasena: string;
    coleccion: Types.ObjectId[];
    compararContrasena(contrasena: string): Promise<boolean>;
}


const usuarioSchema = new Schema<IUsuario>({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        trim: true,
    },
    estado: {
        type: Boolean,
        default: false, 
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    contrasena: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
    },
    coleccion: [{
        type: Schema.Types.ObjectId,
        ref: 'Coleccion', 
    }],
    }, {
        timestamps: true,
    }
);

usuarioSchema.pre<IUsuario>('save', async function (next) {
    if (!this.isModified('contrasena')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena!, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

usuarioSchema.pre("findOneAndDelete", async function (next) {
    const usuarioId = this.getFilter()._id;
    await Coleccion.deleteMany({ usuario: usuarioId });
    next();
});

usuarioSchema.methods.compararContrasena = async function (contrasena: string): Promise<boolean> {
    return await bcrypt.compare(contrasena, this.contrasena);
};
const Usuario = model<IUsuario>('Usuario', usuarioSchema);
export default Usuario;