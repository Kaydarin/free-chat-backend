import * as jose from 'jose';

const JwtMiddleware = (request, response, next) => {

    if (request.path !== '/api/login') {
        response.atomic(async () => {
            if (request.cookies.token) {

                const token = request.cookies.token;

                const publicKeyString = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
                const publicKey = await jose.importSPKI(publicKeyString, 'RS256')

                const { payload } = await jose.jwtVerify(token, publicKey);

                if (payload.id == 1 || payload.id == 2) {
                    return next();
                } else {
                    response.status(403)
                        .clearCookie('token')
                        .type('text/plain')
                        .send('Forbidden')
                }

            } else {
                response
                    .status(403)
                    .type('text/plain')
                    .send('Forbidden')
            }
        })
    } else {
        return next();
    }
};

export default JwtMiddleware;