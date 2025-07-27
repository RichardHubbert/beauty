
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertCircle, Plus } from 'lucide-react';
import { format, addMinutes, parseISO } from 'date-fns';
import { getAvailableTimeSlots } from '@/services/supabaseBookingService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeSlotSelectorProps {
  date: Date;
  partySize: number;
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  onCustomTimeSelect?: (time: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  date,
  partySize,
  selectedTime,
  onTimeSelect
}) => {
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [customHour, setCustomHour] = useState('');
  const [customMinute, setCustomMinute] = useState('');
  const [customAmPm, setCustomAmPm] = useState('AM');
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean, tableSize?: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Loading available slots for:', { date, partySize });
        const slots = await getAvailableTimeSlots(date, partySize);
        console.log('Available slots loaded:', slots);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setError('Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };

    loadAvailableSlots();
  }, [date, partySize]);

  const formatTimeSlot = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes) || 0);
      return format(timeObj, 'h:mm a');
    } catch (error) {
      console.error('Error formatting time slot:', error, time);
      return time; // Return the original time string as fallback
    }
  };

  const getTimeSlotLabel = (capacity?: number) => {
    if (!capacity) return '';
    return `Available for ${capacity}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-gray-600">Loading available times...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Times
          </h3>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const availableSlotCount = availableSlots.filter(slot => slot.available).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-2">
          Select your preferred pickup time
        </p>
        <p className="text-sm text-gray-500">
          {format(date, 'EEEE, MMMM do')} • Passengers: {partySize}
        </p>
      </div>

      {/* Custom Time Input Form */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">Request a Specific Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="ampm" className="text-xs text-amber-700">AM/PM</Label>
                <select
                  id="ampm"
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  value={customAmPm}
                  onChange={(e) => setCustomAmPm(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <div>
                <Label htmlFor="hour" className="text-xs text-amber-700">Hour</Label>
                <select
                  id="hour"
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  value={customHour}
                  onChange={(e) => setCustomHour(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div>
                <Label htmlFor="minute" className="text-xs text-amber-700">Minute</Label>
                <select
                  id="minute"
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  value={customMinute}
                  onChange={(e) => setCustomMinute(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div>
            </div>
            
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => {
                // Validate inputs
                const hour = parseInt(customHour);
                
                if (isNaN(hour) || hour < 1 || hour > 12) {
                  alert('Please enter a valid hour (1-12)');
                  return;
                }
                
                // Convert to 24-hour format for consistency
                let hour24 = hour;
                if (customAmPm === 'PM' && hour < 12) hour24 += 12;
                if (customAmPm === 'AM' && hour === 12) hour24 = 0;
                
                // Make sure customMinute is a string and has a value
                const minuteValue = customMinute || '00';
                
                const timeString = `${hour24.toString().padStart(2, '0')}:${minuteValue}`;
                console.log('Custom time selected:', timeString);
                onTimeSelect(timeString);
              }}
            >
              Confirm Time
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-gray-600 font-medium">- OR -</p>
        <p className="text-sm text-gray-500">Choose from available time slots</p>
      </div>

      {availableSlotCount === 0 ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              No times available
            </h3>
            <p className="text-red-600">
              All time slots are booked for a party of {partySize} on this date. 
              Please try a different date or party size.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Available Times ({availableSlotCount} slots)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSlots.map(({ time, available, tableSize }) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : available ? 'outline' : 'ghost'}
                    disabled={!available}
                    className={`
                      h-auto p-3 flex flex-col items-center space-y-1
                      ${selectedTime === time ? 'bg-amber-600 hover:bg-amber-700' : 
                        available ? 'hover:bg-amber-50 border-green-300 text-green-700' : 
                        'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'}
                    `}
                    onClick={() => available && onTimeSelect(time)}
                  >
                    <div className="font-medium">
                      {formatTimeSlot(time)}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedTime && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-green-800 font-medium">
                  Selected Time: {formatTimeSlot(selectedTime)}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Reservation ends at {formatTimeSlot(
                    format(addMinutes(parseISO(`2024-01-01T${selectedTime}`), 150), 'HH:mm')
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}



      <div className="text-sm text-gray-500 text-center space-y-1 mt-4">
        <p>• Times shown are start times for your reservation</p>
        <p>• Green indicates available slots</p>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
