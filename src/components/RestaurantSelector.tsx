import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  name: string;
  description: string;
  type: string;
  price: string;
  duration: string;
  image: string;
  rating: number;
  available: boolean;
}

interface ServiceSelectorProps {
  onServiceSelect: (service: Service) => void;
  selectedService?: Service;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect, selectedService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Sample chauffeur services
  const services: Service[] = [
    {
      id: '1',
      name: 'Airport Transfer',
      description: 'Professional airport pickup and drop-off service',
      type: 'Transfer',
      price: 'From £80',
      duration: '1-2 hours',
      image: '/airport-transfer.jpg',
      rating: 4.9,
      available: true
    },
    {
      id: '2',
      name: 'City to City',
      description: 'Long-distance travel between major cities',
      type: 'Long Distance',
      price: 'From £150',
      duration: '2-6 hours',
      image: '/city-to-city.jpg',
      rating: 4.8,
      available: true
    },
    {
      id: '3',
      name: 'Wedding Service',
      description: 'Elegant transportation for your special day',
      type: 'Special Event',
      price: 'From £200',
      duration: '4-8 hours',
      image: '/wedding-service.jpg',
      rating: 5.0,
      available: true
    },
    {
      id: '4',
      name: 'Business Travel',
      description: 'Reliable transportation for business meetings and events',
      type: 'Business',
      price: 'From £100',
      duration: '2-4 hours',
      image: '/business-travel.jpg',
      rating: 4.7,
      available: true
    },
    {
      id: '5',
      name: 'Luxury Tour',
      description: 'Premium sightseeing and tour experiences',
      type: 'Tour',
      price: 'From £300',
      duration: '6-12 hours',
      image: '/luxury-tour.jpg',
      rating: 4.9,
      available: true
    }
  ];

  useEffect(() => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchTerm]);

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>{selectedService ? selectedService.name : 'Select a service'}</span>
          </div>
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="p-2">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <Car className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{service.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {service.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-600">{service.rating}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{service.price}</div>
                            <div className="text-gray-500">{service.duration}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No services found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector; 