const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
    //Onde os arquivos de imagem serão guardados
    dest : path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    
    //
    storage: multer.diskStorage({
        //É praticamente a mesma coisa q a variavel em cima (dest), se não tiver nada definido no destination ele usa o dest
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        //Serve para Garantir que imagens com o mesmo nome, uma não sobreponha a outra
        //hash : caracteres aleatórios
        filename: (req, file, cb) => {
            //16 : tamanho de bits(pode se usar menos)
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                //hash serve para converter os 16 bits em caracteres hexadecimal(letras e números) e logo em seguida aparece o nome original da imagem
                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            });
        },
    }),

    //Determinar alguns Limites do Arquivo(No caso 2MB (2 * 1024Kb * 1024Mb)
    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    //Filtrar o Upload de Arquivos(No caso, só aceitar formatos jpeg, pjpeg, png e gif)
    fileFilter: (req, file, cb) => {
        const allowedMines = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        //Caso mimetype for = a um dos de cima(sucesso)
        if (allowedMines.includes(file.mimetype)) {
            cb(null, true);
        //Caso mimetype não for = a um dos de cima(erro)
        } else {
            cb(new Error("Invalid file type."));
        }
    },
};