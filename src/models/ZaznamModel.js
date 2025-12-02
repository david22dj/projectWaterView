import db from "../db.js";

export const ZaznamModel = {

    // 1) Vráti všetky záznamy aj s informáciami o senzore
    getAll(callback) {
        const sql = `
            SELECT 
                Zaznam.*,
                Sensor.typ AS typ_senzora,
                Sensor.jednotka,
                Miesto_merania.nazov AS miesto,
                Miestnost.nazov AS miestnost
            FROM Zaznam
            JOIN Sensor ON Zaznam.id_sensor = Sensor.id_sensor
            JOIN Miesto_merania ON Sensor.id_meranie = Miesto_merania.id_meranie
            JOIN Miestnost ON Miesto_merania.id_miestnost = Miestnost.id_miestnost
            ORDER BY cas DESC
        `;
        db.all(sql, [], (err, rows) => callback(err, rows));
    },

    // 2) Vytvorí nový záznam
    create(hodnota, cas, id_sensor, callback) {
        const sql = `
            INSERT INTO Zaznam (hodnota, cas, id_sensor)
            VALUES (?, ?, ?)
        `;
        db.run(sql, [hodnota, cas, id_sensor], function(err) {
            callback(err, this?.lastID);
        });
    },

    // 3) Zmaže záznam
    delete(id, callback) {
        const sql = `
            DELETE FROM Zaznam WHERE id_zaznam = ?
        `;
        db.run(sql, [id], function(err) {
            callback(err, this?.changes);
        });
    }
};
