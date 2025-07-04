import sqlite3 from 'sqlite3';

const SQLite = sqlite3.verbose();  

function query(command, params, method = 'all'){
    return new Promise(function (resolve, reject){
        db[method](command, params, function (err, rows){
            if (err) {
                console.error("Erro ao executar a consulta:", err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}


const db = new SQLite.Database("./src/database/banco.db", SQLite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
})

export {db, query};