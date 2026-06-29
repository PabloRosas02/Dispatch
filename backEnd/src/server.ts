import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cacheRoutes from './routes/cacheRoutes';
import serverRoutes from './routes/serverRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES CENTRALES ---
app.use(cors());
app.use(express.json());

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