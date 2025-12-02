import { PouzivatelModel } from "../models/PouzivatelModel.js";

export const PouzivatelController = {

    // GET /api/users
    getAll(req, res) {
        PouzivatelModel.getAll((err, users) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(users);
        });
    },

    // POST /api/users
    create(req, res) {
        const { meno, email, heslo, rola } = req.body;

        PouzivatelModel.create(meno, email, heslo, rola, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Používateľ vytvorený", id });
        });
    },

    // DELETE /api/users/:id
    delete(req, res) {
        const id = req.params.id;

        PouzivatelModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Používateľ nenájdený" });
            res.json({ message: "Používateľ zmazaný" });
        });
    }
};
