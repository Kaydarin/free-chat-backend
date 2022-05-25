import HyperExpress from 'hyper-express';
import * as jose from 'jose';
// import fs from 'fs'

const Router = new HyperExpress.Router();

Router.post('/test', (request, response) => {
    response.type('text/plain');
    response.send('This is test');
});

Router.post('/connect', (request, response) => {

    const id = request.uid;

    response.atomic(async () => {

        const privateKeyString = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n')
        const privateKey = await jose.importPKCS8(privateKeyString, 'RS256')

        const jwt = await new jose.SignJWT({ id })
            .setProtectedHeader({ alg: 'RS256' })
            .setIssuedAt()
            .setIssuer('app:freechat')
            .setAudience(`for:user${id}`)
            .setExpirationTime('8h') // 30 minutes
            .sign(privateKey)

        const resObj = {
            socketToken: jwt
        }

        response
            .status(200)
            .json(resObj)
    })
});

Router.post('/login', async (request, response) => {

    /**
     * To generate jwt key pairs:-
     */
    // const secret = await jose.generateKeyPair('RS256')
    // const pkcs8Pem = await jose.exportPKCS8(secret.privateKey)
    // const spkiPem = await jose.exportSPKI(secret.publicKey)
    // console.log(pkcs8Pem)
    // console.log(spkiPem)

    /**
     * Read jwt key pairs from file:-
     */
    // const publicKeyString = fs.readFileSync("public.cer", { encoding: "utf8" });
    // const publicKey = await jose.importSPKI(publicKeyString, 'RS256');

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
    let resObj;
    const hours = 2.88e+7; // 8h in milliseconds
    const expiry = new Date().getTime() + hours;

    response.atomic(async () => {

        if (reqBody.username == 'user1' && reqBody.password == 'user1') {

            signature = await signUser(1);

            resObj = {
                username: reqBody.username
            }

            response
                .cookie('token', signature, expiry, {
                    // domain: 'http://localhost',
                    // path: '/',
                    // maxAge: 28800, // 8h
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .status(200)
                .json(resObj)

        } else if (reqBody.username == 'user2' && reqBody.password == 'user2') {

            signature = await signUser(2);

            resObj = {
                username: reqBody.username
            }

            response
                .cookie('token', signature, expiry, {
                    // domain: 'http://localhost',
                    // path: '/',
                    // maxAge: 28800, // 8h
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                .status(200)
                .json(resObj)

        } else {
            resObj = {
                message: 'User is not exist'
            }

            response.status(401)
                .json(resObj);
        }
    })
});

export default Router