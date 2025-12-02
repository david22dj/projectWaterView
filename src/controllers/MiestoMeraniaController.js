import { MiestoMeraniaModel } from "../models/MiestoMeraniaModel.js";

export const MiestoMeraniaController = {

    getAll(req, res) {
        MiestoMeraniaModel.getAll((err, data) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(data);
        });
    },

    create(req, res) {
        const { nazov, id_miestnost } = req.body;

        MiestoMeraniaModel.create(nazov, id_miestnost, (err, id) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Miesto merania vytvorené", id });
        });
    },

    delete(req, res) {
        const id = req.params.id;

        MiestoMeraniaModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Miesto merania nenájdené" });
            res.json({ message: "Miesto merania zmazané" });
        });
    }
};
