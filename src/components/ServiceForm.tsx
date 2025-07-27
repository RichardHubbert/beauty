import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Restaurant, createRestaurant, updateRestaurant } from '@/services/restaurantService';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image as ImageIcon, Car } from 'lucide-react';

interface ServiceFormProps {
  service?: Restaurant;
  onSuccess: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '', // This will be used as service_type
    rating: '',
    image_url: '',
    phone: '',
    email: '',
    description: '',
    is_active: true,
    county: '',
  });

  const isEditing = !!service;

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        address: service.address || '',
        cuisine: service.cuisine || '',
        rating: service.rating?.toString() || '',
        image_url: service.image_url || '',
        phone: service.phone || '',
        email: service.email || '',
        description: service.description || '',
        is_active: service.is_active ?? true,
        county: service.county || '',
      });
      if (service.image_url) {
        setImagePreview(service.image_url);
      }
    }
  }, [service]);

  const handleImageUpload = async (file: File): Promise<string> => {
    console.log('🚀 Starting image upload...');
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `service-images/${fileName}`;

    console.log('📂 Upload path:', filePath);

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 User auth status:', user ? 'Authenticated' : 'Not authenticated');

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('restaurants')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error details:', {
        message: uploadError.message,
        name: uploadError.name
      });
      throw uploadError;
    }

    console.log('✅ Upload successful:', data);

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('restaurants')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL:', publicUrl);
    return publicUrl;
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await handleImageUpload(imageFile);
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Upload Failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }
      }

      const serviceData = {
        ...formData,
        image_url: imageUrl,
        rating: formData.rating ? parseFloat(formData.rating) : null
      };

      if (isEditing && service) {
        await updateRestaurant(service.id, serviceData);
        toast({
          title: "Service Updated",
          description: "Chauffeur service has been updated successfully.",
        });
      } else {
        await createRestaurant(serviceData);
        toast({
          title: "Service Created",
          description: "Chauffeur service has been created successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {isEditing ? 'Edit Chauffeur Service' : 'Add New Chauffeur Service'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Airport Transfer, City to City, Business Travel"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <Label htmlFor="cuisine">Service Type *</Label>
                <Input
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                  placeholder="e.g., Airport Transfer, City to City, Business Travel, Wedding, Event"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Service Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the service, what's included, duration, etc."
                  rows={3}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="service@example.com"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Service Area</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="e.g., London, Manchester, Birmingham"
                  />
                </div>
                <div>
                  <Label htmlFor="county">County/Region</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                    placeholder="e.g., Greater London, West Midlands"
                  />
                </div>
              </div>

              {/* Service Rating */}
              <div>
                <Label htmlFor="rating">Service Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  placeholder="4.5"
                />
              </div>

              {/* Service Image */}
              <div>
                <Label>Service Image</Label>
                <div
                  className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Service preview"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Upload an image
                          </span>
                          <span className="text-sm text-gray-500"> or drag and drop</span>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked.toString())}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="is_active">Active Service</Label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Car className="h-4 w-4" />
                      {isEditing ? 'Update Service' : 'Create Service'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceForm; 