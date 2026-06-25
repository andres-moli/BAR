export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponseDto {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
//# sourceMappingURL=auth.dto.d.ts.map