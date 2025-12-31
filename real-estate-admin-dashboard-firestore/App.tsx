
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './services/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Listing } from './types';
import ListingGrid from './components/ListingGrid';
import ListingFormModal from './components/ListingFormModal';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
    const [listingToEdit, setListingToEdit] = useState<Listing | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);

    useEffect(() => {
        const propertiesCollection = collection(db, 'properties');
        const unsubscribe = onSnapshot(propertiesCollection, (snapshot) => {
            setIsLoading(true);
            try {
                const listingsData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data()
                } as Listing));
                setListings(listingsData);
                setError(null);
            } catch (err) {
                console.error("Error processing snapshot: ", err);
                setError("Failed to process property data.");
            } finally {
                setIsLoading(false);
            }
        }, (err) => {
            console.error("Firestore snapshot error: ", err);
            setError("Failed to fetch properties. Please check your connection and Firebase setup.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleOpenAddModal = () => {
        setListingToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (listing: Listing) => {
        setListingToEdit(listing);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteModal = (listing: Listing) => {
        setListingToDelete(listing);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsFormModalOpen(false);
        setListingToEdit(null);
        setIsDeleteModalOpen(false);
        setListingToDelete(null);
    };

    const handleSaveListing = useCallback(async (listingData: Omit<Listing, 'id'> & { id?: string }) => {
        setIsSaving(true);
        setError(null);
        try {
            // The listingData now comes complete with the image URL from the modal.
            // We just need to save it.
            if (listingData.id) {
                const { id, ...dataToUpdate } = listingData;
                const docRef = doc(db, 'properties', id);
                await updateDoc(docRef, dataToUpdate);
            } else {
                await addDoc(collection(db, 'properties'), listingData);
            }
            handleCloseModals();
        } catch (err) {
            console.error("Error saving listing: ", err);
            setError("Failed to save the property. Please check your Firestore security rules in the Firebase console.");
        } finally {
            setIsSaving(false);
        }
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!listingToDelete) return;
        try {
            await deleteDoc(doc(db, 'properties', listingToDelete.id));
            handleCloseModals();
        } catch (err) {
            console.error("Error deleting listing: ", err);
            setError("Failed to delete the property. Please try again.");
        }
    }, [listingToDelete]);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Real Estate Dashboard</h1>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-transform transform hover:scale-105"
                    >
                        + Add Property
                    </button>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
                <ListingGrid
                    listings={listings}
                    isLoading={isLoading}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                />
            </main>
            
            <ListingFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveListing}
                listingToEdit={listingToEdit}
                isSaving={isSaving}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleConfirmDelete}
                title="Delete Property"
                message={`Are you sure you want to delete the property "${listingToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default App;
