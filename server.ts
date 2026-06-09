import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Configure Multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'memories-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static(uploadDir));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Ensure data file exists with default values if not present
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const defaultData = {
      title: "Happy 27th Mensive, Bebeyy! ❤️",
      heroMessage: "ga kerasa sudah berjalan 27 bulan kita bersama beyy, rendyy berharap kita bisa ulangin lagi tanggal kita sampe berbulan - bulan bahkan bertahun - tahun. terimakasih bebeyy udah nemenin rendyy. you are a very important role and very very meaningful in my life. I LOVE YOU MORE BEYY😘🤗❤️",
      secretMessage: "Terima kasih sudah bertahan sampai saat ini. I love you more than words can say beyy. 💕",
      musicUrl: "/uploads/memories-1781009504158-396011351.mp3",
      gallery: [
        "https://images.unsplash.com/photo-1518199266791-5375a5078a63?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd78536f9e5?auto=format&fit=crop&w=800&q=80"
      ],
      boxMessages: [
        {
          id: "1",
          title: "UNTUK BEBEYY",
          content: "Terima kasih telah hadir di hidup rendyy"
        },
        {
          id: "2",
          title: "Tentang Waktu",
          content: "Waktu berjalan begitu cepat, tapi bersamamu aku tidak pernah keberatan."
        },
        {
          id: "3",
          title: "Untuk Masa Depan",
          content: "Kalau suatu hari kita sedang lelah, semoga kita ingat alasan mengapa kita bertahan sejauh ini."
        }
      ]
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

app.get('/api/config', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save config' });
  }
});

async function startServer() {
  await ensureDataFile();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
