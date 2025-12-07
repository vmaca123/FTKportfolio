import { FileText, Folder, HardDrive, Image, FileCode, User, Mail, Github } from 'lucide-react';

// TODO: Replace with your actual GitHub username
const GITHUB_USERNAME = 'vmaca123';

export type FileType = 'folder' | 'file' | 'drive' | 'repo';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  dateModified?: string;
  content?: string; // HTML or text content for the viewer
  children?: FileSystemItem[];
  icon?: any;
  contentType?: 'text' | 'code' | 'image' | 'binary';
  hash?: string; // MD5 or SHA1 hash simulation
  repoInfo?: {
    url: string;
    homepage?: string;
    language: string;
    stars: number;
    description: string;
    longDescription?: string;
    features?: string[];
    teamInfo?: string;
  };
}

export const portfolioData: FileSystemItem[] = [
  {
    id: 'root',
    name: 'Evidence Tree',
    type: 'drive',
    icon: HardDrive,
    children: [
      {
        id: 'case-info',
        name: 'Case Information',
        type: 'folder',
        children: [
          {
            id: 'about-me',
            name: 'About_Me.txt',
            type: 'file',
            size: '2 KB',
            dateModified: '2023-10-27 10:00:00',
            icon: User,
            contentType: 'text',
            hash: 'MD5: 1990-01-01-BIRTH-DAY',
            content: `
              <h1>INVESTIGATOR PROFILE</h1>
              <p><strong>Name:</strong> Minwoo</p>
              <p><strong>Role:</strong> Digital Forensics Enthusiast & Developer</p>
              <p><strong>Location:</strong> Seoul, South Korea</p>
              <br/>
              <h2>SUMMARY</h2>
              <p>Passionate about uncovering the truth through data. Skilled in web development and digital forensics. 
              I build tools and analyze artifacts to solve complex problems.</p>
            `
          },
          {
            id: 'contact',
            name: 'Contact_Info.log',
            type: 'file',
            size: '1 KB',
            dateModified: '2023-10-27 10:00:00',
            icon: Mail,
            contentType: 'text',
            hash: 'SHA1: CALL-ME-010-XXXX-XXXX',
            content: `
              <h1>CONTACT LOG</h1>
              <p><strong>Email:</strong> minwoo@example.com</p>
              <p><strong>GitHub:</strong> github.com/${GITHUB_USERNAME}</p>
              <p><strong>LinkedIn:</strong> linkedin.com/in/minwoo</p>
            `
          }
        ]
      },
      {
        id: 'projects',
        name: 'Projects',
        type: 'folder',
        children: [
          {
            id: 'dev-folder',
            name: 'Development',
            type: 'folder',
            children: [
              {
                id: 'repo-ca',
                name: 'CA',
                type: 'repo',
                size: '1.5 MB',
                dateModified: 'Updated 4 hours ago',
                icon: Github,
                contentType: 'text',
                hash: 'MD5: GITHUB-REPO-CA',
                repoInfo: {
                  url: `https://github.com/${GITHUB_USERNAME}/CA`,
                  language: 'TypeScript',
                  stars: 0,
                  description: 'Certificate Authority management system.'
                },
                content: `
                  <h1>CA</h1>
                  <p>Certificate Authority management system built with TypeScript.</p>
                  <h2>Stack</h2>
                  <ul>
                    <li>TypeScript</li>
                    <li>Node.js</li>
                    <li>OpenSSL</li>
                  </ul>
                `
              },
              {
                id: 'repo-qrproject',
                name: 'qrproject',
                type: 'repo',
                size: '850 KB',
                dateModified: 'Updated last week',
                icon: Github,
                contentType: 'text',
                hash: 'MD5: GITHUB-REPO-QR',
                repoInfo: {
                  url: `https://github.com/${GITHUB_USERNAME}/qrproject`,
                  language: 'TypeScript',
                  stars: 1,
                  description: 'QR Code generation and scanning utility.'
                },
                content: `
                  <h1>qrproject</h1>
                  <p>A simple QR code generator and scanner.</p>
                `
              },
              {
                id: 'repo-crud1',
                name: 'crud1',
                type: 'repo',
                size: '2.1 MB',
                dateModified: 'Updated 2 weeks ago',
                icon: Github,
                contentType: 'text',
                hash: 'MD5: GITHUB-REPO-CRUD1',
                repoInfo: {
                  url: `https://github.com/${GITHUB_USERNAME}/crud1`,
                  language: 'TypeScript',
                  stars: 0,
                  description: 'Basic CRUD application boilerplate.'
                },
                content: `
                  <h1>crud1</h1>
                  <p>Standard CRUD operations implementation.</p>
                `
              },
              {
                id: 'repo-mongoportfolio',
                name: 'mongoporfolio',
                type: 'repo',
                size: '3.2 MB',
                dateModified: 'Updated on Oct 20',
                icon: Github,
                contentType: 'text',
                hash: 'MD5: GITHUB-REPO-MONGO',
                repoInfo: {
                  url: `https://github.com/${GITHUB_USERNAME}/mongoporfolio`,
                  language: 'TypeScript',
                  stars: 2,
                  description: 'Portfolio site backend using MongoDB.'
                },
                content: `
                  <h1>mongoporfolio</h1>
                  <p>Backend service for portfolio data management.</p>
                `
              },
              {
                id: 'repo-clerk',
                name: 'clerk',
                type: 'repo',
                size: '1.8 MB',
                dateModified: 'Updated on Oct 14',
                icon: Github,
                contentType: 'text',
                hash: 'MD5: GITHUB-REPO-CLERK',
                repoInfo: {
                  url: `https://github.com/${GITHUB_USERNAME}/clerk`,
                  language: 'TypeScript',
                  stars: 0,
                  description: 'Clerk authentication integration example.'
                },
                content: `
                  <h1>clerk</h1>
                  <p>Integration with Clerk for user management.</p>
                `
              }
            ]
          },
          {
            id: 'forensics-folder',
            name: 'Forensics',
            type: 'folder',
            children: [
              {
                id: 'proj-2',
                name: 'Memory_Analyzer.py',
                type: 'file',
                size: '45 KB',
                dateModified: '2023-09-15 09:15:00',
                icon: FileCode,
                contentType: 'code',
                hash: 'SHA1: PYTHON-VOLATILITY-PLUGIN',
                content: `
# Project: Memory Dump Analyzer
# Description: Automates malware artifact extraction

import volatility.plugins.common as common
import volatility.utils as utils

class MalwareFinder(common.AbstractWindowsCommand):
    """ Finds hidden processes in memory dumps """
    
    def calculate(self):
        addr_space = utils.load_as(self._config)
        tasks = win32.tasks.pslist(addr_space)
        
        for task in tasks:
            if task.is_suspicious():
                yield task

# Status: Completed
# Impact: Reduced analysis time by 40%
                `
              }
            ]
          },
          {
            id: 'crypto-folder',
            name: 'Cryptography',
            type: 'folder',
            children: [
              {
                id: 'proj-3',
                name: 'AES_Implementation.cpp',
                type: 'file',
                size: '12 KB',
                dateModified: '2023-08-20 11:00:00',
                icon: FileCode,
                contentType: 'code',
                hash: 'SHA256: CRYPTO-AES-256-CBC',
                content: `
// Project: Custom AES-256 Implementation
// Language: C++

#include <iostream>
#include <vector>
#include "aes.h"

class AES256 {
private:
    std::vector<unsigned char> key;
    
public:
    AES256(const std::vector<unsigned char>& k) : key(k) {}
    
    std::vector<unsigned char> encrypt(const std::vector<unsigned char>& plaintext) {
        // SubBytes, ShiftRows, MixColumns, AddRoundKey
        // ... implementation details ...
        return plaintext; // Placeholder
    }
};

int main() {
    std::cout << "Initializing Cryptographic Engine..." << std::endl;
    return 0;
}
                `
              }
            ]
          }
        ]
      },
      {
        id: 'skills',
        name: 'Skills',
        type: 'folder',
        children: [
          {
            id: 'skill-frontend',
            name: 'Frontend_Dev.dll',
            type: 'file',
            size: '500 KB',
            dateModified: '2023-01-01 00:00:00',
            contentType: 'binary',
            hash: 'MD5: SKILL-SET-FRONTEND-V1',
            content: `
              <h1>LIBRARY: Frontend Development</h1>
              <ul>
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>HTML5 / CSS3</li>
              </ul>
            `
          },
          {
            id: 'skill-forensics',
            name: 'Forensics.sys',
            type: 'file',
            size: '1.2 MB',
            dateModified: '2023-01-01 00:00:00',
            contentType: 'binary',
            hash: 'MD5: SKILL-SET-FORENSICS-V2',
            content: `
              <h1>SYSTEM DRIVER: Digital Forensics</h1>
              <ul>
                <li>Disk Forensics (EnCase, FTK)</li>
                <li>Memory Forensics (Volatility)</li>
                <li>Network Forensics (Wireshark)</li>
                <li>Malware Analysis</li>
              </ul>
            `
          }
        ]
      }
    ]
  }
];
