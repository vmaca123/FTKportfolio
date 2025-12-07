import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

interface LogEntry {
  id: number | string;
  timestamp: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'system';
}

interface ActionLogProps {
  logs: LogEntry[];
}

const ActionLog = ({ logs: localLogs }: ActionLogProps) => {
  const { data: session } = useSession();
  const endRef = useRef<HTMLDivElement>(null);
  const [dbLogs, setDbLogs] = useState<LogEntry[]>([]);

  // Fetch logs from DB on mount if logged in
  useEffect(() => {
    if (session?.user) {
      fetch('/api/logs')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formattedLogs = data.map((log: any) => ({
              id: log._id,
              timestamp: new Date(log.timestamp).toLocaleTimeString(),
              message: `${log.action}: ${log.details}`,
              type: 'info' as const
            })).reverse(); 
            setDbLogs(formattedLogs);
          }
        });
    }
  }, [session]);

  // Combine logs: DB logs + Local User Actions
  // Filter out local logs that might already be in dbLogs to avoid duplicates
  const allLogs = [...dbLogs, ...localLogs.filter(l => !dbLogs.find(d => d.message === l.message && d.timestamp === l.timestamp))];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localLogs, dbLogs]);

  return (
    <div className="h-full bg-white border border-gray-400 flex flex-col font-sans text-xs">
      <div className="bg-[#f0f0f0] px-2 py-1 font-bold border-b border-gray-300 flex justify-between">
        <span>Processing Log</span>
        {session && <span className="text-green-600 text-[10px] flex items-center">● Live Sync</span>}
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {allLogs.map((log, i) => (
          <div key={i} className="border-b border-gray-100 last:border-0 pb-1">
            <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ActionLog;
