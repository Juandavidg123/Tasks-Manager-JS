const postgres = require('postgres');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createConnection = () => {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL no está definida en el archivo .env');
    }

    const connection = postgres(process.env.DB_URL);
    if (!connection) {
        throw new Error('No se pudo conectar a la base de datos');
    }
    else {
        console.log('Conexión a la base de datos establecida');
    }

    return connection;
};

module.exports = createConnection();
