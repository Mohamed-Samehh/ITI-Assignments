const { placeOrder } = require('../src/orderService');
const paymentService = require('../src/paymentService');
const emailService = require('../src/emailService');

jest.mock('../src/paymentService', () => ({
    charge: jest.fn(),
}));

jest.mock('../src/emailService', () => ({
    sendOrderConfirmation: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('returns orderId and transactionId for a valid order', async () => {
    paymentService.charge.mockResolvedValue({ success: true, transactionId: 'txn_123' });
    emailService.sendOrderConfirmation.mockResolvedValue({ sent: true });

    const result = await placeOrder('user1', 'a@b.com', 50);

    expect(result.transactionId).toBe('txn_123');
    expect(result.orderId).toMatch(/^order_/);
});

test('sends the confirmation email with the right values', async () => {
    paymentService.charge.mockResolvedValue({ success: true, transactionId: 'txn_123' });
    emailService.sendOrderConfirmation.mockResolvedValue({ sent: true });

    await placeOrder('user1', 'a@b.com', 50);

    expect(emailService.sendOrderConfirmation).toHaveBeenCalledWith('a@b.com', 'txn_123');
});

test('throws for amount 0 and never calls charge', async () => {
    await expect(placeOrder('user1', 'a@b.com', 0)).rejects.toThrow('Invalid amount');
    expect(paymentService.charge).not.toHaveBeenCalled();
});

test('throws when payment fails and never sends email', async () => {
    paymentService.charge.mockResolvedValue({ success: false });

    await expect(placeOrder('user1', 'a@b.com', 50)).rejects.toThrow('Payment failed');
    expect(emailService.sendOrderConfirmation).not.toHaveBeenCalled();
});