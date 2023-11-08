// Unit test - jest (package)

const authGuard = require("../../middlewares/authGuard");
const { validateToken } = require("../../utils/jwt");
jest.mock("../../utils/jwt");

describe('authentication guard middleware', () => {
    it('should return 401 if authorization header is not defined', () => {
        // setup
        const req = {
            header: jest.fn(),
        };
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };
        res.status.mockReturnValue(res);
        const next = jest.fn();

        // execute
        authGuard(req, res, next);

        // compare
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Missing authorization header'
        });
    });

    it('should return 401 if type is not Bearer', () => {

    });

    it('should return 401 if token is not defined', () => {

    });

    it('should return 401 if payload is not defined', () => {

    });

    it('should call next function when token is valid', () => {
        // setup
        const token = 'any_token';
        const req = {
            header: jest.fn(),
        };
        req.header.mockReturnValue(`Bearer ${token}`);
        const res = {
            status: jest.fn(),
            json: jest.fn()
        };
        res.status.mockReturnValue(res);
        const next = jest.fn();
        validateToken.mockImplementation(token => {
            return {
                id: 'fake_id',
            }
        })

        // execute
        authGuard(req, res, next);

        // compare
        expect(next).toHaveBeenCalled();
        expect(validateToken).toHaveBeenCalledWith(token);
    })
})