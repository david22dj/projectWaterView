import db from "../db.js";

export const MiestnostModel = {

    getAll(callback) {
        db.all("SELECT * FROM Miestnost", [], callback);
    },

    create(nazov, callback) {
        db.run(
            "INSERT INTO Miestnost (nazov) VALUES (?)",
            [nazov],
            function (err) {
                callback(err, this?.lastID);
            }
        );
    },

    update(id, nazov, callback) {
        db.run(
            "UPDATE Miestnost SET nazov = ? WHERE id_miestnost = ?",
            [nazov, id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },

    delete(id, callback) {
        db.run(
            "DELETE FROM Miestnost WHERE id_miestnost = ?",
            [id],
            function (err) {
                callback(err, this.changes);
            }
        );
    }
};
