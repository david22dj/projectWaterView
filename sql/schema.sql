PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Pouzivatel (
                                          id_pouzivatel INTEGER PRIMARY KEY AUTOINCREMENT,
                                          meno VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    heslo VARCHAR(255) NOT NULL,
    rola VARCHAR(20) NOT NULL
    );

CREATE TABLE IF NOT EXISTS Miestnost (
                                         id_miestnost INTEGER PRIMARY KEY AUTOINCREMENT,
                                         nazov VARCHAR(50) NOT NULL,
    id_pouzivatel INTEGER NOT NULL,
    FOREIGN KEY (id_pouzivatel) REFERENCES Pouzivatel(id_pouzivatel)
    );

CREATE TABLE IF NOT EXISTS Miesto_merania (
                                              id_meranie INTEGER PRIMARY KEY AUTOINCREMENT,
                                              nazov VARCHAR(50) NOT NULL,
    id_miestnost INTEGER NOT NULL,
    FOREIGN KEY (id_miestnost) REFERENCES Miestnost(id_miestnost)
    );

CREATE TABLE IF NOT EXISTS Sensor (
                                      id_sensor INTEGER PRIMARY KEY AUTOINCREMENT,
                                      id_meranie INTEGER NOT NULL,
                                      typ VARCHAR(20) NOT NULL,
    jednotka VARCHAR(10) NOT NULL,
    popis VARCHAR(100),
    FOREIGN KEY (id_meranie) REFERENCES Miesto_merania(id_meranie)
    );

CREATE TABLE IF NOT EXISTS Zaznam (
                                      id_zaznam INTEGER PRIMARY KEY AUTOINCREMENT,
                                      hodnota FLOAT NOT NULL,
                                      cas DATETIME NOT NULL,
                                      id_sensor INTEGER NOT NULL,
                                      FOREIGN KEY (id_sensor) REFERENCES Sensor(id_sensor)
    );
