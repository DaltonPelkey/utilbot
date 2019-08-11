const mysql = require("mysql"),
    pool = mysql.createPool({
        "host": process.env.DATABASE_URL,
        "port": process.env.DATABASE_PORT,
        "user": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD,
        "database": process.env.DATABASE_SCHEMA,
        "multipleStatements": true,
        "charset": "utf8mb4"
    });

module.exports.query = async (query, args) => {
    return new Promise((resolve, reject) => {
        pool.query(query, args, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
