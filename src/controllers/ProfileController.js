import bcrypt from "bcrypt";
import { PouzivatelModel } from "../models/PouzivatelModel.js";

export const ProfileController = {

    updateEmail(req, res) {
        const id = req.session.user.id;
        const { email } = req.body;

        if (!email || !email.includes("@") || !email.includes(".")) {
            return res.status(400).json({ error: "Neplatný email." });
        }

        PouzivatelModel.getByEmail(email, (err, existing) => {
            if (existing && existing.id_pouzivatel !== id) {
                return res.status(400).json({ error: "Email už existuje." });
            }

            PouzivatelModel.getById(id, (err2, user) => {
                if (!user) {
                    return res.status(404).json({ error: "Používateľ nenájdený." });
                }

                PouzivatelModel.update(
                    id,
                    user.meno,
                    email,
                    user.rola,
                    err3 => {
                        if (err3) {
                            return res.status(500).json({ error: "Chyba servera." });
                        }

                        req.session.user.email = email;
                        res.json({ message: "Email zmenený." });
                    }
                );
            });
        });
    },


    async updatePassword(req, res) {
        const id = req.session.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
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

            PouzivatelModel.updatePassword(id, hashedPassword, err2 => {
                if (err2) return res.status(500).json({ error: "Chyba servera." });

                res.json({ message: "Heslo zmenené." });
            });
        });
    }
};
