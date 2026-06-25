"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const wrap = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAll = wrap(async (_req, res) => {
        const users = await this.usersService.findAll();
        res.json({ success: true, data: users });
    });
    getById = wrap(async (req, res) => {
        const user = await this.usersService.findById(req.params.id);
        res.json({ success: true, data: user });
    });
    create = wrap(async (req, res) => {
        const user = await this.usersService.create(req.body);
        res.status(201).json({ success: true, data: user });
    });
    update = wrap(async (req, res) => {
        const user = await this.usersService.update(req.params.id, req.body);
        res.json({ success: true, data: user });
    });
    delete = wrap(async (req, res) => {
        await this.usersService.delete(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map