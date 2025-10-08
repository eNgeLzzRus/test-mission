const pool = require('../db/db');

const getById = async (req, res) => {
    try {
        const userId = req.params.id;

        const [rows] = await pool.execute(
            'SELECT * FROM person WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'User not found' });
        }

        const user = rows[0];
        const role = user.role_id === 2 ? 'admin' : 'user';
        const status = user.status_id === 1 ? 'active' : 'non active';

        return res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            birthday: user.birthday,
            role: role,
            status: status,
        });


    }   catch (err) {
        console.error('Get user error:', err);
        return res.status(500).json({ error: 'Internsl server error' })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM person');

        const users = rows.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            birthday: user.birthday,
            role: user.role_id === 2 ? 'admin' : 'user',
            status: user.status_id === 1 ? 'active' : 'non active',
        }));

        return res.status(200).json(users);

    }   catch (err) {
        console.error('Get all users error:', err);
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const banUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const [rows] = await pool.execute(
            'SELECT * FROM person WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'User not found' });
        }

        const [ban] = await pool.execute(
            `UPDATE person SET status_id = 2 WHERE id = ?`,
            [userId]
        );

        const [updatedRows] = await pool.execute(
            'SELECT * FROM person WHERE id = ?',
            [userId]
        );

        const user = updatedRows[0];
        const role = user.role_id === 2 ? 'admin' : 'user';
        const status = user.status_id === 1 ? 'active' : 'non active';

        return res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            birthday: user.birthday,
            role: role,
            status: status,
        });

    }   catch (err) {
        console.error('Ban user error:', err);
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { getById, getAllUsers, banUser };