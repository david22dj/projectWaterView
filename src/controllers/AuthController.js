export const AuthController = {
    me(req, res) {
        if (!req.session.user) {
            return res.status(401).json({ error: "Neautorizovaný prístup" });
        }
        res.json(req.session.user);
    },

    logout(req, res) {
        if (!req.session) {
            return res.json({ message: "Odhlásený" });
        }

        req.session.destroy((err) => {
            if (err) return res.status(500).json({ error: "Chyba pri odhlasovaní." });

            res.clearCookie("connect.sid");
            res.json({ message: "Odhlásený" });
        });
    }
};
