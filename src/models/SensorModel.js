import db from "../db.js";

export const SensorModel = {

    // 1) GET ALL — všetky senzory + názvy miest a miestností
    getAll(callback) {
        const sql = `
            SELECT 
                Sensor.*,
                Miesto_merania.nazov AS nazov_merania,
                Miestnost.nazov AS nazov_miestnosti
            FROM Sensor
            JOIN Miesto_merania 
                ON Sensor.id_meranie = Miesto_merania.id_meranie
            JOIN Miestnost
                ON Miesto_merania.id_miestnost = Miestnost.id_miestnost
        `;

        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },

    // 2) CREATE — vytvorí senzor
    create(id_meranie, typ, jednotka, popis, callback) {
        const sql = `
            INSERT INTO Sensor (id_meranie, typ, jednotka, popis)
            VALUES (?, ?, ?, ?)
        `;
        db.run(sql, [id_meranie, typ, jednotka, popis], function(err) {
            callback(err, this?.lastID);
        });
    },

    // 3) DELETE — zmaže senzor
    delete(id, callback) {
        const sql = `
            DELETE FROM Sensor
            WHERE id_sensor = ?
        `;
        db.run(sql, [id], function(err) {
            callback(err, this?.changes);
        });
    }
};
