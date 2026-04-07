const SENSOR_KEY = "DavidHeslo";// Toto by mělo být uloženo v prostředí nebo v konfiguraci, ne přímo v kódu.

export function sensorAuth(req, res, next) {
    const key = req.header("x-sensor-key");
    if (!key || key !== SENSOR_KEY) {
        return res.status(401).json({ error: "Neplatný kľúč." });
    }
    next();
}