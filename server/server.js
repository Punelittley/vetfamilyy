// server.js
const PORT = process.env.PORT || 5000; // Обязательно так, Render использует свой порт

// В начале, где cors
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // CLIENT_URL добавим в настройки Render
  credentials: true
}));