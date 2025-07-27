import React from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking } from '@/services/supabaseBookingService';

interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  selectedDate,
  onDateSelect
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate);

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => isSameDay(new Date(booking.booking_date), date));
  };

  // Get all days in the current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  // Get days from previous month to fill the first week
  const getDaysFromPreviousMonth = () => {
    const start = startOfMonth(currentMonth);
    const dayOfWeek = start.getDay();
    if (dayOfWeek === 0) return []; // Sunday, no need for previous month days
    
    const previousMonth = subMonths(currentMonth, 1);
    const endOfPreviousMonth = endOfMonth(previousMonth);
    const startDate = new Date(endOfPreviousMonth);
    startDate.setDate(endOfPreviousMonth.getDate() - dayOfWeek + 1);
    
    return eachDayOfInterval({ start: startDate, end: endOfPreviousMonth });
  };

  // Get days from next month to fill the last week
  const getDaysFromNextMonth = () => {
    const end = endOfMonth(currentMonth);
    const dayOfWeek = end.getDay();
    if (dayOfWeek === 6) return []; // Saturday, no need for next month days
    
    const nextMonth = addMonths(currentMonth, 1);
    const startOfNextMonth = startOfMonth(nextMonth);
    const endDate = new Date(startOfNextMonth);
    endDate.setDate(startOfNextMonth.getDate() + (6 - dayOfWeek));
    
    return eachDayOfInterval({ start: startOfNextMonth, end: endDate });
  };

  // Get all days to display (previous month + current month + next month)
  const getAllDays = () => {
    return [
      ...getDaysFromPreviousMonth(),
      ...getDaysInMonth(),
      ...getDaysFromNextMonth()
    ];
  };

  // Get booking summary for selected date
  const selectedDateBookings = getBookingsForDate(selectedDate);
  const totalPassengers = selectedDateBookings.reduce((sum, booking) => sum + booking.party_size, 0);
  const airportTransfers = selectedDateBookings.filter(b => (b as any).flight_number).length;

  // Get month summary
  const currentMonthBookings = bookings.filter(booking => 
    format(new Date(booking.booking_date), 'yyyy-MM') === format(currentMonth, 'yyyy-MM')
  );
  const monthTotalBookings = currentMonthBookings.length;
  const monthTotalPassengers = currentMonthBookings.reduce((sum, booking) => sum + booking.party_size, 0);

  const renderDay = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isToday(date);
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const hasAirportTransfers = dayBookings.some(b => (b as any).flight_number);
    
    return (
      <button
        key={date.toISOString()}
        onClick={() => onDateSelect(date)}
        className={`
          relative w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center
          ${isSelected 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
            : isCurrentDay 
              ? 'bg-blue-50 text-blue-700 font-semibold border-2 border-blue-200' 
              : isCurrentMonth 
                ? 'text-gray-900 hover:bg-gray-100' 
                : 'text-gray-400 hover:bg-gray-50'
          }
          ${dayBookings.length > 0 ? 'font-semibold' : ''}
        `}
      >
        <span className="text-sm">{format(date, 'd')}</span>
        {dayBookings.length > 0 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className={`
                w-3 h-3 rounded-full shadow-sm
                ${hasAirportTransfers ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'}
              `}></div>
              {dayBookings.length > 1 && (
                <span className={`
                  text-xs font-bold px-1 py-0.5 rounded-full
                  ${hasAirportTransfers ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                `}>
                  {dayBookings.length}
                </span>
              )}
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">Booking Calendar</span>
            </CardTitle>
            <p className="text-amber-100 mt-2 text-lg">
              {format(currentMonth, 'MMMM yyyy')} • {monthTotalBookings} bookings • {monthTotalPassengers} passengers
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {getAllDays().map(date => renderDay(date))}
              </div>
            </div>
          </div>

          {/* Selected Date Summary */}
          <div className="space-y-6">
            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {format(selectedDate, 'd')}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {format(selectedDate, 'EEEE')}
              </h3>
              <p className="text-gray-600 font-medium">
                {format(selectedDate, 'MMMM yyyy')}
              </p>
            </div>

            {/* Booking Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Bookings</p>
                      <p className="text-xs text-gray-500">For this date</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{selectedDateBookings.length}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total Passengers</p>
                      <p className="text-xs text-gray-500">Across all bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{totalPassengers}</div>
                  </div>
                </div>
              </div>

              {airportTransfers > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Car className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Airport Transfers</p>
                        <p className="text-xs text-gray-500">With flight numbers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{airportTransfers}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Booking List */}
            {selectedDateBookings.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  Today's Bookings
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedDateBookings.map(booking => (
                    <div key={booking.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900 text-sm">{booking.customer_name}</div>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {booking.party_size} {booking.party_size === 1 ? 'passenger' : 'passengers'}
                        </Badge>
                      </div>
                      <div className="text-gray-600 text-xs mb-1">
                        {booking.start_time} • {booking.end_time}
                      </div>
                      {(booking as any).pickup_location && (
                        <div className="text-gray-500 text-xs truncate">
                          📍 From: {(booking as any).pickup_location}
                        </div>
                      )}
                      {(booking as any).flight_number && (
                        <div className="text-blue-600 text-xs font-medium">
                          ✈️ Flight: {(booking as any).flight_number}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDateBookings.length === 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No bookings for this date</p>
                <p className="text-gray-400 text-sm mt-1">All clear for {format(selectedDate, 'EEEE')}!</p>
              </div>
            )}

            {/* Calendar Legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Calendar Legend
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Regular bookings</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Airport transfers</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
                  <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Selected date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar; 