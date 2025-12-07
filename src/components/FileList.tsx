import React from 'react';
import { FileSystemItem } from '@/lib/data';
import { File, Folder } from 'lucide-react';

interface FileListProps {
  items: FileSystemItem[];
  onSelect: (item: FileSystemItem) => void;
  selectedId: string | null;
}

const FileList = ({ items, onSelect, selectedId }: FileListProps) => {
  return (
    <div className="h-full bg-white border border-gray-400 flex flex-col font-sans text-xs">
      <div className="bg-[#f0f0f0] px-2 py-1 font-bold border-b border-gray-300">
        File List
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border-r border-b border-gray-300 px-2 py-1 text-left w-8"></th>
              <th className="border-r border-b border-gray-300 px-2 py-1 text-left">Name</th>
              <th className="border-r border-b border-gray-300 px-2 py-1 text-left w-24">Size</th>
              <th className="border-b border-gray-300 px-2 py-1 text-left w-32">Date Modified</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const Icon = item.icon || (item.type === 'folder' ? Folder : File);
              const isSelected = selectedId === item.id;
              
              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer select-none ${
                    isSelected ? 'bg-[#0078d7] text-white' : 'hover:bg-[#e5f3ff] even:bg-gray-50'
                  }`}
                  onClick={() => onSelect(item)}
                >
                  <td className="border-r border-gray-200 px-2 py-1 text-center">
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-yellow-500'} />
                  </td>
                  <td className="border-r border-gray-200 px-2 py-1">{item.name}</td>
                  <td className="border-r border-gray-200 px-2 py-1">{item.size || '-'}</td>
                  <td className="px-2 py-1">{item.dateModified || '-'}</td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-4 text-center text-gray-500 italic">
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
