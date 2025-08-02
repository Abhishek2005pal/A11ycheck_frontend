'use client'

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  Mail,
  Plus,
  Search,
  Settings,
  Share2,
  UserPlus,
  Users,
  UserX
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// TypeScript interfaces
interface Member {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
}

interface Team {
  _id: string;
  name: string;
  code: string;
  members: Member[];
  sharedScans: string[];
}

interface Scan {
  _id: string;
  url: string;
  issues: number;
  score: number;
  assignedTo: string | null;
  assignedToName: string | null;
  status: 'unassigned' | 'in-progress' | 'completed';
  createdAt: string;
}

interface InviteData {
  type: 'email' | 'link';
  email?: string;
}

// Component Props Interfaces
interface TeamOverviewCardProps {
  team: Team;
  onInvite: () => void;
}

interface MemberListProps {
  members: Member[];
  currentUserId?: string;
  onRemoveMember: (memberId: string) => void;
}

interface InviteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (inviteData: InviteData) => void;
}

interface AssignedScansTableProps {
  scans: Scan[];
  members: Member[];
  onAssignScan: (scan: Scan) => void;
  onViewScan: (scan: Scan) => void;
}

interface AssignScanModalProps {
  isOpen: boolean;
  scan: Scan | null;
  members: Member[];
  onClose: () => void;
  onAssign: (scanId: string, memberId: string) => void;
}

// Mock data - replace with actual API calls
const mockTeam: Team = {
  _id: 'team1',
  name: 'Web Security Team',
  code: 'WST-2024',
  members: [
    { _id: 'u1', name: 'John Doe', email: 'john@company.com', role: 'admin', avatar: 'JD' },
    { _id: 'u2', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'member', avatar: 'SW' },
    { _id: 'u3', name: 'Mike Chen', email: 'mike@company.com', role: 'member', avatar: 'MC' }
  ],
  sharedScans: ['scan1', 'scan2', 'scan3']
};

const mockScans: Scan[] = [
  {
    _id: 'scan1',
    url: 'https://example.com',
    issues: 12,
    score: 75,
    assignedTo: 'u2',
    assignedToName: 'Sarah Wilson',
    status: 'in-progress',
    createdAt: '2024-06-20T10:00:00Z'
  },
  {
    _id: 'scan2',
    url: 'https://mystore.com',
    issues: 8,
    score: 85,
    assignedTo: 'u3',
    assignedToName: 'Mike Chen',
    status: 'completed',
    createdAt: '2024-06-19T14:30:00Z'
  },
  {
    _id: 'scan3',
    url: 'https://blog.site.com',
    issues: 15,
    score: 65,
    assignedTo: null,
    assignedToName: null,
    status: 'unassigned',
    createdAt: '2024-06-21T09:15:00Z'
  }
];

