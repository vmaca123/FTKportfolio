import React from 'react';
import { X, HardDrive, Folder, File } from 'lucide-react';

interface AddEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: string) => void;
}

const AddEvidenceModal = ({ isOpen, onClose, onAdd }: AddEvidenceModalProps) => {
  if (!isOpen) return null;

  const options = [
    { id: 'physical', label: 'Physical Drive', desc: 'Download Resume (PDF)', icon: HardDrive },
    { id: 'logical', label: 'Logical Drive', desc: 'Visit GitHub Profile', icon: HardDrive },
    { id: 'image', label: 'Image File', desc: 'Visit LinkedIn Profile', icon: File },
    { id: 'folder', label: 'Contents of a Folder', desc: 'Send Email', icon: Folder },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-sans text-xs">
      <div className="bg-[#f0f0f0] border border-gray-400 shadow-xl w-[90%] max-w-md">
        <div className="bg-gradient-to-r from-[#0078d7] to-[#005a9e] text-white px-2 py-1 flex justify-between items-center">
          <span>Add Evidence</span>
          <button onClick={onClose} className="hover:bg-white/20 rounded p-0.5">
            <X size={14} />
          </button>
        </div>
        
        <div className="p-4 bg-white">
          <p className="mb-4">Select the source type of evidence to add:</p>
          
          <div className="space-y-2">
            {options.map((opt) => (
              <div 
                key={opt.id}
                className="flex items-center p-2 border border-transparent hover:bg-[#e5f3ff] hover:border-[#cce8ff] cursor-pointer"
                onClick={() => onAdd(opt.id)}
              >
                <div className="mr-3 text-gray-600">
                  <opt.icon size={24} />
                </div>
                <div>
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-gray-500">{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2 flex justify-end space-x-2 bg-[#f0f0f0] border-t border-gray-300">
          <button 
            className="px-4 py-1 border border-gray-400 bg-white hover:bg-gray-100 shadow-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvidenceModal;
