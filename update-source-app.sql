-- Update existing CRM records to use the new source app names
-- Run this in your Supabase SQL editor or database

-- Update booking records
UPDATE your_crm_table_name 
SET source_app = 'chauffeur_booking' 
WHERE source_app = 'table_booking';

-- Update new customer records (if applicable)
UPDATE your_crm_table_name 
SET source_app = 'chauffeur_new_customer' 
WHERE source_app = 'table_new_customer';

-- Verify the changes
SELECT source_app, COUNT(*) as count 
FROM your_crm_table_name 
GROUP BY source_app; 