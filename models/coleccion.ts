import { Schema, model, Document, Types } from 'mongoose';

export interface IColeccion extends Document {
    titulo: string;
    descripcion: string; 
    usuario: Types.ObjectId; 
    fotos: string[]; 
}

const coleccionSchema = new Schema<IColeccion>({
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio.'],
        trim: true,
    },
    descripcion: {
        type: String,
       required: [true, 'La descripcion es obligatoria.']
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    fotos: [{
        type: String,
    }],
    }, {
        timestamps: true,
    }
);

const Coleccion = model<IColeccion>('Coleccion', coleccionSchema);
export default Coleccion;