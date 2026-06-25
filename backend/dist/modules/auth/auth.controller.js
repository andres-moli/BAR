"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const wrap = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login = wrap(async (req, res) => {
        const result = await this.authService.login(req.body);
        res.json({ success: true, data: result });
    });
    getProfile = wrap(async (req, res) => {
        const user = await this.authService.getProfile(req.user.id);
        res.json({ success: true, data: user });
    });
    updateProfile = wrap(async (req, res) => {
        const user = await this.authService.updateProfile(req.user.id, req.body);
        res.json({ success: true, data: user });
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map