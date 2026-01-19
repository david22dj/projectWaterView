/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import { ZaznamModel } from "../models/ZaznamModel.js";
import { SensorModel } from "../models/SensorModel.js";

export const ZaznamController = {

    // GET /api/records
    getAll(req, res) {
        const { date } = req.query;

        if (date) {
            return ZaznamModel.getByDate(date, (err, rows) => {
                if (err) return res.status(500).json({ error: "Chyba pri filtrovaní." });
                res.json(rows);
            });
        }

        ZaznamModel.getAll((err, rows) => {
            if (err) return res.status(500).json({ error: "Chyba pri načítaní záznamov." });
            res.json(rows);
        });
    },


    // POST /api/records
    create(req, res) {
        const { hodnota, cas, id_sensor } = req.body;

        // VALIDÁCIA
        if (hodnota === undefined || isNaN(hodnota)) {
            return res.status(400).json({ error: "Hodnota musí byť číslo." });
        }

        if (!cas) {
            return res.status(400).json({ error: "Čas záznamu je povinný." });
        }

        if (!id_sensor || isNaN(id_sensor)) {
            return res.status(400).json({ error: "Vyberte platný senzor." });
        }

        // overenie existencie senzora
        SensorModel.getAll((err, sensors) => {
            if (err) {
                return res.status(500).json({ error: "Chyba servera." });
            }

            const exists = sensors.some(s => s.id_sensor === Number(id_sensor));
            if (!exists) {
                return res.status(400).json({ error: "Senzor neexistuje." });
            }

            ZaznamModel.create(
                Number(hodnota),
                cas,
                id_sensor,
                (err2, id) => {
                    if (err2) {
                        return res.status(500).json({ error: "Chyba pri ukladaní záznamu." });
                    }
                    res.json({ message: "Záznam uložený", id });
                }
            );
        });
    },

    // DELETE /api/records/:id
    delete(req, res) {
        const id = req.params.id;

        ZaznamModel.delete(id, (err, changes) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri mazaní záznamu." });
            }
            if (changes === 0) {
                return res.status(404).json({ error: "Záznam neexistuje." });
            }
            res.json({ message: "Záznam zmazaný" });
        });
    }
};
