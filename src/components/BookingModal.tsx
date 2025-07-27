import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, CheckCircle, Mail, Car, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DateSelector from '@/components/DateSelector';
import ServiceTypeSelector from '@/components/PartySizeSelector';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import CustomerForm from '@/components/CustomerForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import { createBooking } from '@/services/supabaseBookingService';
import { sendBookingConfirmationEmail } from '@/services/emailService';
import { fetchRestaurants, Restaurant } from '@/services/restaurantService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant?: Restaurant;
  initialDate?: string;
  initialTime?: string;
  initialPartySize?: string;
}

export interface BookingData {
  restaurantId: string;
  date: Date;
  startTime: string;
  partySize: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  specialRequests?: string;
  // New chauffeur service fields
  serviceType?: string;
  pickupLocation?: string;
  pickupPostcode?: string; // Added pickup postcode field
  dropoffLocation?: string;
  luggageCount?: string;
  returnTrip?: boolean;
  vehicleType?: string;
  flightNumber?: string;
}

const steps = [
  { id: 1, title: 'Date', icon: Calendar },
  { id: 2, title: 'Service', icon: Car },
  { id: 3, title: 'Time', icon: Clock },
  { id: 4, title: 'Details', icon: User },
  { id: 5, title: 'Confirm', icon: CheckCircle },
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, restaurant, initialDate, initialTime, initialPartySize }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({ 
    restaurantId: '24e2799f-60d5-4e3b-bb30-b8049c9ae56d', // Default Bond Chauffeur service ID
    date: undefined 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<BookingData | null>(null);
  const { toast } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill form with initial values from filter selections
  useEffect(() => {
    if (isOpen) {
      const updatedData: Partial<BookingData> = {
        restaurantId: '24e2799f-60d5-4e3b-bb30-b8049c9ae56d', // Always use default service
        date: initialDate ? new Date(initialDate) : undefined,
        startTime: initialTime || '',
        partySize: initialPartySize ? parseInt(initialPartySize) : undefined,
      };
      setBookingData(updatedData);
    }
  }, [isOpen, initialDate, initialTime, initialPartySize]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setBookingData({ 
      restaurantId: '24e2799f-60d5-4e3b-bb30-b8049c9ae56d', // Keep default service ID
      date: undefined 
    });
    setConfirmationData(null);
    setSubmitError(null);
    onClose();
  };

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData({ ...bookingData, ...data });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.date; // Only require date
      case 2:
        return bookingData.partySize; // This will be service type
      case 3:
        return bookingData.startTime;
      case 4:
        return bookingData.customerName && bookingData.customerEmail;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!bookingData.date || !bookingData.startTime || !bookingData.partySize || 
        !bookingData.customerName || !bookingData.customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields, including date, time, and service details.",
        variant: "destructive"
      });
      setSubmitError('Please fill in all required fields, including date, time, and service details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        restaurantId: bookingData.restaurantId,
        date: bookingData.date,
        startTime: bookingData.startTime,
        partySize: bookingData.partySize,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        specialRequests: bookingData.specialRequests,
        // New chauffeur service fields
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
        luggageCount: bookingData.luggageCount,
        returnTrip: bookingData.returnTrip,
        vehicleType: bookingData.vehicleType,
        flightNumber: bookingData.flightNumber
      });
      console.log('🎉 Chauffeur booking submission successful!', result);
      // Convert Booking to BookingData
      const confirmedBooking: BookingData = {
        restaurantId: result.restaurant_id,
        date: new Date(result.booking_date),
        startTime: result.start_time,
        partySize: result.party_size,
        customerName: result.customer_name,
        customerEmail: result.customer_email,
        customerPhone: result.customer_phone,
        specialRequests: result.special_requests,
        // New chauffeur service fields (safely access with type assertion)
        pickupLocation: (result as any).pickup_location,
        dropoffLocation: (result as any).dropoff_location,
        luggageCount: (result as any).luggage_count,
        returnTrip: (result as any).return_trip,
        vehicleType: (result as any).preferred_vehicle,
        flightNumber: (result as any).flight_number
      };
      setConfirmationData(confirmedBooking);
      setCurrentStep(5);
      
      // Send confirmation email
      console.log('📧 Attempting to send confirmation email...');
      const emailResult = await sendBookingConfirmationEmail(result);
      
      if (emailResult.success) {
        toast({
          title: "Booking Confirmed!",
          description: "Your chauffeur service has been successfully booked. A confirmation email has been sent to your inbox.",
        });
      } else {
        console.error('📧 Email failed:', emailResult.error);
        toast({
          title: "Booking Confirmed!",
          description: `Your chauffeur service has been successfully booked. (Email delivery failed: ${emailResult.error})`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('💥 Chauffeur booking submission failed:', error);
      setSubmitError('Booking failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateSelector
            selectedDate={bookingData.date}
            onDateSelect={date => setBookingData({ ...bookingData, date })}
          />
        );
      case 2:
        return (
          <ServiceTypeSelector
            selectedType={bookingData.partySize}
            onTypeSelect={(partySize) => updateBookingData({ partySize })}
          />
        );
      case 3:
        return (
          <TimeSlotSelector
            date={bookingData.date!}
            partySize={bookingData.partySize!}
            selectedTime={bookingData.startTime}
            onTimeSelect={time => updateBookingData({ startTime: time })}
          />
        );
      case 4:
        return (
          <CustomerForm
            data={bookingData}
            onUpdate={updateBookingData}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            bookingData={bookingData as BookingData}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Book Your Chauffeur Service
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive 
                    ? 'border-amber-500 bg-amber-500 text-white' 
                    : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
