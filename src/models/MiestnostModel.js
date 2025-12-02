import db from "../db.js";

export const MiestnostModel = {

    // 1) Načíta všetky miestnosti (aj s menom používateľa)
    getAll(callback) {
        const sql = `
            SELECT Miestnost.*, Pouzivatel.meno AS meno_pouzivatela
            FROM Miestnost
            JOIN Pouzivatel ON Miestnost.id_pouzivatel = Pouzivatel.id_pouzivatel
        `;

        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },

    // 2) Vytvorí miestnosť
    create(nazov, id_pouzivatel, callback) {
        const sql = `
            INSERT INTO Miestnost (nazov, id_pouzivatel)
            VALUES (?, ?)
        `;
        db.run(sql, [nazov, id_pouzivatel], function (err) {
            callback(err, this?.lastID);
        });
    },

    // 3) Zmaže miestnosť
    delete(id, callback) {
        const sql = `
            DELETE FROM Miestnost 
            WHERE id_miestnost = ?
        `;
        db.run(sql, [id], function (err) {
            callback(err, this?.changes);
        });
    }
};
