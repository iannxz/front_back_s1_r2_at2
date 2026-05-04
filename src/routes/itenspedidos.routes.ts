import { Router } from "express";
import { ItemPedidoController } from "../controllers/itemPedido.controller";

const itemPedidoController = new ItemPedidoController();
const itemPedidoRoutes = Router();

// get
itemPedidoRoutes.get("/itenspedidos/pedido/:idpedido", itemPedidoController.selecionarPorPedido);
itemPedidoRoutes.get("/itenspedidos/:id", itemPedidoController.selecionarPorId);

// post
itemPedidoRoutes.post("/itenspedidos", itemPedidoController.criar);

// patch
itemPedidoRoutes.patch("/itenspedidos/:id", itemPedidoController.editar);

// delete
itemPedidoRoutes.delete("/itenspedidos/:id", itemPedidoController.deletar);

export default itemPedidoRoutes;
