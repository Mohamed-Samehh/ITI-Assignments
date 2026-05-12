const { fetchWithRetry } = require('../src/fetchWithRetry');
const apiClient = require('../src/apiClient');

jest.mock('../src/apiClient', () => ({
    getData: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('first attempt succeeds', async () => {
    apiClient.getData.mockResolvedValue({ id: 1 });

    const data = await fetchWithRetry('https://example.com');

    expect(data).toEqual({ id: 1 });
    expect(apiClient.getData).toHaveBeenCalledTimes(1);
});

test('first attempt fails, second succeeds', async () => {
    apiClient.getData
        .mockRejectedValueOnce(new Error('timeout'))
        .mockResolvedValueOnce({ id: 2 });

    const data = await fetchWithRetry('https://example.com');

    expect(data).toEqual({ id: 2 });
    expect(apiClient.getData).toHaveBeenCalledTimes(2);
});

test('all 3 attempts fail', async () => {
    apiClient.getData.mockRejectedValue(new Error('timeout'));

    await expect(fetchWithRetry('https://example.com')).rejects.toThrow(
        'Failed after 3 attempts: timeout'
    );
    expect(apiClient.getData).toHaveBeenCalledTimes(3);
});

test('maxRetries = 1 throws after one call', async () => {
    apiClient.getData.mockRejectedValue(new Error('timeout'));

    await expect(fetchWithRetry('https://example.com', 1)).rejects.toThrow(
        'Failed after 1 attempts: timeout'
    );
    expect(apiClient.getData).toHaveBeenCalledTimes(1);
});