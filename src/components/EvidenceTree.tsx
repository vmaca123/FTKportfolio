import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, HardDrive } from 'lucide-react';
import { FileSystemItem } from '@/lib/data';

interface EvidenceTreeProps {
  data: FileSystemItem[];
  onSelect: (item: FileSystemItem) => void;
  selectedId: string | null;
}

const TreeNode = ({ item, onSelect, selectedId, level = 0 }: { item: FileSystemItem, onSelect: (item: FileSystemItem) => void, selectedId: string | null, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item);
  };

  const Icon = item.icon || (item.type === 'folder' ? Folder : File);

  return (
    <div>
      <div
        className={`flex items-center py-[1px] cursor-pointer select-none whitespace-nowrap ${
          selectedId === item.id ? 'bg-[#0078d7] text-white' : 'hover:bg-[#e5f3ff]'
        }`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={handleSelect}
      >
        <div className="w-4 h-4 flex items-center justify-center mr-1" onClick={hasChildren ? handleToggle : undefined}>
          {hasChildren && (
            isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
        </div>
        <Icon size={16} className={`mr-1 ${selectedId === item.id ? 'text-white' : 'text-yellow-500'}`} />
        <span className="text-xs">{item.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              onSelect={onSelect}
              selectedId={selectedId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EvidenceTree = ({ data, onSelect, selectedId }: EvidenceTreeProps) => {
  const [isRootOpen, setIsRootOpen] = useState(true);

  return (
    <div className="h-full bg-white border border-gray-400 overflow-auto font-sans">
      <div 
        className="bg-[#f0f0f0] px-2 py-1 text-xs font-bold border-b border-gray-300 flex items-center cursor-pointer select-none"
        onClick={() => setIsRootOpen(!isRootOpen)}
      >
        {isRootOpen ? <ChevronDown size={14} className="mr-1"/> : <ChevronRight size={14} className="mr-1"/>}
        Evidence Tree
      </div>
      {isRootOpen && (
        <div className="p-1">
          {data.map((item) => (
            <TreeNode key={item.id} item={item} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceTree;
