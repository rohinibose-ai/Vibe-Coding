
import React from 'react';
import type { Listing } from '../types';
import { BedIcon, BathIcon, SqftIcon } from './icons';

interface ListingCardProps {
    listing: Listing;
    onEdit: (listing: Listing) => void;
    onDelete: (listing: Listing) => void;
}

const statusColorMap = {
    available: 'bg-green-100 text-green-800',
    sold: 'bg-red-100 text-red-800',
    rented: 'bg-blue-100 text-blue-800',
};

const ListingCard: React.FC<ListingCardProps> = ({ listing, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 duration-300 flex flex-col">
            <div className="relative">
                <img className="h-48 w-full object-cover" src={listing.image || 'https://picsum.photos/400/300'} alt={listing.title} />
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColorMap[listing.status] || 'bg-gray-100 text-gray-800'}`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </span>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <p className="text-sm text-gray-500">{listing.location}</p>
                <h3 className="text-lg font-bold text-gray-900 truncate mt-1">{listing.title}</h3>
                <p className="text-xl font-semibold text-indigo-600 my-2">{listing.price}</p>
                
                <div className="flex items-center text-gray-600 space-x-4 my-2 border-t border-b py-2">
                    <div className="flex items-center space-x-1">
                        <BedIcon className="w-5 h-5" />
                        <span>{listing.beds}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <BathIcon className="w-5 h-5" />
                        <span>{listing.baths}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <SqftIcon className="w-5 h-5" />
                        <span>{listing.sqft} sqft</span>
                    </div>
                </div>

                <div className="mt-2 flex-grow">
                     <p className="text-sm text-gray-600"><span className="font-semibold">Agent:</span> {listing.agentName}</p>
                </div>
            </div>
             <div className="p-4 bg-gray-50 border-t">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => onEdit(listing)}
                        className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(listing)}
                        className="text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
