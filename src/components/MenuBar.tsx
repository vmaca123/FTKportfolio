'use client';

import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { ShieldCheck } from 'lucide-react';

interface MenuBarProps {
  onIntegrityCheck?: () => void;
}

const MenuBar = ({ onIntegrityCheck }: MenuBarProps) => {
  const { data: session } = useSession();
  const menus = ['File', 'View', 'Mode', 'Evidence', 'Help'];

  return (
    <div className="bg-[#f0f0f0] border-b border-gray-400 flex justify-between items-center text-xs select-none overflow-x-auto whitespace-nowrap">
      <div className="flex shrink-0">
        {menus.map((menu) => (
          <div
            key={menu}
            className="px-2 py-1 hover:bg-[#3399ff] hover:text-white cursor-pointer"
          >
            {menu}
          </div>
        ))}
      </div>
      <div className="px-2 flex items-center gap-2 shrink-0">
        {session && (
          <button 
            onClick={onIntegrityCheck}
            className="flex items-center gap-1 px-2 py-0.5 bg-green-100 hover:bg-green-200 border border-green-400 text-green-800 rounded text-xs mr-2"
            title="Verify Chain of Custody"
          >
            <ShieldCheck size={12} />
            Verify Integrity
          </button>
        )}
        {!session ? (
          <button 
            onClick={() => signIn()}
            className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded text-xs"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="User" 
                className="w-5 h-5 rounded-full"
              />
            )}
            <span>{session.user?.name}</span>
            <button 
              onClick={() => signOut()}
              className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded text-xs"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuBar;
