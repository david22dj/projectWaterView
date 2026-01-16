import db from "../db.js";

export const ZaznamModel = {

    // READ – všetky záznamy + kontext
    getAll(callback) {
        const sql = `
            SELECT
                z.id_zaznam,
                z.hodnota,
                z.cas,
                z.id_sensor,
                s.typ AS sensor_typ,
                s.jednotka,
                mm.nazov AS meranie_nazov,
                m.nazov AS miestnost_nazov
            FROM Zaznam z
            JOIN Sensor s ON z.id_sensor = s.id_sensor
            JOIN Miesto_merania mm ON s.id_meranie = mm.id_meranie
            JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
            ORDER BY z.cas DESC
        `;
        db.all(sql, [], callback);
    },

    getByDate(date, callback) {
        const sql = `
        SELECT
            z.id_zaznam,
            z.hodnota,
            z.cas,
            s.typ AS sensor_typ,
            s.jednotka,
            mm.nazov AS meranie_nazov,
            m.nazov AS miestnost_nazov
        FROM Zaznam z
        JOIN Sensor s ON z.id_sensor = s.id_sensor
        JOIN Miesto_merania mm ON s.id_meranie = mm.id_meranie
        JOIN Miestnost m ON mm.id_miestnost = m.id_miestnost
        WHERE DATE(z.cas) = ?
        ORDER BY z.cas DESC
    `;
        db.all(sql, [date], callback);
    },


    // CREATE
    create(hodnota, cas, id_sensor, callback) {
        const sql = `
            INSERT INTO Zaznam (hodnota, cas, id_sensor)
            VALUES (?, ?, ?)
        `;
        db.run(sql, [hodnota, cas, id_sensor], function (err) {
            callback(err, this?.lastID);
        });
    },

    // DELETE
    delete(id, callback) {
        const sql = `DELETE FROM Zaznam WHERE id_zaznam = ?`;
        db.run(sql, [id], function (err) {
            callback(err, this.changes);
        });
    }
};
