"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTableRoutes = registerTableRoutes;
const data_source_1 = require("../../database/data-source");
const tables_entity_1 = require("./tables.entity");
const tables_service_1 = require("./tables.service");
const tables_controller_1 = require("./tables.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const tables_validator_1 = require("./tables.validator");
function registerTableRoutes(router) {
    const tableRepo = data_source_1.AppDataSource.getRepository(tables_entity_1.TableEntity);
    const tablesService = new tables_service_1.TablesService(tableRepo);
    const tablesController = new tables_controller_1.TablesController(tablesService);
    router.get('/', middleware_1.authenticate, tablesController.getAll);
    router.get('/:id', middleware_1.authenticate, tablesController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(tables_validator_1.createTableSchema), tablesController.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(tables_validator_1.updateTableSchema), tablesController.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), tablesController.delete);
    router.patch('/:id/status', middleware_1.authenticate, (0, middleware_2.validate)(tables_validator_1.tableStatusSchema), tablesController.updateStatus);
}
//# sourceMappingURL=tables.routes.js.map