/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import db from "../db.js";

export const MiestoMeraniaModel = {

    getAll(callback) {
        const sql = `
            SELECT mm.id_meranie, mm.nazov, mm.id_miestnost, m.nazov AS miestnost_nazov
            FROM Miesto_merania mm
            JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
            ORDER BY mm.id_meranie DESC
        `;
        db.all(sql, [], callback);
    },

    create(nazov, id_miestnost, callback) {
        db.run(
            "INSERT INTO Miesto_merania (nazov, id_miestnost) VALUES (?, ?)",
            [nazov, id_miestnost],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    update(id, nazov, id_miestnost, callback) {
        db.run(
            "UPDATE Miesto_merania SET nazov = ?, id_miestnost = ? WHERE id_meranie = ?",
            [nazov, id_miestnost, id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },

    delete(id, callback) {
        db.run(
            "DELETE FROM Miesto_merania WHERE id_meranie = ?",
            [id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },

    getByRoom(id_miestnost, callback) {
        const sql = `
        SELECT mm.id_meranie, mm.nazov, mm.id_miestnost,
               m.nazov AS miestnost_nazov
        FROM Miesto_merania mm
        JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
        WHERE mm.id_miestnost = ?
        ORDER BY mm.id_meranie DESC
    `;
        db.all(sql, [id_miestnost], callback);
    },

    getById(id, callback) {
        const sql = `
        SELECT mm.id_meranie, mm.nazov, mm.id_miestnost,
               m.nazov AS miestnost_nazov
        FROM Miesto_merania mm
        JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
        WHERE mm.id_meranie = ?
    `;
        db.all(sql, [id], callback);
    }

};
