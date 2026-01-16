import bcrypt from "bcrypt";
import { PouzivatelModel } from "../models/PouzivatelModel.js";

export const ProfileController = {

    async updateEmail(req, res) {
        const { id, email } = req.body;

        if (!id || !email) {
            return res.status(400).json({ error: "Chýbajú údaje." });
        }

        if (!email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ error: "Neplatný email." });
        }

        PouzivatelModel.getByEmail(email, (err, existing) => {
            if (existing) {
                return res.status(400).json({ error: "Email už existuje." });
            }

            PouzivatelModel.update(id, null, email, null, (err2) => {
                if (err2) {
                    return res.status(500).json({ error: "Chyba servera." });
                }

                res.json({ message: "Email zmenený." });
            });
        });
    },

    async updatePassword(req, res) {
        const { id, oldPassword, newPassword } = req.body;

        if (!id || !oldPassword || !newPassword) {
            return res.status(400).json({ error: "Vyplňte všetky polia." });
        }

        if (newPassword.length < 4) {
            return res.status(400).json({ error: "Heslo musí mať aspoň 4 znaky." });
        }

        PouzivatelModel.getById(id, async (err, user) => {
            if (!user) {
                return res.status(404).json({ error: "Používateľ nenájdený." });
            }

            const match = await bcrypt.compare(oldPassword, user.heslo);
            if (!match) {
                return res.status(401).json({ error: "Nesprávne aktuálne heslo." });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            PouzivatelModel.updatePassword(id, hashedPassword, (err2) => {
                if (err2) {
                    return res.status(500).json({ error: "Chyba pri ukladaní hesla." });
                }

                res.json({ message: "Heslo zmenené." });
            });
        });
    }
};
