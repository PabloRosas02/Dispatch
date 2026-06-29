import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cacheRoutes from './routes/cacheRoutes';
import serverRoutes from './routes/serverRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES CENTRALES ---
app.use(cors());
// MODIFICACIÓN: Se incrementa el límite a 50mb para soportar payloads grandes de Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- MAPEO DE ENDPOINTS ---
app.use('/api/cache', cacheRoutes);
app.use('/api/servers', serverRoutes);

// Ruta Base / Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "online", 
    message: "Servidor TS corriendo perfectamente",
    timestamp: new Date()
  });
});

// --- ENCENDIDO DEL ENTORNO ---
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`Servidor en TypeScript activo: http://localhost:${PORT}`);
  console.log(`Enrutador de Servidores RP: http://localhost:${PORT}/api/servers`);
  console.log(`Enrutador de Caché de Strings: http://localhost:${PORT}/api/cache`);
  console.log(`================================================================`);
});