import HyperExpress from 'hyper-express';
import * as jose from 'jose';
// import fs from 'fs'

const Router = new HyperExpress.Router();

Router.get('/test', (request, response) => {
    response.send('This is test');
});

Router.post('/login', async (request, response) => {

    // const secret = await jose.generateKeyPair('RS256')
    // const pkcs8Pem = await jose.exportPKCS8(secret.privateKey)
    // const spkiPem = await jose.exportSPKI(secret.publicKey)
    // console.log(pkcs8Pem)
    // console.log(spkiPem)

    // const publicKeyString = fs.readFileSync("public.cer", { encoding: "utf8" });
    // const ecPublicKey = await jose.importSPKI(publicKeyString, 'RS256');

    // const privateKeyString = fs.readFileSync("private.pem", { encoding: "utf8" });
    // const privateKey = await jose.importPKCS8(privateKeyString, 'RS256')

    const reqBody = await request.json();

    const signUser = async (id) => {
        const privateKeyString = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n')
        const privateKey = await jose.importPKCS8(privateKeyString, 'RS256')

        const jwt = await new jose.SignJWT({ id })
            .setProtectedHeader({ alg: 'RS256' })
            .setIssuedAt()
            .setIssuer('app:freechat')
            .setAudience(`for:user${id}`)
            .setExpirationTime('8h')
            .sign(privateKey)

        return jwt;
    }

    let signature;
    const hours = 2.88e+7; // 8h in milliseconds
    const expiry = new Date().getTime() + hours;

    if (reqBody.username == 'user1' && reqBody.password == 'user1') {

        signature = await signUser(1);
        response.cookie('token', signature, expiry, {
            httpOnly: true
        });
        response.status(200);
        response.send(signature);
    } else if (reqBody.username == 'user2' && reqBody.password == 'user2') {

        signature = await signUser(2);
        response.cookie('token', signature, expiry, {
            httpOnly: true
        });
        response.status(200);
        response.send(signature);
    } else {

        response.status(401);
        response.send('User is not exist');
    }
});

export default Router