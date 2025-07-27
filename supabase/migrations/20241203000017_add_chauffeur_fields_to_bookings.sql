-- Add chauffeur service fields to bookings table
-- Migration: 20241203000017_add_chauffeur_fields_to_bookings.sql

-- Add new columns for chauffeur service details
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_location TEXT,
ADD COLUMN IF NOT EXISTS dropoff_location TEXT,
ADD COLUMN IF NOT EXISTS luggage_count TEXT,
ADD COLUMN IF NOT EXISTS return_trip BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_vehicle TEXT,
ADD COLUMN IF NOT EXISTS flight_number TEXT;

-- Add comments to document the new fields
COMMENT ON COLUMN bookings.pickup_location IS 'Pickup location for chauffeur service';
COMMENT ON COLUMN bookings.dropoff_location IS 'Dropoff location for chauffeur service';
COMMENT ON COLUMN bookings.luggage_count IS 'Number and description of luggage';
COMMENT ON COLUMN bookings.return_trip IS 'Whether a return trip is required';
COMMENT ON COLUMN bookings.preferred_vehicle IS 'Preferred vehicle type for the service';
COMMENT ON COLUMN bookings.flight_number IS 'Flight number for airport transfers';

-- Update RLS policies to include new fields
-- Note: Existing RLS policies should automatically apply to new columns
-- but we'll verify the policies are working correctly

-- Test the migration by ensuring we can insert a booking with the new fields
-- This is just a verification step - the actual data will be inserted by the application 