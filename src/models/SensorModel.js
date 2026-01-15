import db from "../db.js";

export const SensorModel = {

    getAll(callback) {
        const sql = `
            SELECT 
                s.id_sensor,
                s.id_meranie,
                s.typ,
                s.jednotka,
                s.popis,
                mm.nazov AS meranie_nazov,
                m.nazov AS miestnost_nazov
            FROM Sensor s
            JOIN Miesto_merania mm ON s.id_meranie = mm.id_meranie
            JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
            ORDER BY s.id_sensor DESC
        `;
        db.all(sql, [], callback);
    },

    create(id_meranie, typ, jednotka, popis, callback) {
        db.run(
            `INSERT INTO Sensor (id_meranie, typ, jednotka, popis)
             VALUES (?, ?, ?, ?)`,
            [id_meranie, typ, jednotka, popis],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    update(id, id_meranie, typ, jednotka, popis, callback) {
        db.run(
            `UPDATE Sensor
             SET id_meranie = ?, typ = ?, jednotka = ?, popis = ?
             WHERE id_sensor = ?`,
            [id_meranie, typ, jednotka, popis, id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },

    delete(id, callback) {
        db.run(
            "DELETE FROM Sensor WHERE id_sensor = ?",
            [id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },
    // senzory podľa miestnosti
    getByRoom(id_miestnost, callback) {
        const sql = `
        SELECT
            s.id_sensor,
            s.id_meranie,
            s.typ,
            s.jednotka,
            s.popis,
            mm.nazov AS meranie_nazov,
            m.nazov AS miestnost_nazov
        FROM Sensor s
        JOIN Miesto_merania mm ON s.id_meranie = mm.id_meranie
        JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
        WHERE m.id_miestnost = ?
        ORDER BY s.id_sensor DESC
    `;
        db.all(sql, [id_miestnost], callback);
    },

// senzory podľa miesta merania
    getByMeasure(id_meranie, callback) {
        const sql = `
        SELECT
            s.id_sensor,
            s.id_meranie,
            s.typ,
            s.jednotka,
            s.popis,
            mm.nazov AS meranie_nazov,
            m.nazov AS miestnost_nazov
        FROM Sensor s
        JOIN Miesto_merania mm ON s.id_meranie = mm.id_meranie
        JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
        WHERE mm.id_meranie = ?
        ORDER BY s.id_sensor DESC
    `;
        db.all(sql, [id_meranie], callback);
    }
};
