import React, { useState, useEffect } from 'react';
import type { Listing } from '../types';
import { uploadImage } from '../services/firebase'; // Import the helper we created

interface ListingFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Updated onSave: It now receives the full object with the image URL string, 
    // so we don't need to pass the File object anymore.
    onSave: (listingData: Omit<Listing, 'id'> & { id?: string }) => void;
    listingToEdit: Listing | null;
    isSaving: boolean;
}

const initialFormData: Omit<Listing, 'id' | 'tags' | 'amenities' | 'status' | 'image'> & { tags: string, amenities: string, status: string, image?: string } = {
    title: '',
    location: '',
    price: '',
    beds: 1,
    baths: 1,
    sqft: 1000,
    agentName: '',
    status: 'available',
    type: 'Apartment',
    tags: '',
    viewers: 0,
    postedTime: 'Just now',
    trustScore: 80,
    developer: '',
    completion: 'Ready',
    paymentPlan: '',
    referenceNumber: '',
    amenities: '',
    description: '',
    image: ''
};

const ListingFormModal: React.FC<ListingFormModalProps> = ({ isOpen, onClose, onSave, listingToEdit, isSaving }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false); // New state for upload progress

    useEffect(() => {
        if (isOpen) {
            if (listingToEdit) {
                setFormData({
                    ...listingToEdit,
                    tags: listingToEdit.tags.join(', '),
                    amenities: listingToEdit.amenities.join(', '),
                });
                setImagePreview(listingToEdit.image || null);
            } else {
                setFormData(initialFormData);
                setImagePreview(null);
            }
            setImageFile(null);
            setIsUploading(false);
        }
    }, [listingToEdit, isOpen]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            // Create a local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true); // Start loading state

        try {
            // 1. Handle Image Upload if a new file is selected
            let finalImageUrl = formData.image;
            
            if (imageFile) {
                // This uploads to the 'vibe-coding' folder using your service
                finalImageUrl = await uploadImage(imageFile);
            }

            // 2. Prepare the final data object
            const { image, ...restFormData } = formData;
            const processedData = {
                ...restFormData,
                image: finalImageUrl || '', // Ensure it's a string
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
                amenities: formData.amenities.split(',').map(amenity => amenity.trim()).filter(Boolean),
                status: formData.status as Listing['status']
            };

            // 3. Pass data to parent
            if (listingToEdit) {
                onSave({ ...processedData, id: listingToEdit.id });
            } else {
                onSave(processedData);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to save property. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };
    
    if (!isOpen) return null;

    const isLoading = isSaving || isUploading;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 pb-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold">{listingToEdit ? 'Edit Property' : 'Add New Property'}</h2>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form Fields */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="text" name="price" value={formData.price} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" value={formData.status} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="available">Available</option>
                                <option value="sold">Sold</option>
                                <option value="rented">Rented</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Beds</label>
                            <input type="number" name="beds" value={formData.beds} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Baths</label>
                            <input type="number" name="baths" value={formData.baths} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Sqft</label>
                            <input type="number" name="sqft" value={formData.sqft} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Agent Name</label>
                            <input type="text" name="agentName" value={formData.agentName} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Property Image</label>
                            <div className="mt-1 flex items-center">
                                {imagePreview && <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md mr-4" />}
                                <input type="file" name="image" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            </div>
                        </div>

                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                            <input type="text" name="tags" value={formData.tags} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                            <input type="text" name="amenities" value={formData.amenities} onChange={handleTextChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleTextChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-2 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg" disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Property'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListingFormModal;