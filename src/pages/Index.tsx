import React, { useState } from 'react';
import BookingModal from '@/components/BookingModal';
import NavigationHeader from '@/components/NavigationHeader';
import HeroSection from '@/components/HeroSection';
import ServiceInfoSection from '@/components/RestaurantInfoSection';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useAuth();

  // New: State for prepopulating the booking modal
  const [initialDate, setInitialDate] = useState('');
  const [initialTime, setInitialTime] = useState('');
  const [initialPartySize, setInitialPartySize] = useState('');

  // Handler for Book Now button
  const handleBookNow = ({ date, time, serviceType }: { date: string; time: string; serviceType: string | number }) => {
    setInitialDate(date);
    setInitialTime(time);
    setInitialPartySize(serviceType.toString());
    setIsBookingModalOpen(true);
  };

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onBookingClick={handleBookingClick}
      />
      
      <HeroSection 
        onBookTable={() => handleBookingClick()}
      />
      
      <ServiceInfoSection />

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        restaurant={undefined}
        initialDate={initialDate}
        initialTime={initialTime}
        initialPartySize={initialPartySize}
      />
    </div>
  );
};

export default Index;
