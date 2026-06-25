export declare enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: unknown;
}
export declare class Logger {
    private formatEntry;
    private stringify;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
}
export declare const logger: Logger;
//# sourceMappingURL=index.d.ts.map