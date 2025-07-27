import { supabase } from '@/integrations/supabase/client';
import axios from 'axios';

export interface CustomerDataForCRM {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequests?: string;
  restaurantId: string;
  restaurantName?: string;
  bookingDate: string;
  startTime: string;
  partySize: number;
  bookingId: string;
  businessId?: string;
  isNewCustomer?: boolean;
  customerId?: string;
  externalId?: string;
  dateOfBirth?: string;
  preferences?: any;
}

export interface CRMResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  crm_response?: any;
}

/**
 * Send customer booking data to CRM via Supabase function
 */
export const sendCustomerToCRM = async (customerData: CustomerDataForCRM): Promise<CRMResponse> => {
  try {
    console.log('📧 Sending customer data to CRM:', customerData);
    console.log('🏢 Business ID being sent to CRM:', customerData.businessId);

    // Convert to plain object to avoid any proxy issues and ensure all fields are properly formatted
    const plainCustomerData = {
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone || '',
      specialRequests: customerData.specialRequests || '',
      restaurantId: customerData.restaurantId,
      restaurantName: customerData.restaurantName || '',
      bookingDate: customerData.bookingDate,
      startTime: customerData.startTime,
      partySize: customerData.partySize,
      bookingId: customerData.bookingId,
      businessId: customerData.businessId || '6c5d19b9-e75c-48e6-a894-ca33882a0304', // Use correct CRM business ID
      isNewCustomer: customerData.isNewCustomer || false,
      customerId: customerData.customerId || ''
    };
    
    console.log('📦 Sending payload:', plainCustomerData);
    
    // Use the correct method to invoke the function with stringified body
    const { data, error } = await supabase.functions.invoke('send-customer-to-crm', {
      body: plainCustomerData
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      return {
        success: false,
        error: 'Failed to send data to CRM',
        details: error.message
      };
    }

    console.log('✅ CRM function response:', data);
    return {
      success: true,
      message: 'Customer data sent to CRM successfully',
      crm_response: data
    };

  } catch (error) {
    console.error('💥 Error calling CRM function:', error);
    return {
      success: false,
      error: 'Failed to send data to CRM',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Send new customer data to CRM (without booking)
 */
/**
 * Sync customer data with the new CRM API endpoint
 */
export const syncCustomerWithCRM = async (customerData: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  businessId?: string;
  customerId?: string;
  bookingId?: string;
  bookingDate?: string;
  startTime?: string;
  partySize?: number;
  specialRequests?: string;
  restaurantName?: string;
}): Promise<CRMResponse> => {
  try {
    console.log('🔄 Syncing customer data with new CRM API:', customerData);
    
    // Always use the correct CRM business ID if not provided
    const businessId = customerData.businessId || '6c5d19b9-e75c-48e6-a894-ca33882a0304';
    
    // Prepare the payload for the new CRM API
    const payload = {
      name: customerData.customerName,
      email: customerData.customerEmail,
      phone: customerData.customerPhone || '',
      business_id: businessId, // Always include the business ID
      business_name: customerData.restaurantName || 'Bond Chauffeur', // Use provided name or default
      customer_id: customerData.customerId || '',
      booking_id: customerData.bookingId || '',
      booking_date: customerData.bookingDate || '',
      start_time: customerData.startTime || '',
      party_size: customerData.partySize || 0,
      special_requests: customerData.specialRequests || ''
    };
    
    console.log('📦 Sending payload to new CRM API:', payload);
    
    // Call the new CRM API endpoint
    const response = await axios.post(
      'https://lvsigdvzlccvizgxqmtl.supabase.co/functions/v1/sync-customer',
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ New CRM API response:', response.data);
    return {
      success: true,
      message: 'Customer data synced with CRM successfully',
      crm_response: response.data
    };
  } catch (error) {
    console.error('💥 Error syncing customer with CRM API:', error);
    return {
      success: false,
      error: 'Failed to sync customer data with CRM',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const sendNewCustomerToCRM = async (customerData: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  businessId?: string; // Made optional since we'll use a fixed CRM business ID
  customerId?: string;
  // Removed fields that don't exist in CRM schema
  // externalId?: string;
  // dateOfBirth?: string;
  // preferences?: any;
}): Promise<CRMResponse> => {
  try {
    console.log('📫 Sending new customer data to CRM:', customerData);
    
    // Always use the correct CRM business ID
    const crmBusinessId = '6c5d19b9-e75c-48e6-a894-ca33882a0304';
    console.log('🏢 Business ID being sent to CRM:', crmBusinessId);

    // First, sync with the new CRM API endpoint
    const newCrmResult = await syncCustomerWithCRM({
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone,
      businessId: crmBusinessId,
      customerId: customerData.customerId,
      bookingId: 'customer-' + (customerData.customerId || Date.now())
    });
    
    if (newCrmResult.success) {
      console.log('✅ New customer data synced with new CRM API successfully');
    } else {
      console.warn('⚠️ Failed to sync new customer data with new CRM API:', newCrmResult.error);
    }
    
    // For backward compatibility, also send to the old CRM system
    // Create the payload object with explicit values for all fields
    const payload = {
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone || '',
      restaurantId: 'new-customer',
      restaurantName: 'New Customer Registration',
      bookingDate: new Date().toISOString().split('T')[0],
      startTime: '00:00',
      partySize: 0,
      bookingId: 'customer-' + (customerData.customerId || Date.now()),
      businessId: crmBusinessId, // Use the correct CRM business ID
      isNewCustomer: true,
      customerId: customerData.customerId || ''
    };
    
    console.log('📦 Sending new customer payload to old CRM:', payload);
    
    // Simplified function invocation without extra headers
    const { data, error } = await supabase.functions.invoke('send-customer-to-crm', {
      body: payload
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      return {
        success: false,
        error: 'Failed to send new customer data to old CRM',
        details: error.message
      };
    }

    console.log('✅ New customer old CRM function response:', data);
    return {
      success: true,
      message: 'New customer data sent to CRM systems successfully',
      crm_response: data
    };

  } catch (error) {
    console.error('💥 Error calling CRM function for new customer:', error);
    return {
      success: false,
      error: 'Failed to send new customer data to CRM',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 