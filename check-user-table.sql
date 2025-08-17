-- Check User table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'User' 
ORDER BY ordinal_position;

-- Check if deletedAt column exists
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'User' AND column_name = 'deletedAt'
) as has_deleted_at;

-- Add deletedAt column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'deletedAt'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "deletedAt" TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added deletedAt column to User table';
    ELSE
        RAISE NOTICE 'deletedAt column already exists';
    END IF;
END $$;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'User';

-- Create RLS policy for service role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'User' AND policyname = 'service_role_all_access'
    ) THEN
        CREATE POLICY "service_role_all_access" ON "User"
        FOR ALL USING (true)
        WITH CHECK (true);
        RAISE NOTICE 'Created service_role_all_access policy';
    ELSE
        RAISE NOTICE 'service_role_all_access policy already exists';
    END IF;
END $$;
