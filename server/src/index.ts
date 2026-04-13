import express, { type Request, type Response } from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSockets } from './sockets/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

connectDB();

setupSockets(io);

app.use('/api', apiRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server funzionante!' });
});

httpServer.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});