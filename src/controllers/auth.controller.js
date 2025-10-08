const bcrypt = require('bcrypt');
const pool = require('../db/db');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../validation/auth.validation');

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  try {
    // Валидация
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => d.message),
      });
    }

    // Добавление данных
    const { fullName, birthday, email, password } = value;

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Проверка на отсутствие почты в бд
    const [existingRows] = await pool.execute(
      'SELECT id FROM person WHERE email = ?',
      [email]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Внесение данных в бд
    const [result] = await pool.execute(
      `INSERT INTO person (fullName, birthday, email, password, role_id, status_id) 
       VALUES (?, ?, ?, ?, 3, 1)`,
      [fullName, birthday, email, hashedPassword]
    );

    return res.status(201).json({
      id: result.insertId,
      fullName,
      email,
      birthday,
      role: 'user',
      status: 'active'
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const authorization = async (req, res) => {
    try {
        // Валидация
        const { error, value } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(d => d.message),
            });
        }

        // Добавление данных
        const { email, password } = value;

        // Поиск пользователя по почте
        const [rows] = await pool.execute(
            'SELECT * FROM person WHERE email = ?',
            [email]
        );

        if (rows.length == 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        // Проверка аккаунта на активность
        if (user.status_id !== 1) {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        // Сравнение паролей
        const isPasswordValid = await  bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Генерация токена
        const role = user.role_id === 2 ? 'admin' : 'user';

        const token = jwt.sign(
            { id: user.id, email: user.email, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        // Отправка ответа
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role,
                status: user.status_id === 1 ? 'active' : 'non active',
            },
        });

    }   catch (err) {
        console.error('Authorization error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { register, authorization };