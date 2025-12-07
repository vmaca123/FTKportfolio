import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Save, 
  Printer, 
  Search, 
  HelpCircle, 
  Monitor, 
  Database,
  RefreshCw,
  Activity
} from 'lucide-react';

interface ToolbarProps {
  onAddEvidence: () => void;
  onRemoveEvidence?: () => void;
  onSync?: () => void;
  onRestore?: () => void;
  onSearch?: (query: string) => void;
  onTimeline?: () => void;
}

const Toolbar = ({ onAddEvidence, onRemoveEvidence, onSync, onRestore, onSearch, onTimeline }: ToolbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const tools = [
    { icon: Plus, label: 'Add Evidence Item', action: onAddEvidence },
    { icon: X, label: 'Remove Evidence Item', action: onRemoveEvidence },
    { icon: RefreshCw, label: 'Restore Item', action: onRestore },
    { type: 'separator' },
    { icon: Activity, label: 'Timeline Reconstruction', action: onTimeline },
    { type: 'separator' },
    { icon: Save, label: 'Save' },
    { icon: Printer, label: 'Print' },
    { type: 'separator' },
    { icon: Monitor, label: 'View' },
    { icon: Database, label: 'Sync GitHub', action: onSync },
    { type: 'separator' },
    { icon: HelpCircle, label: 'Help' },
  ];

  return (
    <div className="bg-[#f0f0f0] border-b border-gray-400 p-1 flex items-center space-x-1">
      {tools.map((tool, index) => {
        if (tool.type === 'separator') {
          return <div key={index} className="w-[1px] h-5 bg-gray-400 mx-1" />;
        }
        const Icon = tool.icon!;
        return (
          <button
            key={index}
            className="p-1 hover:bg-gray-300 rounded border border-transparent hover:border-gray-400 active:bg-gray-400 active:border-gray-500"
            title={tool.label}
            onClick={tool.action}
          >
            <Icon size={16} className="text-gray-700" />
          </button>
        );
      })}
      
      <div className="w-[1px] h-5 bg-gray-400 mx-1" />
      
      <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-gray-300 rounded px-1 h-6">
        <Search size={12} className="text-gray-500 mr-1" />
        <input 
          type="text" 
          placeholder="Search Evidence..." 
          className="text-xs outline-none w-40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Toolbar;
