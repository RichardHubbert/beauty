import emailjs from '@emailjs/browser';
import { format } from 'date-fns';
import { Booking } from './supabaseBookingService';

// EmailJS service configuration
const SERVICE_ID = 'service_evohrxl'; // EmailJS service ID
const TEMPLATE_ID = 'template_czntvyf'; // EmailJS template ID for Bond Chauffeur service
const PUBLIC_KEY = 'CrvLAsC5DKRwVy5jR'; // EmailJS public key

/**
 * Format a booking date and time for display in emails
 */
const formatBookingDateTime = (date: string, time: string): string => {
  const bookingDate = new Date(date);
  const formattedDate = format(bookingDate, 'EEEE, MMMM do, yyyy');
  return `${formattedDate} at ${time}`;
};

/**
 * Send a booking confirmation email to the customer
 */
export const sendBookingConfirmationEmail = async (booking: Booking): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('📧 Preparing to send booking confirmation email...');
    console.log('📧 EmailJS Config:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
    
    // Format the booking date and time for the email
    const formattedDateTime = formatBookingDateTime(booking.booking_date, booking.start_time);
    
    // Prepare template parameters for chauffeur service
    const templateParams = {
      service: 'Bond Chauffeur Service',
      date: booking.booking_date,
      time: booking.start_time,
      name: booking.customer_name,
      email: booking.customer_email,
      phone: booking.customer_phone || 'Not provided',
      pickup: (booking as any).pickup_location || 'To be confirmed with customer',
      dropoff: (booking as any).dropoff_location || 'To be confirmed with customer',
      passengers: booking.party_size,
      luggage: (booking as any).luggage_count || 'To be confirmed with customer',
      special: booking.special_requests || 'None',
      returnTrip: (booking as any).return_trip ? 'Yes' : 'No',
      vehicle: (booking as any).preferred_vehicle || 'Standard Luxury Vehicle',
      flight: (booking as any).flight_number || 'To be confirmed with customer'
    };
    
    console.log('📧 Sending confirmation email with params:', templateParams);
    
    // Send the email using EmailJS
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    
    console.log('✅ Email sent successfully:', response);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    console.error('❌ Email error details:', {
      error,
      errorMessage,
      serviceId: SERVICE_ID,
      templateId: TEMPLATE_ID,
      publicKey: PUBLIC_KEY?.substring(0, 10) + '...'
    });
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Initialize EmailJS
 */
export const initEmailService = (): void => {
  try {
    emailjs.init(PUBLIC_KEY);
    console.log('📧 EmailJS service initialized successfully');
    console.log('📧 EmailJS config:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY: PUBLIC_KEY?.substring(0, 10) + '...' });
  } catch (error) {
    console.error('❌ Failed to initialize EmailJS:', error);
  }
};

/**
 * Test EmailJS configuration
 */
export const testEmailService = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🧪 Testing EmailJS configuration...');
    
    const testParams = {
      service: 'Test Chauffeur Service',
      date: '2024-12-15',
      time: '14:00',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+44 123 456 7890',
      pickup: 'London Heathrow Airport',
      dropoff: 'Central London Hotel',
      passengers: 2,
      luggage: '2 pieces',
      special: 'Test special request',
      returnTrip: 'No',
      vehicle: 'Luxury Sedan',
      flight: 'BA123'
    };
    
    console.log('🧪 Test params:', testParams);
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      testParams,
      PUBLIC_KEY
    );
    
    console.log('✅ EmailJS test successful:', response);
    return { success: true };
  } catch (error) {
    console.error('❌ EmailJS test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }
    
    return { success: false, error: errorMessage };
  }
};
