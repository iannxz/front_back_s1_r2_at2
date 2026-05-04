import { Router } from "express";
import { PedidoController } from "../controllers/pedido.controller";

const pedidoController = new PedidoController();
const pedidoRoutes = Router();

// get
pedidoRoutes.get("/pedidos", pedidoController.selecionarTodos);
pedidoRoutes.get("/pedidos/:id", pedidoController.selecionarPorId);
pedidoRoutes.get("/pedidos/cliente/:idcliente", pedidoController.selecionarPorCliente);

// post
pedidoRoutes.post("/pedidos", pedidoController.criar);

// patch
pedidoRoutes.patch("/pedidos/:id", pedidoController.editar);

// delete
pedidoRoutes.delete("/pedidos/:id", pedidoController.deletar);

export default pedidoRoutes;
