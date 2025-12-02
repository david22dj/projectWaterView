import db from "../db.js";

export const MiestoMeraniaModel = {

    // 1) GET ALL — všetky miesta merania (aj s názvom miestnosti)
    getAll(callback) {
        const sql = `
            SELECT 
                Miesto_merania.*, 
                Miestnost.nazov AS nazov_miestnosti
            FROM Miesto_merania
            JOIN Miestnost 
            ON Miesto_merania.id_miestnost = Miestnost.id_miestnost
        `;

        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },

    // 2) CREATE — vytvorí meracie miesto
    create(nazov, id_miestnost, callback) {
        const sql = `
            INSERT INTO Miesto_merania (nazov, id_miestnost)
            VALUES (?, ?)
        `;
        db.run(sql, [nazov, id_miestnost], function (err) {
            callback(err, this?.lastID);
        });
    },

    // 3) DELETE — zmaže miesto merania
    delete(id, callback) {
        const sql = `
            DELETE FROM Miesto_merania
            WHERE id_meranie = ?
        `;
        db.run(sql, [id], function (err) {
            callback(err, this?.changes);
        });
    }
};
