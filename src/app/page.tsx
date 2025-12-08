'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Github } from 'lucide-react';
import MenuBar from '@/components/MenuBar';
import Toolbar from '@/components/Toolbar';
import EvidenceTree from '@/components/EvidenceTree';
import FileList from '@/components/FileList';
import DataViewer from '@/components/DataViewer';
import StatusBar from '@/components/StatusBar';
import ActionLog from '@/components/ActionLog';
import AddEvidenceModal from '@/components/AddEvidenceModal';
import FileRecoveryTool from '@/components/FileRecoveryTool';
import { portfolioData, FileSystemItem } from '@/lib/data';

export default function Home() {
  const { data: session } = useSession();
  const [treeData, setTreeData] = useState<FileSystemItem[]>(portfolioData);
  const [selectedTreeItem, setSelectedTreeItem] = useState<FileSystemItem | null>(portfolioData[0]);
  const [selectedFileItem, setSelectedFileItem] = useState<FileSystemItem | null>(null);
  const [fileListItems, setFileListItems] = useState<FileSystemItem[]>([]);
  const [logs, setLogs] = useState<{id: number, timestamp: string, message: string}[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [specialMode, setSpecialMode] = useState<'timeline' | 'search' | 'recovery' | null>(null);
  const [specialData, setSpecialData] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    languages: {} as Record<string, number>,
    recentUpdate: ''
  });

  const handleSearch = async (query: string) => {
    addLog(`User initiated search for: ${query}`);
    setSpecialMode('search');
    setSpecialData({ query, repos: [], logs: [] }); 
    setSelectedFileItem(null);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSpecialData({ query, repos: data.repos, logs: data.logs });
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleTimeline = async () => {
    addLog(`User accessed Timeline Reconstruction`);
    setSpecialMode('timeline');
    setSpecialData([]); 
    setSelectedFileItem(null);
    
    try {
      const res = await fetch('/api/timeline');
      const data = await res.json();
      setSpecialData(data);
    } catch (error) {
      console.error("Timeline fetch failed", error);
    }
  };

  const handleRecovery = () => {
    addLog(`User accessed File Recovery Tool`);
    setSpecialMode('recovery');
    setSelectedFileItem(null);
  };

  const handleIntegrityCheck = async () => {
    addLog(`User initiated Global Integrity Verification`);
    try {
      const res = await fetch('/api/integrity');
      const data = await res.json();
      
      if (data.valid) {
        alert(`[SYSTEM MESSAGE]\n\nINTEGRITY VERIFIED\n\nChain of Custody is intact.\nTotal Logs Verified: ${data.totalLogs}`);
      } else {
        alert(`[SYSTEM WARNING]\n\nINTEGRITY COMPROMISED\n\nChain broken at index: ${data.brokenAtIndex}\nPotential tampering detected.`);
      }
    } catch (error) {
      console.error("Integrity check failed", error);
    }
  };

  const addLog = (message: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [...prev, { id: Date.now(), timestamp, message }]);

    // Persist to DB
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'USER_ACTION',
        details: message
      })
    }).catch(err => console.error("Failed to save log", err));
  };

  const fetchRepos = async () => {
    try {
      const res = await fetch('/api/repos', { cache: 'no-store' });
      const data = await res.json();
      const repos = data.repos || [];
      const currentIsAdmin = data.isAdmin;
      setIsAdmin(currentIsAdmin);
      
      // Separate active and hidden repos
      const activeRepos = repos.filter((r: any) => r.isVisible !== false);
      const hiddenRepos = repos.filter((r: any) => r.isVisible === false);

      const createRepoItem = (repo: any) => {
        const date = new Date(repo.updatedAt);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

        // Format size (GitHub API returns size in KB)
        let formattedSize = '-';
        if (repo.size) {
            if (repo.size >= 1024) {
                formattedSize = `${(repo.size / 1024).toFixed(1)} MB`;
            } else {
                formattedSize = `${repo.size} KB`;
            }
        }

        return {
          id: repo._id,
          name: repo.name,
          type: 'repo',
          icon: Github,
          size: formattedSize,
          dateModified: formattedDate,
          repoInfo: {
            url: repo.url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stars,
            description: repo.description,
            longDescription: repo.longDescription,
            features: repo.features,
            teamInfo: repo.teamInfo
          }
        };
      };

      const activeRepoItems: FileSystemItem[] = activeRepos.map(createRepoItem);
      const hiddenRepoItems: FileSystemItem[] = hiddenRepos.map(createRepoItem);

      // Calculate Stats
      const allRepos = [...activeRepos, ...hiddenRepos];
      const stats = {
        totalRepos: allRepos.length,
        totalStars: allRepos.reduce((acc: number, r: any) => acc + (r.stars || 0), 0),
        languages: allRepos.reduce((acc: any, r: any) => {
          const lang = r.language || 'Unknown';
          acc[lang] = (acc[lang] || 0) + 1;
          return acc;
        }, {}),
        recentUpdate: allRepos.length > 0 ? new Date(Math.max(...allRepos.map((r: any) => new Date(r.updatedAt).getTime()))).toLocaleString() : '-'
      };
      setDashboardStats(stats);

      // Update selectedFileItem if it exists and was updated
      setSelectedFileItem(prev => {
          if (!prev) return prev;
          const updated = [...activeRepoItems, ...hiddenRepoItems].find(item => item.id === prev.id);
          return updated || prev;
      });

      setTreeData(prevData => {
        const findNode = (nodes: FileSystemItem[], id: string): FileSystemItem | undefined => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.children) {
                    const found = findNode(node.children, id);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const updateNode = (nodes: FileSystemItem[]): FileSystemItem[] => {
          return nodes.map(node => {
            if (node.id === 'dev-folder') {
               const originalDev = findNode(portfolioData, 'dev-folder');
               const staticChildren = originalDev?.children || [];
               
               // Filter out static items if we have a dynamic record for them (whether active or hidden)
               // This prevents duplicates if a repo is in Recycle Bin (hidden) but also exists as static data
               const allRepoNames = new Set(repos.map((r: any) => r.name));
               const filteredStatic = staticChildren.filter(child => !allRepoNames.has(child.name));

               return {
                 ...node,
                 children: [...filteredStatic, ...activeRepoItems]
               };
            }
            // Add Recycle Bin logic
            if (node.id === 'root') {
                const hasRecycleBin = node.children?.some(c => c.id === 'recycle-bin');
                let newChildren = node.children ? updateNode(node.children) : [];
                
                if (currentIsAdmin) {
                    if (!hasRecycleBin) {
                        newChildren.push({
                            id: 'recycle-bin',
                            name: 'Recycle Bin',
                            type: 'folder',
                            children: hiddenRepoItems
                        });
                    } else {
                        newChildren = newChildren.map(c => {
                            if (c.id === 'recycle-bin') {
                                return { ...c, children: hiddenRepoItems };
                            }
                            return c;
                        });
                    }
                } else {
                    newChildren = newChildren.filter(c => c.id !== 'recycle-bin');
                }
                return { ...node, children: newChildren };
            }

            if (node.children) {
              return {
                ...node,
                children: updateNode(node.children)
              };
            }
            return node;
          });
        };

        return updateNode(prevData);
      });
      
    } catch (error) {
      console.error("Failed to fetch repos", error);
    }
  };

  // Initial log and fetch
  useEffect(() => {
    addLog('System initialized. Ready for evidence acquisition.');
    fetchRepos();
  }, []);

  // Update file list when tree selection changes
  useEffect(() => {
    if (selectedTreeItem) {
      addLog(`User navigated to: ${selectedTreeItem.name}`);
      if (selectedTreeItem.children) {
        setFileListItems(selectedTreeItem.children);
      } else {
        setFileListItems([]);
      }
      
      if (selectedTreeItem.type === 'file' || selectedTreeItem.type === 'repo') {
        setSelectedFileItem(selectedTreeItem);
        
        // Check for recovery tool in tree selection
        if (selectedTreeItem.id === 'tool-recovery') {
          setSpecialMode('recovery');
        } else {
          if (specialMode === 'recovery') {
            setSpecialMode(null);
          }
        }
      } else {
        setSelectedFileItem(null);
        // Reset special mode if navigating away from the tool to a folder
        if (specialMode === 'recovery') {
            setSpecialMode(null);
        }
      }
    }
  }, [selectedTreeItem]);

  const handleTreeSelect = (item: FileSystemItem) => {
    setSelectedTreeItem(item);
  };

  const handleFileSelect = (item: FileSystemItem) => {
    setSelectedFileItem(item);
    addLog(`User viewed file: ${item.name}`);

    if (item.id === 'tool-recovery') {
      setSpecialMode('recovery');
    } else {
      if (specialMode === 'recovery') {
        setSpecialMode(null);
      }
    }
  };

  const handleSync = async () => {
    if (!session) {
      addLog("Sync failed: Authentication required.");
      return;
    }
    addLog("Syncing with GitHub...");
    try {
      const res = await fetch('/api/repos', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        addLog(data.message || "GitHub Sync Complete.");
        fetchRepos();
      } else {
        addLog("GitHub Sync Failed: Unauthorized or Error.");
      }
    } catch (e) {
      addLog("GitHub Sync Error.");
    }
  };

  const handleDelete = async () => {
    if (!selectedFileItem) {
        addLog("No item selected to delete.");
        return;
    }
    if (selectedFileItem.type !== 'repo') {
        addLog("Only repositories can be deleted.");
        return;
    }
    
    if (!confirm(`Delete repository ${selectedFileItem.name}?`)) return;

    addLog(`Deleting repository: ${selectedFileItem.name}...`);
    try {
      const res = await fetch(`/api/repos/${selectedFileItem.id}`, { method: 'DELETE' });
      if (res.ok) {
        addLog("Repository deleted (Moved to Recycle Bin).");
        fetchRepos();
        setSelectedFileItem(null);
      } else {
        const errData = await res.json();
        addLog(`Delete failed: ${errData.error || "Unauthorized?"}`);
      }
    } catch (e) {
      addLog("Delete error.");
    }
  };

  const handleRestore = async () => {
    if (!selectedFileItem) {
        addLog("No item selected to restore.");
        return;
    }
    if (selectedFileItem.type !== 'repo') {
        addLog("Only repositories can be restored.");
        return;
    }
    
    addLog(`Restoring repository: ${selectedFileItem.name}...`);
    try {
      const res = await fetch(`/api/repos/${selectedFileItem.id}`, { method: 'PATCH' });
      if (res.ok) {
        addLog("Repository restored.");
        fetchRepos();
        setSelectedFileItem(null);
      } else {
        addLog("Restore failed. Unauthorized?");
      }
    } catch (e) {
      addLog("Restore error.");
    }
  };

  const handleAddEvidence = (type: string) => {
    setIsModalOpen(false);
    let message = '';
    switch (type) {
      case 'physical':
        message = 'Acquiring Physical Drive (Resume)... Download started.';
        // Trigger download or open link here
        window.open('/resume.pdf', '_blank'); // Placeholder
        break;
      case 'logical':
        message = 'Mounting Logical Drive (GitHub)... Redirecting.';
        window.open('https://github.com', '_blank');
        break;
      case 'image':
        message = 'Loading Image File (LinkedIn)... Redirecting.';
        window.open('https://linkedin.com', '_blank');
        break;
      case 'folder':
        message = 'Accessing Folder Content (Email)... Opening mail client.';
        window.location.href = 'mailto:minwoo@example.com';
        break;
    }
    addLog(message);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-200 overflow-hidden text-gray-900">
      <MenuBar onIntegrityCheck={handleIntegrityCheck} />
      <Toolbar 
        onAddEvidence={() => setIsModalOpen(true)} 
        onSync={handleSync}
        onRemoveEvidence={handleDelete}
        onRestore={handleRestore}
        onSearch={handleSearch}
        onTimeline={handleTimeline}
      />
      
      <div className="flex-1 flex overflow-hidden p-1 space-x-1">
        {/* Left Pane: Evidence Tree */}
        <div className="w-1/4 min-w-[200px] flex flex-col">
          <EvidenceTree 
            data={treeData} 
            onSelect={handleTreeSelect} 
            selectedId={selectedTreeItem?.id || null} 
          />
        </div>

        {/* Right Pane: Split View */}
        <div className="flex-1 flex flex-col space-y-1 overflow-hidden">
          {/* Top Right: File List */}
          {(!specialMode && fileListItems.length > 0) && (
            <div className="h-1/3 min-h-[100px]">
              <FileList 
                items={fileListItems} 
                onSelect={handleFileSelect} 
                selectedId={selectedFileItem?.id || null} 
              />
            </div>
          )}

          {/* Middle Right: Data Viewer */}
          <div className="flex-1 min-h-[100px]">
            {specialMode === 'recovery' ? (
              <FileRecoveryTool />
            ) : (
              <DataViewer 
                item={selectedFileItem} 
                isAdmin={isAdmin} 
                onUpdate={fetchRepos} 
                dashboardStats={dashboardStats}
                specialMode={specialMode as 'timeline' | 'search' | null}
                specialData={specialData}
              />
            )}
          </div>

          {/* Bottom Right: Action Log */}
          <div className="h-32 min-h-[80px]">
            <ActionLog logs={logs} />
          </div>
        </div>
      </div>

      <StatusBar 
        user={session?.user} 
        isAdmin={isAdmin} 
      />
      
      <AddEvidenceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEvidence} 
      />
    </div>
  );
}
