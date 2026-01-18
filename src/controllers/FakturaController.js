import fs from "fs";
import path from "path";
import { FakturaModel } from "../models/FakturaModel.js";

export const FakturaController = {

    upload(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: "Súbor nebol nahraný." });
        }

        FakturaModel.create({
            nazov_suboru: req.file.filename,
            povodny_nazov: req.file.originalname,
            typ_suboru: req.file.mimetype,
            velkost: req.file.size
        }, (err, id) => {
            if (err) {
                return res.status(500).json({ error: "Chyba pri ukladaní faktúry." });
            }

            res.json({ message: "Faktúra nahraná", id });
        });
    },

    list(req, res) {
        FakturaModel.getAll((err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Chyba servera." });
            }
            res.json(rows);
        });
    },

    download(req, res) {
        const id = req.params.id;

        FakturaModel.getById(id, (err, faktura) => {
            if (!faktura) {
                return res.status(404).json({ error: "Faktúra nenájdená." });
            }

            const filePath = path.join(
                process.cwd(),
                "uploads/faktury",
                faktura.nazov_suboru
            );

            res.download(filePath, faktura.povodny_nazov);
        });
    },

    update(req, res) {
        const id = req.params.id;
        const { nazov } = req.body;

        if (!nazov) {
            return res.status(400).json({ error: "Názov je povinný." });
        }

        FakturaModel.updateMetadata(id, nazov, (err, changes) => {
            if (changes === 0) {
                return res.status(404).json({ error: "Faktúra nenájdená." });
            }
            res.json({ message: "Faktúra upravená." });
        });
    },

    delete(req, res) {
        const id = req.params.id;

        FakturaModel.getById(id, (err, faktura) => {
            if (!faktura) {
                return res.status(404).json({ error: "Faktúra nenájdená." });
            }

            const filePath = path.join(
                process.cwd(),
                "uploads/faktury",
                faktura.nazov_suboru
            );

            fs.unlinkSync(filePath);

            FakturaModel.delete(id, () => {
                res.json({ message: "Faktúra zmazaná." });
            });
        });
    }
};
