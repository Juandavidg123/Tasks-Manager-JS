const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createConnection = () => {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL no está definida en el archivo .env');
    }

    const connection = mysql.createConnection(process.env.DB_URL);

    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            process.exit(1);
        }
        console.log('Conexión exitosa a la base de datos');
    });

    return connection;
};

module.exports = createConnection();
