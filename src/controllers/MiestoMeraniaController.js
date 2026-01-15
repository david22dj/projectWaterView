import { MiestoMeraniaModel } from "../models/MiestoMeraniaModel.js";
import { MiestnostModel } from "../models/MiestnostModel.js";

export const MiestoMeraniaController = {

    // GET /api/measurements
    getAll(req, res) {
        const { roomId, measureId } = req.query;

        if (measureId) {
            if (isNaN(measureId)) {
                return res.status(400).json({ error: "Neplatné ID miesta merania." });
            }

            return MiestoMeraniaModel.getById(measureId, (err, rows) => {
                if (err) return res.status(500).json({ error: "Chyba servera." });
                res.json(rows);
            });
        }

        if (roomId) {
            if (isNaN(roomId)) {
                return res.status(400).json({ error: "Neplatné ID miestnosti." });
            }

            return MiestoMeraniaModel.getByRoom(roomId, (err, rows) => {
                if (err) return res.status(500).json({ error: "Chyba servera." });
                res.json(rows);
            });
        }

        MiestoMeraniaModel.getAll((err, rows) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });
            res.json(rows);
        });
    },

    // POST /api/measurements
    create(req, res) {
        const { nazov, id_miestnost } = req.body;

        if (!nazov || nazov.trim().length === 0) {
            return res.status(400).json({ error: "Názov miesta merania je povinný." });
        }

        const roomId = Number(id_miestnost);
        if (!roomId || Number.isNaN(roomId)) {
            return res.status(400).json({ error: "Vyberte platnú miestnosť." });
        }

        // overenie existencie miestnosti (server-side)
        MiestnostModel.getAll((err, rooms) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });

            const exists = rooms.some(r => r.id_miestnost === roomId);
            if (!exists) {
                return res.status(400).json({ error: "Zvolená miestnosť neexistuje." });
            }

            MiestoMeraniaModel.create(nazov.trim(), roomId, (err2, id) => {
                if (err2) return res.status(500).json({ error: "Chyba pri vytváraní miesta merania." });
                res.json({ message: "Miesto merania vytvorené", id });
            });
        });
    },

    // PUT /api/measurements/:id
    update(req, res) {
        const id = req.params.id;
        const { nazov, id_miestnost } = req.body;

        if (!nazov || nazov.trim().length === 0) {
            return res.status(400).json({ error: "Názov miesta merania je povinný." });
        }

        const roomId = Number(id_miestnost);
        if (!roomId || Number.isNaN(roomId)) {
            return res.status(400).json({ error: "Vyberte platnú miestnosť." });
        }

        MiestnostModel.getAll((err, rooms) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });

            const exists = rooms.some(r => r.id_miestnost === roomId);
            if (!exists) {
                return res.status(400).json({ error: "Zvolená miestnosť neexistuje." });
            }

            MiestoMeraniaModel.update(id, nazov.trim(), roomId, (err2, changes) => {
                if (err2) return res.status(500).json({ error: "Chyba pri úprave miesta merania." });
                if (changes === 0) return res.status(404).json({ error: "Miesto merania neexistuje." });

                res.json({ message: "Miesto merania upravené" });
            });
        });
    },

    // DELETE /api/measurements/:id
    delete(req, res) {
        const id = req.params.id;

        MiestoMeraniaModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: "Chyba pri mazaní miesta merania." });
            if (changes === 0) return res.status(404).json({ error: "Miesto merania neexistuje." });

            res.json({ message: "Miesto merania zmazané" });
        });
    }
};
