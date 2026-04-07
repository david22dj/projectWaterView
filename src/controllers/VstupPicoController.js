/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/

import { ZaznamModel } from "../models/ZaznamModel.js";
import { SensorModel } from "../models/SensorModel.js";

export const VstupPicoController = {

    // POST /api/ingest
    create(req, res) {
        const { hodnota, id_sensor, cas_offset } = req.body;

        if (hodnota === undefined || isNaN(hodnota)) {
            return res.status(400).json({ error: "Hodnota musí byť číslo." });
        }

        if (!id_sensor || isNaN(id_sensor)) {
            return res.status(400).json({ error: "Neplatný senzor." });
        }

        const offset = (cas_offset === undefined || cas_offset === null) ? 0 : Number(cas_offset);

        if (isNaN(offset) || offset < 0) {
            return res.status(400).json({ error: "cas_offset musí byť nezáporné číslo (sekundy)." });
        }

        if (offset > 86400) {
            return res.status(400).json({ error: "cas_offset je príliš veľký (max 86400 sekúnd)." });
        }

        const cas = new Date(Date.now() - offset * 1000).toISOString();

        const zapisDoDb = {
            hodnota: Number(hodnota),
            cas,
            id_sensor: Number(id_sensor)
        };

        SensorModel.getById(Number(id_sensor), (err, row) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });
            if (!row) return res.status(400).json({ error: "Senzor neexistuje." });

            console.log("[PICO] Ukladám do DB:", zapisDoDb);

            ZaznamModel.create(Number(hodnota), cas, Number(id_sensor), (err2, id) => {
                if (err2) return res.status(500).json({ error: "Chyba pri ukladaní záznamu." });

                console.log("[PICO] Uložené OK, id_zaznam:", id);

                res.json({ message: "OK", id, cas });

            });
        });
    }
};