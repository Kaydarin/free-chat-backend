import * as jose from 'jose';

const JwtMiddleware = (request, response, next) => {


    if (request.path !== '/api/login' && request.path !== '/ws/connect') {
        response.atomic(async () => {
            if (request.cookies.token || request.query_parameters.token) {

                let token;
                if (request.cookies.token) {
                    token = request.cookies.token;
                }

                if (request.query_parameters.token) {
                    token = request.query_parameters.token;
                }

                try {
                    const publicKeyString = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
                    const publicKey = await jose.importSPKI(publicKeyString, 'RS256')

                    const { payload } = await jose.jwtVerify(token, publicKey);

                    if (payload.id == 1 || payload.id == 2) {

                        request.uid = payload.id;

                        return next();
                    } else {
                        response.status(403)
                            .clearCookie('token')
                            .json({
                                message: 'Forbidden'
                            });
                    }

                } catch (e) {

                    if (e.code == 'ERR_JWT_EXPIRED') {
                        response.status(403)
                            .clearCookie('token')
                            .json({
                                message: 'Expired Session'
                            });
                    } else {
                        response.status(500)
                            .clearCookie('token')
                            .json({
                                message: 'Internal Server Error'
                            });
                    }
                }

            } else {
                response.status(403)
                    .clearCookie('token')
                    .json({
                        message: 'Forbidden'
                    });
            }
        })
    } else {
        return next();
    }
};

export default JwtMiddleware;