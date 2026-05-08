import express, { ErrorRequestHandler } from "express";
import path from "node:path";
import cors from "cors";
import multer from "multer";
import { EnvVar } from "./config/EnvVar";
import router from "./routes/routes";

const app = express();
const frontendPath = path.resolve(process.cwd(), "frontend");
const uploadsPath = path.resolve(process.cwd(), "uploads");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendPath));
app.use("/uploads", express.static(uploadsPath));

app.get("/health", (_req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/", router);

app.use((_req, res) => {
  return res.status(404).json({ error: "Rota nao encontrada." });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isUploadError =
    error instanceof multer.MulterError ||
    (error instanceof Error && error.message.includes("arquivo"));

  if (isUploadError) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Arquivo invalido.",
    });
  }

  console.error("Erro interno no servidor:", error);
  return res.status(500).json({
    error: "Erro interno no servidor.",
    errorMessage: error instanceof Error ? error.message : "Erro desconhecido",
  });
};

app.use(errorHandler);

app.listen(EnvVar.SERVER_PORT, () => {
  console.log(`Server rodando em http://localhost:${EnvVar.SERVER_PORT}`);
});
