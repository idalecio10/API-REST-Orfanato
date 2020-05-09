//Importar Token
const jwt = require('jsonwebtoken');


exports.obrigatorio = (req, res, next) => {

    try {
        //Buscar Header de autorização dentro da requisição
        // authHeader recebe o token usado e preciso para fazer a operação
        const authHeader = req.headers.authorization;

        //Se não tiver um authHeader(Token) dá erro
        if (!authHeader) {
            return res.status(401).send({ mensagem: 'No Token Provider' });
        }

        //Exemplo formato certo : Bearer dh4565ey54v6576475n4b5f34n45454(são duas partes, o Bearer e o Hash)
        //Verificar se o token esta no formato certo :

        //Separar as duas partes com o slit
        const parts = authHeader.split(' ');

        //Verificar se realmente tem as duas partes
        if (!parts.length === 2) {
            return res.status(401).send({ mensagem: 'Token Error' });
        }

        //Se tiver as duas partes, vai desestruturar. scheme : Bearer, token : token
        const [ scheme, token ] = parts;

        //Verificar se no scheme esta escrito Bearer
        
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send({ mensagem: 'Token malformatted' });
        }

        

        const decode = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({ mensagem: 'Token Invalid' });
            }
            req.usuario = decoded;
            return next();
        });
    
        
    } catch (error) {
        return res.status(401).send({ mensagem: 'Token Invalid' });
    } 
}



exports.opcional = (req, res, next) => {

    try {
        //Buscar Header de autorização dentro da requisição
        // authHeader recebe o token usado e preciso para fazer a operação
        const authHeader = req.headers.authorization;

        //Se não tiver um authHeader(Token) dá erro
        if (!authHeader) {
            return res.status(401).send({ mensagem: 'No Token Provider' });
        }

        //Exemplo formato certo : Bearer dh4565ey54v6576475n4b5f34n45454(são duas partes, o Bearer e o Hash)
        //Verificar se o token esta no formato certo :

        //Separar as duas partes com o slit
        const parts = authHeader.split(' ');

        //Verificar se realmente tem as duas partes
        if (!parts.length === 2) {
            return res.status(401).send({ mensagem: 'Token Error' });
        }

        //Se tiver as duas partes, vai desestruturar. scheme : Bearer, token : token
        const [ scheme, token ] = parts;

        //Verificar se no scheme esta escrito Bearer
        
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send({ mensagem: 'Token malformatted' });
        }

        

        const decode = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).send({ mensagem: 'Token Invalid' });
            }
            req.usuario = decoded;
            return next();
        });
    
        
    } catch (error) {
        return res.status(401).send({ mensagem: 'Token Invalid' });
    } 
}