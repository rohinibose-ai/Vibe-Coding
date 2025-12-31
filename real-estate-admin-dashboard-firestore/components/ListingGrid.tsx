
import React from 'react';
import type { Listing } from '../types';
import ListingCard from './ListingCard';

interface ListingGridProps {
    listings: Listing[];
    isLoading: boolean;
    onEdit: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                        <div className="bg-gray-300 h-48 w-full"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                            <div className="flex justify-end pt-2">
                                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                                <div className="h-8 w-16 bg-gray-300 rounded ml-2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (listings.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-600">No Properties Found</h2>
                <p className="text-gray-500 mt-2">Get started by adding a new property listing.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
                <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default ListingGrid;
