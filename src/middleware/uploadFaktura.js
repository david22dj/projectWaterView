/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "./uploads/faktury";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
        cb(null, unique);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png"
    ];

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Nepovolený typ súboru."));
    }

    cb(null, true);
};

export const uploadFaktura = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
