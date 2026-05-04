import { Router } from "express";
import { ClienteController } from "../controllers/cliente.controller";

const clienteController = new ClienteController();
const clienteRoutes = Router();

// get
clienteRoutes.get("/clientes", clienteController.selecionarTodos);
clienteRoutes.get("/clientes/:id", clienteController.selecionarPorId);

// post
clienteRoutes.post("/clientes", clienteController.criar);

// patch
clienteRoutes.patch("/clientes/:id", clienteController.editar);

// delete
clienteRoutes.delete("/clientes/:id", clienteController.deletar);

export default clienteRoutes;
