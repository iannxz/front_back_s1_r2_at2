import { Router } from "express";
import categoriaRoutes from "./categoria.routes";
import produtoRoutes from "./produtos.routes";
import clienteRoutes from "./clientes.routes";
import vendedorRoutes from "./vendedores.routes";
import pedidoRoutes from "./pedidos.routes";
import itemPedidoRoutes from "./itenspedidos.routes";

const router = Router();

router.use("/", categoriaRoutes);
router.use("/", produtoRoutes);
router.use("/", clienteRoutes);
router.use("/", vendedorRoutes);
router.use("/", pedidoRoutes);
router.use("/", itemPedidoRoutes);

export default router;
