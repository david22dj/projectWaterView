import db from "../db.js";

export const PouzivatelModel = {

    // 1) GET ALL - načíta všetkých používateľov
    getAll(callback) {
        const sql = `SELECT * FROM Pouzivatel`;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    },

    // 2) CREATE - vytvorí nového používateľa
    create(meno, email, heslo, rola, callback) {
        const sql = `
            INSERT INTO Pouzivatel (meno, email, heslo, rola)
            VALUES (?, ?, ?, ?)
        `;

        db.run(sql, [meno, email, heslo, rola], function (err) {
            callback(err, this?.lastID);
            // lastID = id nového používateľa
        });
    },

    // 3) GET BY EMAIL - nájde používateľa podľa emailu
    getByEmail(email, callback) {
        const sql = `SELECT * FROM Pouzivatel WHERE email = ?`;

        db.get(sql, [email], (err, row) => {
            callback(err, row);
        });
    },

    // 4) DELETE - zmaže používateľa podľa ID
    delete(id, callback) {
        const sql = `DELETE FROM Pouzivatel WHERE id_pouzivatel = ?`;

        db.run(sql, [id], function (err) {
            callback(err, this?.changes);
            // changes = 1, ak bol zmazaný
        });
    },
    getById(id, callback) {
        db.get(
            "SELECT * FROM Pouzivatel WHERE id_pouzivatel = ?",
            [id],
            callback
        );
    },

    updatePassword(id, heslo, callback) {
        db.run(
            "UPDATE Pouzivatel SET heslo = ? WHERE id_pouzivatel = ?",
            [heslo, id],
            function (err) {
                callback(err, this.changes);
            }
        );
    },


    update(id, meno, email, rola, callback) {
    db.run(
        "UPDATE Pouzivatel SET meno = ?, email = ?, rola = ? WHERE id_pouzivatel = ?",
        [meno, email, rola, id],
        function (err) {
            callback(err, this.changes);
        }
    );

}

};
