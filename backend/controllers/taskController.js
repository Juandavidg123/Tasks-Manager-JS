const db = require('../config/db');

exports.getTasks = async (req, res) => {
    const userId = req.userId;

    try {
        const tasks = await db`
            SELECT * FROM tareas 
            WHERE usuario_id = ${userId}
        `;

        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await db`
            SELECT * FROM tareas 
            WHERE id = ${id}
        `;

        if (task.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json(task[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTask = async (req, res) => {
    const { titulo, descripcion } = req.body;
    const userId = req.userId;

    try {
        const result = await db`
            INSERT INTO tareas (titulo, descripcion, usuario_id) 
            VALUES (${titulo}, ${descripcion}, ${userId}) 
            RETURNING id
        `;

        res.status(201).json({ message: 'Tarea creada', taskId: result[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;

    try {
        await db`
            UPDATE tareas 
            SET titulo = ${titulo}, descripcion = ${descripcion}, completada = ${completada} 
            WHERE id = ${id}
        `;

        res.status(200).json({ message: 'Tarea actualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await db`
            DELETE FROM tareas 
            WHERE id = ${id}
        `;

        res.status(200).json({ message: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};