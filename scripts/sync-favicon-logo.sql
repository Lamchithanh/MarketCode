-- Script để đồng bộ favicon_url với logo_url
-- Cập nhật favicon_url để luôn trùng với logo_url
UPDATE "SystemSetting"
SET value = (
        SELECT value
        FROM "SystemSetting"
        WHERE key = 'logo_url'
    ),
    updated_at = NOW()
WHERE key = 'favicon_url';
-- Kiểm tra kết quả
SELECT key,
    value
FROM "SystemSetting"
WHERE key IN ('logo_url', 'favicon_url')
ORDER BY key;