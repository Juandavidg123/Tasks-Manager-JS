const db = require('../config/db');

exports.getTasks = (req, res) => {
    const userId = req.userId;

    db.query(
        'SELECT * FROM tareas WHERE usuario_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json(results);
        }
    );
};

exports.getTaskById = (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT * FROM tareas WHERE id = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
            res.status(200).json(results[0]);
        }
    );
};

exports.createTask = (req, res) => {
    const { titulo, descripcion } = req.body;
    const userId = req.userId;

    db.query(
        'INSERT INTO tareas (titulo, descripcion, usuario_id) VALUES (?, ?, ?)',
        [titulo, descripcion, userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Tarea creada', taskId: result.insertId });
        }
    );
};

exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;

    db.query(
        'UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id = ?',
        [titulo, descripcion, completada, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Tarea actualizada' });
        }
    );
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM tareas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Tarea eliminada' });
    });
};
