import { MiestnostModel } from "../models/MiestnostModel.js";

export const MiestnostController = {

    // GET /api/rooms
    getAll(req, res) {
        MiestnostModel.getAll((err, miestnosti) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(miestnosti);
        });
    },

    // POST /api/rooms
    create(req, res) {
        const { nazov, id_pouzivatel } = req.body;

        MiestnostModel.create(nazov, id_pouzivatel, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Miestnosť vytvorená", id });
        });
    },

    // DELETE /api/rooms/:id
    delete(req, res) {
        const id = req.params.id;

        MiestnostModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Miestnosť nenájdená" });
            res.json({ message: "Miestnosť zmazaná" });
        });
    }
};
