import React from 'react';

interface StatusBarProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  isAdmin?: boolean;
}

const StatusBar = ({ user, isAdmin }: StatusBarProps) => {
  return (
    <div className="bg-[#f0f0f0] border-t border-gray-400 px-2 py-0.5 text-xs flex justify-between text-gray-600 select-none overflow-x-auto whitespace-nowrap gap-4">
      <div className="flex gap-4">
        <span className="font-bold">{user ? `USER: ${user.name || user.email}` : 'GUEST SESSION'}</span>
        <span className={`${isAdmin ? 'text-red-600 font-bold' : 'text-blue-600'}`}>
          CLEARANCE: {isAdmin ? 'LEVEL 5 (TOP SECRET)' : user ? 'LEVEL 2 (INVESTIGATOR)' : 'LEVEL 1 (PUBLIC)'}
        </span>
      </div>
      <div className="flex gap-4">
        <span>Ln 1, Col 1</span>
        <span>INS</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default StatusBar;
