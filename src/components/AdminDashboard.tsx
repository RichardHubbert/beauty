import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar, Users, Clock, MapPin, Phone, Mail, Building2, Car, Plane, Package, ArrowLeftRight } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchTables, fetchAllBookings, getNextReservationForTable, type Table as TableType, type Booking, updateBooking, deleteBooking } from '@/services/supabaseBookingService';
import { useAdmin } from '@/hooks/useAdmin';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import BookingCalendar from './BookingCalendar';

const AdminDashboard = () => {
  const { isAdmin } = useAdmin();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tables, setTables] = useState<TableType[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading admin dashboard data...');
        const [tablesData, bookingsData] = await Promise.all([
          fetchTables(),
          fetchAllBookings()
        ]);
        console.log('Tables loaded:', tablesData);
        console.log('Bookings loaded:', bookingsData);
        setTables(tablesData);
        setAllBookings(bookingsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get filtered bookings based on date filter
  const getFilteredBookings = () => {
    let filtered = allBookings;

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(booking => 
        isSameDay(new Date(booking.booking_date), filterDate)
      );
    }

    return filtered;
  };



  // Get bookings for selected date
  const dayBookings = getFilteredBookings().filter(booking => 
    isSameDay(new Date(booking.booking_date), selectedDate)
  );

  // Get table status for selected date
  const getTableStatus = (table: TableType) => {
    const tableBookings = dayBookings.filter(booking => booking.table_id === table.id);
    return tableBookings;
  };

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({ ...booking });
  };
  const handleDeleteClick = (booking: Booking) => {
    setDeletingBooking(booking);
  };
  const handleEditChange = (field: keyof Booking, value: any) => {
    setEditForm(f => ({ ...f, [field]: value }));
  };
  const handleEditSave = async () => {
    if (editingBooking) {
      setActionLoading(true);
      setEditError(null);
      try {
        console.log('Attempting to update booking with ID:', editingBooking.id);
        console.log('Update data:', editForm);
        // Filter out the restaurant object and only update actual database fields
        const { restaurant, ...updateData } = editForm;
        console.log('Filtered update data:', updateData);
        await updateBooking(editingBooking.id, updateData);
        const bookingsData = await fetchAllBookings();
        setAllBookings(bookingsData);
        setEditingBooking(null);
        console.log('Booking updated successfully');
      } catch (err: any) {
        console.error('Failed to update booking', err);
        setEditError(err?.message || 'Failed to update booking. Check console for details.');
      } finally {
        setActionLoading(false);
      }
    }
  };
  const handleDeleteConfirm = async () => {
    if (deletingBooking) {
      setActionLoading(true);
      setDeleteError(null);
      try {
        console.log('Attempting to delete booking with ID:', deletingBooking.id);
        await deleteBooking(deletingBooking.id);
        const bookingsData = await fetchAllBookings();
        setAllBookings(bookingsData);
        setDeletingBooking(null);
      } catch (err: any) {
        console.error('Failed to delete booking', err);
        setDeleteError(err?.message || 'Failed to delete booking. Check RLS or Supabase logs.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 p-4">

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-700">Chauffeur Bookings Overview</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 border rounded-lg p-3 bg-white shadow-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <input
                    type="date"
                    value={filterDate ? format(filterDate, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setFilterDate(e.target.value ? new Date(e.target.value) : null)}
                    className="border-none focus:ring-0 p-0 text-gray-800"
                  />
                </div>
                {filterDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilterDate(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="rounded-full bg-amber-50 border border-amber-100 py-2 px-4">
                <span className="text-amber-800 font-medium">
                  {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {filterDate ? 'Filtered Bookings' : 'Total Bookings'}
                    </p>
                    <p className="text-2xl font-bold">{getFilteredBookings().length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Confirmed</p>
                    <p className="text-2xl font-bold">{getFilteredBookings().filter(b => b.status === 'confirmed').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Passengers</p>
                    <p className="text-2xl font-bold">
                      {getFilteredBookings().reduce((sum, booking) => sum + booking.party_size, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Airport Transfers</p>
                    <p className="text-2xl font-bold">
                      {getFilteredBookings().filter(b => (b as any).flight_number).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Calendar */}
        {showCalendar && (
          <BookingCalendar 
            bookings={getFilteredBookings()}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}

        {/* Chauffeur Services Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Types Overview</CardTitle>
              <CardDescription>
                Breakdown of chauffeur services
                {filterDate && ` for ${format(filterDate, 'MMM do, yyyy')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const serviceTypes = {
                    1: 'Airport Transfer',
                    2: 'City to City',
                    3: 'Business Travel',
                    4: 'Wedding Service',
                    5: 'Luxury Tour'
                  };
                  
                  const serviceCounts = getFilteredBookings().reduce((acc, booking) => {
                    const serviceType = serviceTypes[booking.party_size as keyof typeof serviceTypes] || 'Other';
                    acc[serviceType] = (acc[serviceType] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  return Object.entries(serviceCounts).map(([service, count]) => (
                    <div key={service} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{service}</span>
                      </div>
                      <Badge variant="outline">{count} booking{count !== 1 ? 's' : ''}</Badge>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>

          {/* Chauffeur Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {filterDate ? 'Filtered Chauffeur Bookings' : 'All Chauffeur Bookings'}
              </CardTitle>
              <CardDescription>
                Detailed view of all chauffeur bookings
                {filterDate && ` for ${format(filterDate, 'MMM do, yyyy')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getFilteredBookings().length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chauffeur bookings found{filterDate ? ` for ${format(filterDate, 'MMM do, yyyy')}` : ''}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredBookings().map(booking => {
                    const serviceTypes = {
                      1: 'Airport Transfer',
                      2: 'City to City',
                      3: 'Business Travel',
                      4: 'Wedding Service',
                      5: 'Luxury Tour'
                    };
                    const serviceType = serviceTypes[booking.party_size as keyof typeof serviceTypes] || 'Chauffeur Service';
                    
                    return (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{booking.customer_name}</h4>
                            <p className="text-sm text-gray-600">{serviceType}</p>
                          </div>
                          <Badge variant="outline">
                            {booking.party_size} {booking.party_size === 1 ? 'passenger' : 'passengers'}
                          </Badge>
                        </div>
                        
                        {/* Trip Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{booking.start_time} - {booking.end_time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{booking.customer_email}</span>
                          </div>
                          {booking.customer_phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{booking.customer_phone}</span>
                            </div>
                          )}
                          {(booking as any).pickup_location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-green-400" />
                              <span className="text-green-600 font-medium">Pickup: {(booking as any).pickup_location}</span>
                            </div>
                          )}
                          {(booking as any).dropoff_location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-red-400" />
                              <span className="text-red-600 font-medium">Dropoff: {(booking as any).dropoff_location}</span>
                            </div>
                          )}
                          {(booking as any).flight_number && (
                            <div className="flex items-center space-x-2">
                              <Plane className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-600 font-medium">Flight: {(booking as any).flight_number}</span>
                            </div>
                          )}
                          {(booking as any).preferred_vehicle && (
                            <div className="flex items-center space-x-2">
                              <Car className="h-4 w-4 text-purple-400" />
                              <span className="text-purple-600 font-medium">{(booking as any).preferred_vehicle}</span>
                            </div>
                          )}
                          {(booking as any).luggage_count && (
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-orange-400" />
                              <span className="text-orange-600 font-medium">Luggage: {(booking as any).luggage_count}</span>
                            </div>
                          )}
                          {(booking as any).return_trip !== undefined && (
                            <div className="flex items-center space-x-2">
                              <ArrowLeftRight className="h-4 w-4 text-indigo-400" />
                              <span className="text-indigo-600 font-medium">Return Trip: {(booking as any).return_trip ? 'Yes' : 'No'}</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.special_requests && (
                          <div className="text-sm bg-amber-50 border border-amber-200 rounded p-2">
                            <p className="font-medium text-amber-800">Special Requests:</p>
                            <p className="text-amber-700">{booking.special_requests}</p>
                          </div>
                        )}
                        
                        {/* Amend/Delete Buttons */}
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => handleEditClick(booking)}>Amend</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(booking)}>Delete</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Service Management Section - Only for Admin */}
        
        {/* User Management Section - Only for Admin */}
      </div>
      {/* Edit Booking Modal */}
      <Dialog open={!!editingBooking} onOpenChange={open => !open && setEditingBooking(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Amend Chauffeur Booking</DialogTitle>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={editForm.customer_name || ''} 
                  onChange={e => handleEditChange('customer_name', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  type="email"
                  value={editForm.customer_email || ''} 
                  onChange={e => handleEditChange('customer_email', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={editForm.customer_phone || ''} 
                  onChange={e => handleEditChange('customer_phone', e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  type="number" 
                  min="1"
                  value={editForm.party_size || ''} 
                  onChange={e => handleEditChange('party_size', Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={(editForm as any).pickup_location || ''} 
                  onChange={e => handleEditChange('pickup_location' as any, e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={(editForm as any).dropoff_location || ''} 
                  onChange={e => handleEditChange('dropoff_location' as any, e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Luggage Count</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={(editForm as any).luggage_count || ''} 
                  onChange={e => handleEditChange('luggage_count' as any, e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={(editForm as any).preferred_vehicle || ''} 
                  onChange={e => handleEditChange('preferred_vehicle' as any, e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={(editForm as any).flight_number || ''} 
                  onChange={e => handleEditChange('flight_number' as any, e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Trip</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={(editForm as any).return_trip || false}
                  onChange={e => handleEditChange('return_trip' as any, e.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-600">Return trip required</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={3}
                value={editForm.special_requests || ''} 
                onChange={e => handleEditChange('special_requests', e.target.value)} 
              />
            </div>
          </div>
          {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
          <DialogFooter>
            <Button onClick={() => setEditingBooking(null)} variant="secondary" disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleEditSave} variant="default" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Booking Confirmation */}
      <Dialog open={!!deletingBooking} onOpenChange={open => !open && setDeletingBooking(null)}>
        <DialogContent>
          <DialogTitle>Delete Chauffeur Booking</DialogTitle>
          <p>Are you sure you want to delete this chauffeur booking?</p>
          <DialogFooter>
            <Button onClick={() => setDeletingBooking(null)} variant="secondary" disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="destructive" disabled={actionLoading}>Delete</Button>
          </DialogFooter>
          {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
