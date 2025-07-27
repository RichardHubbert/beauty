import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant } from '@/components/RestaurantSelector';

interface RestaurantContextType {
  selectedRestaurant: Restaurant | undefined;
  setSelectedRestaurant: (restaurant: Restaurant | undefined) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
}

// Default Bond Chauffeur restaurant data
const defaultRestaurant: Restaurant = {
  id: '1',
  name: 'Bond Chauffeur',
  address: '20 West End Road Wormley, Broxbourne, Herts EN10 7QN',
  cuisine: 'Modern European',
  rating: 4.8,
  imageUrl: '/amicicoffee.jpg'
};

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | undefined>(defaultRestaurant);

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}; 