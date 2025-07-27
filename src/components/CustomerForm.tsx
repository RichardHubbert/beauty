
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MessageSquare, MapPin, Car, Plane, Package, ArrowLeftRight } from 'lucide-react';
import { BookingData } from './BookingModal';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerFormProps {
  data: Partial<BookingData>;
  onUpdate: (data: Partial<BookingData>) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ data, onUpdate }) => {
  const handleInputChange = (field: keyof BookingData, value: string | boolean | number) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Details</h3>
        <p className="text-gray-600">
          Please provide your contact information and trip details for your chauffeur service booking
        </p>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                type="text"
                placeholder="Enter your full name"
                value={data.customerName || ''}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="Enter your email address"
                value={data.customerEmail || ''}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="Enter your phone number"
              value={data.customerPhone || ''}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            />
            <p className="text-sm text-gray-500">
              We'll use this to contact you about your booking and for pickup coordination
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Trip Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                type="text"
                placeholder="e.g., London Heathrow Airport, Hotel address"
                value={data.pickupLocation || ''}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pickupPostcode">Pickup Postcode *</Label>
              <Input
                id="pickupPostcode"
                type="text"
                placeholder="e.g., SW1A 1AA"
                value={data.pickupPostcode || ''}
                onChange={(e) => handleInputChange('pickupPostcode', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dropoffLocation">Dropoff Location *</Label>
              <Input
                id="dropoffLocation"
                type="text"
                placeholder="e.g., Central London, Business address"
                value={data.dropoffLocation || ''}
                onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">Number of Passengers</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="8"
                placeholder="1"
                value={data.partySize || ''}
                onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="luggageCount">Luggage Count</Label>
              <Input
                id="luggageCount"
                type="text"
                placeholder="e.g., 2 suitcases, 1 carry-on"
                value={data.luggageCount || ''}
                onChange={(e) => handleInputChange('luggageCount', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flightNumber">Flight Number</Label>
              <Input
                id="flightNumber"
                type="text"
                placeholder="e.g., BA123"
                value={data.flightNumber || ''}
                onChange={(e) => handleInputChange('flightNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Preferred Vehicle Type</Label>
              <Select
                value={data.vehicleType || ''}
                onValueChange={(value) => handleInputChange('vehicleType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mercedes E-Class">Mercedes E-Class</SelectItem>
                  <SelectItem value="BMW 5 Series">BMW 5 Series</SelectItem>
                  <SelectItem value="Range Rover">Range Rover</SelectItem>
                  <SelectItem value="Mercedes V-Class">Mercedes V-Class</SelectItem>
                  <SelectItem value="Rolls-Royce Phantom">Rolls-Royce Phantom</SelectItem>
                  <SelectItem value="Bentley Flying Spur">Bentley Flying Spur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnTrip">Return Trip Required</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="returnTrip"
                  checked={data.returnTrip || false}
                  onCheckedChange={(checked) => handleInputChange('returnTrip', checked)}
                />
                <Label htmlFor="returnTrip" className="text-sm">
                  {data.returnTrip ? 'Yes' : 'No'}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Special Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests or Notes</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special requirements, accessibility needs, or additional notes..."
              value={data.specialRequests || ''}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Let us know about any special requirements, accessibility needs, or specific instructions
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Booking Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Your chauffeur will contact you 30 minutes before pickup</p>
          <p>• Please be ready 10 minutes before your scheduled time</p>
          <p>• Cancellations must be made at least 24 hours in advance</p>
          <p>• Contact us at +44 20 7946 0958 for any changes</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
