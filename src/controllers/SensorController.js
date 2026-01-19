/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import { SensorModel } from "../models/SensorModel.js";
import { MiestoMeraniaModel } from "../models/MiestoMeraniaModel.js";

export const SensorController = {

    // GET /api/sensors
    getAll(req, res) {
        const { roomId, measureId } = req.query;

        // FILTER PODĽA MIESTA MERANIA (má prednosť)
        if (measureId) {
            if (isNaN(measureId)) {
                return res.status(400).json({ error: "Neplatné ID miesta merania." });
            }

            return SensorModel.getByMeasure(measureId, (err, rows) => {
                if (err) return res.status(500).json({ error: "Chyba servera." });
                res.json(rows);
            });
        }

        // FILTER PODĽA MIESTNOSTI
        if (roomId) {
            if (isNaN(roomId)) {
                return res.status(400).json({ error: "Neplatné ID miestnosti." });
            }

            return SensorModel.getByRoom(roomId, (err, rows) => {
                if (err) return res.status(500).json({ error: "Chyba servera." });
                res.json(rows);
            });
        }

        // BEZ FILTRA – všetky senzory
        SensorModel.getAll((err, rows) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });
            res.json(rows);
        });
    },

    // POST /api/sensors
    create(req, res) {
        const { id_meranie, typ, jednotka, popis } = req.body;

        if (!id_meranie || isNaN(id_meranie)) {
            return res.status(400).json({ error: "Vyberte platné miesto merania." });
        }
        if (!typ || typ.trim().length === 0) {
            return res.status(400).json({ error: "Typ senzora je povinný." });
        }
        if (!jednotka || jednotka.trim().length === 0) {
            return res.status(400).json({ error: "Jednotka senzora je povinná." });
        }

        // overenie existencie miesta merania (SERVER VALIDÁCIA)
        MiestoMeraniaModel.getAll((err, merania) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });

            const exists = merania.some(m => m.id_meranie === Number(id_meranie));
            if (!exists) {
                return res.status(400).json({ error: "Miesto merania neexistuje." });
            }

            SensorModel.create(
                id_meranie,
                typ.trim(),
                jednotka.trim(),
                popis?.trim() || null,
                (err2, id) => {
                    if (err2) return res.status(500).json({ error: "Chyba pri vytváraní senzora." });
                    res.json({ message: "Senzor vytvorený", id });
                }
            );
        });
    },

    // PUT /api/sensors/:id
    update(req, res) {
        const id = req.params.id;
        const { id_meranie, typ, jednotka, popis } = req.body;

        if (!id_meranie || isNaN(id_meranie)) {
            return res.status(400).json({ error: "Vyberte platné miesto merania." });
        }
        if (!typ || typ.trim().length === 0) {
            return res.status(400).json({ error: "Typ senzora je povinný." });
        }
        if (!jednotka || jednotka.trim().length === 0) {
            return res.status(400).json({ error: "Jednotka senzora je povinná." });
        }

        MiestoMeraniaModel.getAll((err, merania) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });

            const exists = merania.some(m => m.id_meranie === Number(id_meranie));
            if (!exists) {
                return res.status(400).json({ error: "Miesto merania neexistuje." });
            }

            SensorModel.update(
                id,
                id_meranie,
                typ.trim(),
                jednotka.trim(),
                popis?.trim() || null,
                (err2, changes) => {
                    if (err2) return res.status(500).json({ error: "Chyba pri úprave senzora." });
                    if (changes === 0) return res.status(404).json({ error: "Senzor neexistuje." });

                    res.json({ message: "Senzor upravený" });
                }
            );
        });
    },

    // DELETE /api/sensors/:id
    delete(req, res) {
        const id = req.params.id;

        SensorModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: "Chyba pri mazaní senzora." });
            if (changes === 0) return res.status(404).json({ error: "Senzor neexistuje." });

            res.json({ message: "Senzor zmazaný" });
        });
    }
};
