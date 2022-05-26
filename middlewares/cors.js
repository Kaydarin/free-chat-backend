const CorsMiddleware = async (request, response) => {

    const allowedOrigins = ['http://localhost:3000', process.env.FRONTEND_URL];
    const origin = request.headers.origin;

    if (allowedOrigins.includes(origin)) {
        response.header("Access-Control-Allow-Origin", origin);
    }

    response.header("Access-Control-Allow-Credentials", "true");
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.header("Access-Control-Allow-Headers", "Accept, Accept-Encoding, Referer, Origin, Content-Type, X-Requested-With, Set-Cookie");
}

export default CorsMiddleware;