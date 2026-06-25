export interface ProcessPaymentDto {
    orderId: string;
    amount: number;
    paymentMethodId: string;
    reference?: string;
    userId?: string;
    nit?: string;
    name?: string;
    email?: string;
}
export interface PaymentResponseDto {
    id: string;
    amount: number;
    paymentMethodId: string;
    paymentMethod?: {
        id: string;
        name: string;
    };
    reference: string | null;
    orderId: string;
    userId: string;
    user?: {
        id: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=payments.dto.d.ts.map