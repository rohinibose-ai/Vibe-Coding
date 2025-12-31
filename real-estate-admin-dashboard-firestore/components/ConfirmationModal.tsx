
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <p className="mt-2 text-gray-600">{message}</p>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end space-x-2 border-t">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
