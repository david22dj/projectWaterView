import { SensorModel } from "../models/SensorModel.js";

export const SensorController = {

    getAll(req, res) {
        SensorModel.getAll((err, senzory) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(senzory);
        });
    },

    create(req, res) {
        const { id_meranie, typ, jednotka, popis } = req.body;

        SensorModel.create(id_meranie, typ, jednotka, popis, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Senzor vytvorený", id });
        });
    },

    delete(req, res) {
        const id = req.params.id;

        SensorModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Senzor nenájdený" });
            res.json({ message: "Senzor zmazaný" });
        });
    }
};
