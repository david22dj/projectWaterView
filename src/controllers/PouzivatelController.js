import { PouzivatelModel } from "../models/PouzivatelModel.js";
import bcrypt from "bcrypt";

export const PouzivatelController = {

    // GET /api/users
    getAll(req, res) {
        PouzivatelModel.getAll((err, users) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(users);
        });
    },

    // POST /api/users  (Create user WITH PASSWORD HASHING)
    async create(req, res) {
        const { meno, email, heslo, rola } = req.body;

        if (!meno || !email || !heslo || !rola) {
            return res.status(400).json({ error: "Všetky polia sú povinné." });
        }

        try {
            // HASH hesla
            const hashedPassword = await bcrypt.hash(heslo, 10);

            PouzivatelModel.create(meno, email, hashedPassword, rola, (err, id) => {

                if (err) {
                    // Zistenie duplicity emailu (UNIQUE constraint)
                    if (err.message.includes("UNIQUE constraint failed: Pouzivatel.email")) {
                        return res.status(400).json({
                            error: "Používateľ s týmto emailom už existuje."
                        });
                    }

                    return res.status(500).json({ error: "Chyba servera." });
                }

                res.json({ message: "Používateľ vytvorený", id });
            });


        } catch (err) {
            res.status(500).json({ error: "Chyba pri hashovaní hesla." });
        }
    },

    update(req, res) {
        const id = req.params.id;
        const { meno, email, rola } = req.body;

        if (!meno || !email || !rola) {
            return res.status(400).json({ error: "Vyplňte všetky údaje." });
        }

        PouzivatelModel.update(id, meno, email, rola, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Používateľ nenájdený" });

            res.json({ message: "Používateľ upravený" });
        });
    },


    // DELETE /api/users/:id
    delete(req, res) {
        const id = req.params.id;

        PouzivatelModel.delete(id, (err, changes) => {
            if (err) return res.status(500).json({ error: err.message });
            if (changes === 0) return res.status(404).json({ error: "Používateľ nenájdený" });
            res.json({ message: "Používateľ zmazaný" });
        });
    },

    // POST /api/users/login  (LOGIN WITH HASH CHECK)
    async login(req, res) {
        const { email, heslo } = req.body;

        if (!email || !heslo) {
            return res.status(400).json({ error: "Zadajte email aj heslo." });
        }

        PouzivatelModel.getByEmail(email, async (err, user) => {
            if (err) return res.status(500).json({ error: "Chyba servera." });

            // používateľ nenájdený
            if (!user) {
                return res.status(401).json({ error: "Nesprávny email alebo heslo." });
            }

            // porovnanie hash hesla
            const match = await bcrypt.compare(heslo, user.heslo);

            if (!match) {
                return res.status(401).json({ error: "Nesprávny email alebo heslo." });
            }

            // heslo neposielame späť
            delete user.heslo;

            res.json(user);
        });
    }
};
