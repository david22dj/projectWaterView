import db from "../db.js";

export const FakturaModel = {

    create(data, callback) {
        const sql = `
            INSERT INTO Faktura 
            (nazov_suboru, povodny_nazov, typ_suboru, velkost)
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                data.nazov_suboru,
                data.povodny_nazov,
                data.typ_suboru,
                data.velkost
            ],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    getAll(callback) {
        db.all(
            "SELECT * FROM Faktura ORDER BY datum_uploadu DESC",
            [],
            callback
        );
    },

    getById(id, callback) {
        db.get(
            "SELECT * FROM Faktura WHERE id_faktura = ?",
            [id],
            callback
        );
    },

    updateMetadata(id, nazov, callback) {
        db.run(
            "UPDATE Faktura SET povodny_nazov = ? WHERE id_faktura = ?",
            [nazov, id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },

    delete(id, callback) {
        db.run(
            "DELETE FROM Faktura WHERE id_faktura = ?",
            [id],
            function (err) {
                callback(err, this.changes);
            }
        );
    }
};
