import mongoose from "mongoose";

export const dbinitializer = async (): Promise<void> => {
    try {
        
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI no está definida en las variables de entorno.");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado a la base de datos.");

    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};