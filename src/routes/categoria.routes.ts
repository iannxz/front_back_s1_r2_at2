import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

const categoriaController = new CategoriaController();
const categoriaRoutes = Router();


//get
categoriaRoutes.get("/categorias", categoriaController.selecionarTodos);
categoriaRoutes.get("/categorias/:id", categoriaController.selecionarPorId);
// post
categoriaRoutes.post("/categorias", categoriaController.criar);

// patch
categoriaRoutes.patch("/categorias/:id", categoriaController.editar);

// delete
categoriaRoutes.delete("/categorias/:id", categoriaController.deletar);

export default categoriaRoutes;
