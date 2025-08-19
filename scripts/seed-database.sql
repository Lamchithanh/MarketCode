-- Script để tạo dữ liệu mẫu cho MarketCode
-- Chạy script này trong Supabase SQL Editor
-- Tạo categories trước
INSERT INTO "Category" (
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        1,
        'E-commerce',
        'Ứng dụng thương mại điện tử',
        true,
        NOW(),
        NOW()
    ),
    (
        2,
        'Social Media',
        'Ứng dụng mạng xã hội',
        true,
        NOW(),
        NOW()
    ),
    (
        3,
        'Education',
        'Ứng dụng giáo dục',
        true,
        NOW(),
        NOW()
    ),
    (
        4,
        'Productivity',
        'Ứng dụng năng suất',
        true,
        NOW(),
        NOW()
    ),
    (
        5,
        'CMS',
        'Hệ thống quản lý nội dung',
        true,
        NOW(),
        NOW()
    ),
    (
        6,
        'Real Estate',
        'Ứng dụng bất động sản',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO
UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();
-- Tạo products
INSERT INTO "Product" (
        id,
        title,
        description,
        price,
        category_id,
        technologies,
        rating,
        download_count,
        thumbnail,
        is_active,
        created_at,
        updated_at
    )
VALUES (
        1,
        'E-commerce Website Complete',
        'Website bán hàng hoàn chỉnh với React, NextJS, Prisma, Stripe payment integration',
        499000,
        1,
        '["React", "NextJS", "Prisma", "Stripe", "Tailwind"]'::jsonb,
        4.8,
        156,
        '/products/ecommerce.jpg',
        true,
        NOW(),
        NOW()
    ),
    (
        2,
        'Social Media App',
        'Ứng dụng mạng xã hội với real-time chat, posts, comments, likes và user profiles',
        799000,
        2,
        '["React", "NextJS", "Socket.io", "MongoDB", "Cloudinary"]'::jsonb,
        4.9,
        89,
        '/products/social.jpg',
        true,
        NOW(),
        NOW()
    ),
    (
        3,
        'Learning Management System',
        'Hệ thống quản lý học tập với video streaming, assignments, grading và certificates',
        1299000,
        3,
        '["React", "NextJS", "Prisma", "AWS S3", "Stripe"]'::jsonb,
        4.7,
        67,
        '/products/lms.jpg',
        true,
        NOW(),
        NOW()
    ),
    (
        4,
        'Task Management App',
        'Ứng dụng quản lý công việc kiểu Trello với drag & drop, team collaboration',
        599000,
        4,
        '["React", "NextJS", "DnD Kit", "Prisma", "WebSocket"]'::jsonb,
        4.6,
        124,
        '/products/task.jpg',
        true,
        NOW(),
        NOW()
    ),
    (
        5,
        'Blog CMS Platform',
        'Hệ thống quản lý blog với rich text editor, SEO optimization, multi-author',
        399000,
        5,
        '["React", "NextJS", "MDX", "Prisma", "Vercel"]'::jsonb,
        4.5,
        203,
        '/products/blog.jpg',
        true,
        NOW(),
        NOW()
    ),
    (
        6,
        'Real Estate Platform',
        'Nền tảng bất động sản với tìm kiếm, bộ lọc, map integration, virtual tours',
        999000,
        6,
        '["React", "NextJS", "Google Maps", "Prisma", "Cloudinary"]'::jsonb,
        4.8,
        45,
        '/products/realestate.jpg',
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO
UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category_id = EXCLUDED.category_id,
    technologies = EXCLUDED.technologies,
    rating = EXCLUDED.rating,
    download_count = EXCLUDED.download_count,
    thumbnail = EXCLUDED.thumbnail,
    updated_at = NOW();
-- Kiểm tra dữ liệu đã insert
SELECT p.id,
    p.title,
    p.price,
    c.name as category_name,
    p.technologies,
    p.rating,
    p.download_count
FROM "Product" p
    JOIN "Category" c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC;