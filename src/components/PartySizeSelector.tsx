
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Plane, Building, Heart, Map } from 'lucide-react';

interface ServiceType {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  price: string;
  duration: string;
}

interface ServiceTypeSelectorProps {
  selectedType?: number;
  onTypeSelect: (type: number) => void;
}

const serviceTypes: ServiceType[] = [
  {
    id: 1,
    name: 'Airport Transfer',
    description: 'Professional airport pickup and drop-off',
    icon: Plane,
    price: 'From £80',
    duration: '1-2 hours'
  },
  {
    id: 2,
    name: 'City to City',
    description: 'Long-distance travel between cities',
    icon: Map,
    price: 'From £150',
    duration: '2-6 hours'
  },
  {
    id: 3,
    name: 'Business Travel',
    description: 'Reliable transportation for meetings',
    icon: Building,
    price: 'From £100',
    duration: '2-4 hours'
  },
  {
    id: 4,
    name: 'Wedding Service',
    description: 'Elegant transportation for special events',
    icon: Heart,
    price: 'From £200',
    duration: '4-8 hours'
  },
  {
    id: 5,
    name: 'Luxury Tour',
    description: 'Premium sightseeing experiences',
    icon: Car,
    price: 'From £300',
    duration: '6-12 hours'
  }
];

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Service</h3>
        <p className="text-gray-600">Choose the type of chauffeur service you need</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceTypes.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedType === service.id;
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onTypeSelect(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-600">{service.price}</span>
                      <span className="text-gray-500">{service.duration}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedType && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium text-amber-600">
              {serviceTypes.find(s => s.id === selectedType)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceTypeSelector;
