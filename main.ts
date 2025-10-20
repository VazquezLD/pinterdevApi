import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server } from "./models/Server";
import dotenv from "dotenv";

dotenv.config();
const app = new Server().app;


app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

export default app;

