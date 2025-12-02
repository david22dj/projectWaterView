import { ZaznamModel } from "../models/ZaznamModel.js";

export const ZaznamController = {

    getAll(req, res) {
        ZaznamModel.getAll((err, zaznamy) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(zaznamy);
        });
    },

    create(req, res) {
        const { hodnota, cas, id_sensor } = req.body;

        ZaznamModel.create(hodnota, cas, id_sensor, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Záznam vytvorený", id });
        });
    },

    delete(req, res) {
        const id = req.params.id;

        ZaznamModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Záznam nenájdený" });
            res.json({ message: "Záznam zmazaný" });
        });
    }
};
