import { Response } from "express";
import mongoose from "mongoose";

export const validarId = (id: string, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ msg: "ID inválido" });
        return false;
  }
  return true;
};
