"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    formatEntry(level, message, data) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };
    }
    stringify(entry) {
        return JSON.stringify(entry, (key, value) => {
            if (value instanceof Error) {
                return { message: value.message, stack: value.stack, name: value.name };
            }
            return value;
        });
    }
    info(message, data) {
        const entry = this.formatEntry(LogLevel.INFO, message, data);
        console.log(this.stringify(entry));
    }
    warn(message, data) {
        const entry = this.formatEntry(LogLevel.WARN, message, data);
        console.warn(this.stringify(entry));
    }
    error(message, data) {
        const entry = this.formatEntry(LogLevel.ERROR, message, data);
        console.error(this.stringify(entry));
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=index.js.map