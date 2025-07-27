import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Star, Car } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  rating: number;
  imageUrl?: string;
}

interface ServiceInfoSectionProps {
  selectedService?: Service;
}

const ServiceInfoSection: React.FC<ServiceInfoSectionProps> = ({ selectedService }) => {
  const defaultService: Service = {
    id: '1',
    name: 'Bond Chauffeur',
    description: 'Premium chauffeur services for discerning clients. Experience luxury, reliability, and professionalism with our fleet of high-end vehicles and professional drivers.',
    address: 'London, United Kingdom',
    phone: '+44 20 7946 0958',
    email: 'bookings@theaidesign.co.uk',
    hours: '24/7 Service Available',
    rating: 4.9
  };

  const service = selectedService || defaultService;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Service Image */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{service.rating}</span>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {service.name}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {service.description}
            </p>

            {/* Service Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Car className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Luxury Fleet</h3>
                  <p className="text-sm text-gray-600">Premium vehicles for every occasion</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Service</h3>
                  <p className="text-sm text-gray-600">Available whenever you need us</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Professional Drivers</h3>
                  <p className="text-sm text-gray-600">Experienced and courteous chauffeurs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nationwide Coverage</h3>
                  <p className="text-sm text-gray-600">Service across the UK and Europe</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <Card className="bg-white border-amber-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{service.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{service.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{service.hours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceInfoSection;
