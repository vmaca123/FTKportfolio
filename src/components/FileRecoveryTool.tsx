import React, { useState } from 'react';
import { Upload, FileSearch, CheckCircle, AlertTriangle, FileImage, FileText, File } from 'lucide-react';

const FileRecoveryTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState('jpg');
  const [isRecovering, setIsRecovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recoveredFiles, setRecoveredFiles] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setRecoveredFiles([]);
      setProgress(0);
    }
  };

  const handleRecover = () => {
    if (!file) return;
    setIsRecovering(true);
    setProgress(0);
    setRecoveredFiles([]);

    // Simulate recovery process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsRecovering(false);
        generateRecoveredFiles();
      }
      setProgress(currentProgress);
    }, 200);
  };

  const generateRecoveredFiles = () => {
    // Simulate finding files based on the selected type
    const count = Math.floor(Math.random() * 5) + 1;
    const newFiles = [];
    for (let i = 0; i < count; i++) {
      newFiles.push({
        id: i,
        name: `recovered_file_${i + 1}.${fileType}`,
        size: `${(Math.random() * 2 + 0.5).toFixed(2)} MB`,
        status: 'Recovered',
        integrity: 'Good'
      });
    }
    setRecoveredFiles(newFiles);
  };

  return (
    <div className="p-6 bg-white h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FileSearch className="mr-2" /> File Recovery & Carving
      </h2>
      
      <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">1. Select Disk Image / Source File</label>
          <div className="flex items-center">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">2. Select Target File Signature</label>
          <select 
            value={fileType} 
            onChange={(e) => setFileType(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full max-w-xs"
          >
            <option value="jpg">JPEG Image (FF D8 FF)</option>
            <option value="png">PNG Image (89 50 4E 47)</option>
            <option value="pdf">PDF Document (%PDF)</option>
            <option value="txt">Text File (ASCII/UTF-8)</option>
          </select>
        </div>

        <button 
          onClick={handleRecover}
          disabled={!file || isRecovering}
          className={`px-4 py-2 rounded font-bold text-white ${!file || isRecovering ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isRecovering ? 'Carving...' : 'Start Recovery'}
        </button>
      </div>

      {isRecovering && (
        <div className="mb-6">
          <div className="text-sm font-bold mb-1">Scanning Sectors... {Math.round(progress)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {recoveredFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-2">Recovered Artifacts</h3>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Filename</th>
                <th className="border border-gray-300 p-2 text-left">Size</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Integrity</th>
              </tr>
            </thead>
            <tbody>
              {recoveredFiles.map(f => (
                <tr key={f.id}>
                  <td className="border border-gray-300 p-2 flex items-center">
                    {fileType === 'jpg' || fileType === 'png' ? <FileImage size={16} className="mr-2 text-blue-500"/> : <FileText size={16} className="mr-2 text-gray-500"/>}
                    {f.name}
                  </td>
                  <td className="border border-gray-300 p-2">{f.size}</td>
                  <td className="border border-gray-300 p-2 text-green-600 font-bold">{f.status}</td>
                  <td className="border border-gray-300 p-2 flex items-center">
                    <CheckCircle size={14} className="mr-1 text-green-500" /> {f.integrity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileRecoveryTool;