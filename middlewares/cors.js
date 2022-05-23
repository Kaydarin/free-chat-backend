const CorsMiddleware = async (request, response) => {

    const allowedOrigins = ['http://localhost:3000'];
    const origin = request.headers.origin;

    if (allowedOrigins.includes(origin)) {
        response.header("Access-Control-Allow-Origin", origin);
    }

    response.header("Access-Control-Allow-Credentials", "true");
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.header("Access-Control-Allow-Headers", "Accept, Accept-Encoding, Referer, Origin, Content-Type, X-Requested-With");
}

export default CorsMiddleware;