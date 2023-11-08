const { validateToken } = require("../utils/jwt");

module.exports = (role) => (req, res, next) => {
    const authorization = req.header('Authorization');
    if (!authorization) {
        res.status(401).json({ error: 'Missing authorization header' });
        return;
    }
    // Bearer xxxxx
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    const payload = validateToken(token);
    if (!payload) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    if (payload.role !== role) {
        res.status(403).json({ error: 'Invalid permission' });
        return;
    }
    next();
}