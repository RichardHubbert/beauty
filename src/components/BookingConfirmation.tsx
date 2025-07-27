import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, MapPin, Users, Mail, Phone, Car, Plane, Package, ArrowLeftRight } from 'lucide-react';
import { format } from 'date-fns';
import { BookingData } from './BookingModal';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bookingData, onClose }) => {
  const serviceTypes = {
    1: 'Airport Transfer',
    2: 'City to City',
    3: 'Business Travel',
    4: 'Wedding Service',
    5: 'Luxury Tour'
  };

  const serviceType = serviceTypes[bookingData.partySize as keyof typeof serviceTypes] || 'Chauffeur Service';

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">
          Your chauffeur service has been successfully booked. We've sent a confirmation email with all the details.
        </p>
      </div>

      {/* Service Information */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Car className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium text-gray-900">{serviceType}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">
                  {format(bookingData.date, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium text-gray-900">{bookingData.startTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{bookingData.customerName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{bookingData.customerEmail}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{bookingData.customerPhone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-800">Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="font-medium text-gray-900">{bookingData.pickupLocation || 'To be confirmed'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Dropoff Location</p>
                <p className="font-medium text-gray-900">{bookingData.dropoffLocation || 'To be confirmed'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Passengers</p>
                <p className="font-medium text-gray-900">{bookingData.partySize}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Luggage</p>
                <p className="font-medium text-gray-900">{bookingData.luggageCount || 'To be confirmed'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ArrowLeftRight className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Return Trip</p>
                <p className="font-medium text-gray-900">{bookingData.returnTrip ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium text-gray-900">{bookingData.vehicleType || 'Standard'}</p>
              </div>
            </div>
          </div>

          {bookingData.flightNumber && (
            <div className="flex items-center space-x-3">
              <Plane className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-medium text-gray-900">{bookingData.flightNumber}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Special Requests */}
      {bookingData.specialRequests && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 bg-white p-3 rounded-md border">
              {bookingData.specialRequests}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <h3 className="font-medium text-amber-800 mb-2">Important Information</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• A confirmation email will be sent to {bookingData.customerEmail}</li>
            <li>• Please be ready 10 minutes before your scheduled pickup time</li>
            <li>• Contact us at +44 20 7946 0958 if you need to modify your booking</li>
            <li>• Cancellations must be made at least 24 hours in advance</li>
            <li>• Your chauffeur will contact you 30 minutes before pickup</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={onClose}
          className="flex-1"
        >
          Close
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.print()}
          className="flex-1"
        >
          Print Confirmation
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

