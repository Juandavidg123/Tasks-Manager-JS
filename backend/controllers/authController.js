const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        await db`
            INSERT INTO usuarios (nombre, email, password) 
            VALUES (${nombre}, ${email}, ${hashedPassword})
        `;

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db`
            SELECT * FROM usuarios 
            WHERE email = ${email}
        `;

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isValid = bcrypt.compareSync(password, user[0].password);
        if (!isValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};