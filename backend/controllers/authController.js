const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    const { nombre, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0)
                return res.status(404).json({ message: 'Usuario no encontrado' });

            const user = results[0];

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

            res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        }
    );
};
