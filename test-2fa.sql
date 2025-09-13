-- Test query để kiểm tra 2FA setup
SELECT u.id,
    u.name,
    u.email,
    u."twoFactorEnabled",
    CASE
        WHEN u."twoFactorSecret" IS NOT NULL THEN 'Has Secret'
        ELSE 'No Secret'
    END as secret_status,
    u."lastTwoFactorAt",
    u."lastLoginAt",
    u.settings->>'twoFactorEnabled' as settings_2fa
FROM "User" u
WHERE u."twoFactorEnabled" = true
ORDER BY u."lastLoginAt" DESC;
-- Kiểm tra SecurityLog gần nhất
SELECT sl.action,
    sl.details,
    sl."createdAt",
    u.email
FROM "SecurityLog" sl
    LEFT JOIN "User" u ON sl."userId" = u.id
ORDER BY sl."createdAt" DESC
LIMIT 10;