const TeamOverviewCard: React.FC<TeamOverviewCardProps> = ({ team, onInvite }) => {
  const [copied, setCopied] = useState(false);

  const copyTeamCode = (): void => {
    navigator.clipboard.writeText(team.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Team Code:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{team.code}</code>
            <button
              onClick={copyTeamCode}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy team code"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <button
          onClick={onInvite}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{team.members.length}</div>
          <div className="text-sm text-gray-600">Team Members</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{team.sharedScans.length}</div>
          <div className="text-sm text-gray-600">Shared Scans</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {mockScans.filter(s => s.assignedTo).length}
          </div>
          <div className="text-sm text-gray-600">Assigned Tasks</div>
        </div>
      </div>
    </div>
  );
};

const MemberList: React.FC<MemberListProps> = ({ members, currentUserId = 'u1', onRemoveMember }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members
        </h3>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {member.avatar}
              </div>
              <div>
                <div className="font-medium text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.email}</div>
              </div>
              {member.role === 'admin' && (
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Admin
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                {mockScans.filter(s => s.assignedTo === member._id).length} tasks
              </div>
              {member._id !== currentUserId && (
                <button
                  onClick={() => onRemoveMember(member._id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                  title="Remove member"
                >
                  <UserX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InviteForm: React.FC<InviteFormProps> = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [activeTab, setActiveTab] = useState('email');

  useEffect(() => {
    if (isOpen) {
      // Generate invite link
      setInviteLink(`${window.location.origin}/join/WST-2024`);
    }
  }, [isOpen]);

  const handleEmailInvite = (): void => {
    if (email.trim()) {
      onInvite({ type: 'email', email });
      setEmail('');
      onClose();
    }
  };

  const copyInviteLink = (): void => {
    navigator.clipboard.writeText(inviteLink);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Invite Team Member</h3>
          
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('email')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'email' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              Email Invite
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'link' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500'
              }`}
            >
              Share Link
            </button>
          </div>

          {activeTab === 'email' ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="colleague@company.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailInvite}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.share({ 
                      title: 'Join our team', 
                      url: inviteLink 
                    }).catch(() => copyInviteLink());
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignedScansTable: React.FC<AssignedScansTableProps> = ({ scans, members, onAssignScan, onViewScan }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'unassigned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'unassigned': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesFilter = filter === 'all' || scan.status === filter;
    const matchesSearch = scan.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Shared Scans</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Scan
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="unassigned">Unassigned</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">URL</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Issues</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned To</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredScans.map((scan) => (
              <tr key={scan._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{scan.url}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {scan.issues} issues
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          scan.score >= 80 ? 'bg-green-500' : 
                          scan.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${scan.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{scan.score}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {scan.assignedToName ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {scan.assignedToName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{scan.assignedToName}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAssignScan(scan)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Assign
                    </button>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(scan.status)}`}>
                    {getStatusIcon(scan.status)}
                    {scan.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewScan(scan)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
                      title="View scan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onAssignScan(scan)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
                      title="Reassign"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredScans.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No scans found matching your criteria.
        </div>
      )}
    </div>
  );
};

const AssignScanModal: React.FC<AssignScanModalProps> = ({ isOpen, scan, members, onClose, onAssign }) => {
  const [selectedMember, setSelectedMember] = useState('');

  const handleAssign = (): void => {
    if (selectedMember && scan) {
      onAssign(scan._id, selectedMember);
      onClose();
    }
  };

  if (!isOpen || !scan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Assign Scan</h3>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{scan.url}</div>
            <div className="text-sm text-gray-500">{scan.issues} issues • Score: {scan.score}%</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to team member
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a member...</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const [team] = useState(mockTeam);
  const [scans, setScans] = useState(mockScans);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

  const handleInvite = (inviteData: InviteData): void => {
    console.log('Invite sent:', inviteData);
    // API call to send invite
  };

  const handleRemoveMember = (memberId: string): void => {
    console.log('Remove member:', memberId);
    // API call to remove member
  };

  const handleAssignScan = (scan: Scan): void => {
    setSelectedScan(scan);
    setShowAssignModal(true);
  };

  const handleAssign = (scanId: string, memberId: string): void => {
    const memberName = team.members.find(m => m._id === memberId)?.name || null;
    setScans(prev => prev.map(scan => 
      scan._id === scanId 
        ? { ...scan, assignedTo: memberId, assignedToName: memberName, status: 'in-progress' as const }
        : scan
    ));
    console.log('Assigned scan:', scanId, 'to member:', memberId);
    // API call to assign scan
  };

  const handleViewScan = (scan: Scan): void => {
    console.log('View scan:', scan);
    // Navigate to scan details or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
            <p className="text-gray-600 mt-1">Manage your team and collaborate on security scans</p>
          </div>
        </div>

        {/* Team Overview */}
        <TeamOverviewCard 
          team={team} 
          onInvite={() => setShowInviteForm(true)} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member List */}
          <div className="lg:col-span-1">
            <MemberList 
              members={team.members} 
              onRemoveMember={handleRemoveMember}
            />
          </div>

          {/* Scans Table */}
          <div className="lg:col-span-2">
            <AssignedScansTable
              scans={scans}
              members={team.members}
              onAssignScan={handleAssignScan}
              onViewScan={handleViewScan}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <InviteForm
        isOpen={showInviteForm}
        onClose={() => setShowInviteForm(false)}
        onInvite={handleInvite}
      />

      <AssignScanModal
        isOpen={showAssignModal}
        scan={selectedScan}
        members={team.members}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssign}
      />
    </div>
  );
}