import express from 'express';
import path from 'node:path';
import cors from 'cors';
import { EnvVar } from './config/EnvVar';
import router from './routes/routes';

const app = express();
const frontendPath = path.resolve(process.cwd(), "frontend");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

// Pasta uploads como arquivos estáticos
// Ex: GET /uploads/images/foto.jpg
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/",router);


app.listen(EnvVar.SERVER_PORT, () => {console.log(`Server rodando na porta http://localhost:${EnvVar.SERVER_PORT}`)});
