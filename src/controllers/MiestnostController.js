import { MiestnostModel } from "../models/MiestnostModel.js";

export const MiestnostController = {

    // GET /api/rooms
    getAll(req, res) {
        MiestnostModel.getAll((err, rooms) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri načítaní miestností." });
            }
            res.json(rooms);
        });
    },

    // POST /api/rooms
    create(req, res) {
        const { nazov } = req.body;

        // SERVER VALIDÁCIA
        if (!nazov || nazov.trim().length === 0) {
            return res.status(400).json({ error: "Názov miestnosti je povinný." });
        }

        MiestnostModel.create(nazov.trim(), (err, id) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri vytváraní miestnosti." });
            }

            res.json({
                message: "Miestnosť vytvorená",
                id
            });
        });
    },

    // PUT /api/rooms/:id
    update(req, res) {
        const { nazov } = req.body;
        const id = req.params.id;

        // SERVER VALIDÁCIA
        if (!nazov || nazov.trim().length === 0) {
            return res.status(400).json({ error: "Názov miestnosti je povinný." });
        }

        if (isNaN(id)) {
            return res.status(400).json({ error: "Neplatné ID miestnosti." });
        }


        MiestnostModel.update(id, nazov.trim(), (err, changes) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri úprave miestnosti." });
            }

            if (changes === 0) {
                return res.status(404).json({ error: "Miestnosť neexistuje." });
            }

            res.json({ message: "Miestnosť upravená." });
        });
    },

    // DELETE /api/rooms/:id
    delete(req, res) {
        const id = req.params.id;

        MiestnostModel.delete(id, (err, changes) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri mazaní miestnosti." });
            }

            if (isNaN(id)) {
                return res.status(400).json({ error: "Neplatné ID miestnosti." });
            }


            if (changes === 0) {
                return res.status(404).json({ error: "Miestnosť neexistuje." });
            }

            res.json({ message: "Miestnosť zmazaná." });
        });
    }
};
