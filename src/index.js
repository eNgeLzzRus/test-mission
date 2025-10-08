require('dotenv').config();
const express = require('express');
const db = require('./db/db');

const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes')

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})