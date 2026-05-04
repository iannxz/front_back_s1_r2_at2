import { Router } from "express";
import { VendedorController } from "../controllers/vendedor.controller";

const vendedorController = new VendedorController();
const vendedorRoutes = Router();

// get
vendedorRoutes.get("/vendedores", vendedorController.selecionarTodos);
vendedorRoutes.get("/vendedores/:id", vendedorController.selecionarPorId);

// post
vendedorRoutes.post("/vendedores", vendedorController.criar);

// patch
vendedorRoutes.patch("/vendedores/:id", vendedorController.editar);

// delete
vendedorRoutes.delete("/vendedores/:id", vendedorController.deletar);

export default vendedorRoutes;
