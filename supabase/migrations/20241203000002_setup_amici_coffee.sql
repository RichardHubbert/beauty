-- Set up Woodman & Olive with proper business and restaurant IDs
-- This ensures the application is properly associated with Woodman & Olive

-- First, ensure the Woodman & Olive business exists
INSERT INTO businesses (id, name, slug, domain, contact_email, address) 
VALUES (
  '24e2799f-60d5-4e3b-bb30-b8049c9ae56d',
  'Woodman & Olive',
  'woodmanandolive',
  'woodmanandolive.tablepilot.co.uk',
  'info@woodmanandolive.com',
  '123 Fine Dining Street, London, UK'
) ON CONFLICT (id) DO UPDATE SET
  name = 'Woodman & Olive',
  slug = 'woodmanandolive',
  domain = 'woodmanandolive.tablepilot.co.uk',
  contact_email = 'info@woodmanandolive.com',
  address = '123 Fine Dining Street, London, UK',
  updated_at = NOW();

-- Update or insert Woodman & Olive restaurant with the correct business_id
INSERT INTO restaurants (id, name, address, cuisine, rating, image_url, phone, email, description, business_id) 
VALUES (
  '24e2799f-60d5-4e3b-bb30-b8049c9ae56d',
  'Woodman & Olive',
  '123 Fine Dining Street, London, UK',
  'Modern European',
  4.8,
  '/lovable-uploads/d1a98a63-2cc5-4972-9f0d-87d62451a02b.png',
  '+44 20 7946 0958',
  'info@woodmanandolive.com',
  'Experience modern European dining with a contemporary twist. Reserve your table for an unforgettable culinary journey.',
  '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
) ON CONFLICT (id) DO UPDATE SET
  name = 'Woodman & Olive',
  address = '123 Fine Dining Street, London, UK',
  cuisine = 'Modern European',
  rating = 4.8,
  image_url = '/lovable-uploads/d1a98a63-2cc5-4972-9f0d-87d62451a02b.png',
  phone = '+44 20 7946 0958',
  email = 'info@woodmanandolive.com',
  description = 'Experience modern European dining with a contemporary twist. Reserve your table for an unforgettable culinary journey.',
  business_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d',
  updated_at = NOW();

-- Update any existing Woodman & Olive restaurant records to have the correct business_id
UPDATE restaurants 
SET business_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
WHERE name = 'Woodman & Olive' AND business_id IS NULL;

-- Ensure all bookings for Woodman & Olive have the correct business_id
UPDATE bookings 
SET business_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
WHERE restaurant_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' 
AND business_id IS NULL;

-- Ensure all profiles (users) are associated with Woodman & Olive business
UPDATE profiles 
SET business_id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'
WHERE business_id IS NULL;

-- Create a function to get Woodman & Olive business ID
CREATE OR REPLACE FUNCTION get_woodmanandolive_business_id()
RETURNS UUID AS $$
BEGIN
    RETURN '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get Woodman & Olive restaurant ID
CREATE OR REPLACE FUNCTION get_woodmanandolive_restaurant_id()
RETURNS UUID AS $$
BEGIN
    RETURN '24e2799f-60d5-4e3b-bb30-b8049c9ae56d'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Create a view for Woodman & Olive specific data
CREATE OR REPLACE VIEW woodmanandolive_dashboard AS
SELECT 
    '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' as business_id,
    '24e2799f-60d5-4e3b-bb30-b8049c9ae56d' as restaurant_id,
    'Woodman & Olive' as business_name,
    COUNT(DISTINCT c.id) as total_customers,
    COUNT(DISTINCT bk.id) as total_bookings,
    AVG(bk.party_size) as avg_party_size,
    SUM(CASE WHEN bk.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
    SUM(CASE WHEN bk.status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
    SUM(CASE WHEN bk.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
    COUNT(DISTINCT p.id) as total_users
FROM businesses b
LEFT JOIN customers c ON b.id = c.business_id
LEFT JOIN bookings bk ON b.id = bk.business_id
LEFT JOIN profiles p ON b.id = p.business_id
WHERE b.id = '24e2799f-60d5-4e3b-bb30-b8049c9ae56d';

-- Add comments to document the Woodman & Olive setup
COMMENT ON FUNCTION get_woodmanandolive_business_id() IS 'Returns the business ID for Woodman & Olive - used for multi-tenant isolation';
COMMENT ON FUNCTION get_woodmanandolive_restaurant_id() IS 'Returns the restaurant ID for Woodman & Olive - used for booking operations';
COMMENT ON VIEW woodmanandolive_dashboard IS 'Dashboard view showing all data for Woodman & Olive business'; 