const { isValidPassword } = require('./validator');

describe('isValidPassword', () => {
    // Test 1
    test('should return valid: true for a strong password', () => {
        const result = isValidPassword('MyPassword1');
        expect(result.valid).toBe(true);
        expect(result.reason).toBe('');
    });

    // Test 2
    test('should fail for password shorter than 8 characters', () => {
        const result = isValidPassword('Pass12');
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Too short (min 8 characters)');
    });

    // Test 3
    test('should fail if no uppercase letter', () => {
        const result = isValidPassword('mypassword1');
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Must contain an uppercase letter');
    });

    // Test 4
    test('should fail if no number', () => {
        const result = isValidPassword('MyPassword');
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Must contain a number');
    });

    // Test 5
    test('should fail if password is not a string', () => {
        const result = isValidPassword(12345678);
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Password must be a string');
    });

    // Bonus
    test('should accept exactly 8 characters with uppercase and number', () => {
        const result = isValidPassword('Abcdef12');
        expect(result.valid).toBe(true);
        expect(result.reason).toBe('');
    });

    // Bonus
    test('should fail with empty string', () => {
        const result = isValidPassword('');
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Too short (min 8 characters)');
    });

    // Bonus
    test('should accept a very long valid password', () => {
        const result = isValidPassword('VeryLongPassword123WithManyCharacters');
        expect(result.valid).toBe(true);
        expect(result.reason).toBe('');
    });
});
