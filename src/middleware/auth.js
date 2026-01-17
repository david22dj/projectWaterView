export function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Neautorizovaný prístup"
        });
    }

    next();
}

export function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Neautorizovaný prístup"
        });
    }

    if (req.session.user.rola !== "admin") {
        return res.status(403).json({
            error: "Nedostatočné oprávnenia"
        });
    }

    next();
}
