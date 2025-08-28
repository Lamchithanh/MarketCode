-- Test user with 2FA enabled
INSERT INTO "User" (email, password, settings, createdAt, updatedAt)
VALUES (
        'test2fa@marketcode.com',
        '$2b$10$abc123',
        -- This would be hashed in real scenario
        '{"twoFactorEnabled": true, "twoFactorSecret": "JBSWY3DPEHPK3PXP"}',
        NOW(),
        NOW()
    );