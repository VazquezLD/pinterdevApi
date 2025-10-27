import express, { Request, Response, NextFunction } from "express";
import { Server } from "./models/Server";
import dotenv from "dotenv";

dotenv.config();
const app = new Server().app;
app.use(express.json());

export default app;

