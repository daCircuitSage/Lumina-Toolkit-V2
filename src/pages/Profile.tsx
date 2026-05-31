import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Shield, LogOut, Edit2, Camera, Settings, ChevronRight, Upload, X, Download } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import jsPDF from 'jspdf';

export default function Profile() {
  const { user, loading: authLoading, signOut } = useDatabase();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setProfileImage(user.photoURL || null);
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setIsUploading(false);
        
        // In a real implementation, you would upload to Firebase Storage here
        console.log('Profile image uploaded:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Note: In a real implementation, you'd update user profile in Firebase
    setIsEditing(false);
  };

  const handleDownloadData = () => {
    if (!user) return;
    
    try {
      // Create profile data object
      const profileData = {
        personalInfo: {
          fullName: user.displayName || 'User',
          email: user.email || '',
          phone: 'Not provided',
          address: 'Not provided',
          summary: 'User profile data from Lumina Toolkit'
        },
        accountInfo: {
          joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown',
          lastLogin: new Date().toLocaleDateString(),
          emailVerified: user.emailVerified || false
        },
        settings: {
          profileVisibility: 'Public',
          emailNotifications: true,
          securityAlerts: true,
          marketingEmails: false,
          language: 'English',
          timezone: 'UTC-08:00 Pacific Time'
        }
      };

      // Generate PDF using jspdf
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Lumina Toolkit - Profile Data Export', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });
      
      let yPosition = 55;
      
      // Personal Information Section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Personal Information', 105, yPosition, { align: 'left' });
      yPosition += 10;
      
      doc.setFont(undefined, 'normal');
      doc.text(`Full Name: ${profileData.personalInfo.fullName}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Email: ${profileData.personalInfo.email}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Phone: ${profileData.personalInfo.phone}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Address: ${profileData.personalInfo.address}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Summary: ${profileData.personalInfo.summary}`, 105, yPosition, { align: 'left' });
      yPosition += 15;
      
      // Account Information Section
      doc.setFont(undefined, 'bold');
      doc.text('Account Information', 105, yPosition, { align: 'left' });
      yPosition += 10;
      
      doc.setFont(undefined, 'normal');
      doc.text(`Join Date: ${profileData.accountInfo.joinDate}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Last Login: ${profileData.accountInfo.lastLogin}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Email Verified: ${profileData.accountInfo.emailVerified ? 'Yes' : 'No'}`, 105, yPosition, { align: 'left' });
      yPosition += 15;
      
      // Settings Section
      doc.setFont(undefined, 'bold');
      doc.text('Settings', 105, yPosition, { align: 'left' });
      yPosition += 10;
      
      doc.setFont(undefined, 'normal');
      doc.text(`Profile Visibility: ${profileData.settings.profileVisibility}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Email Notifications: ${profileData.settings.emailNotifications ? 'Enabled' : 'Disabled'}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Security Alerts: ${profileData.settings.securityAlerts ? 'Enabled' : 'Disabled'}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Marketing Emails: ${profileData.settings.marketingEmails ? 'Enabled' : 'Disabled'}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Language: ${profileData.settings.language}`, 105, yPosition, { align: 'left' });
      yPosition += 8;
      doc.text(`Timezone: ${profileData.settings.timezone}`, 105, yPosition, { align: 'left' });
      yPosition += 15;
      
      // Footer
      doc.setFontSize(10);
      doc.text('This data was exported from your Lumina Toolkit account.', 105, yPosition, { align: 'center' });
      yPosition += 8;
      doc.text('For questions about your data, contact support.', 105, yPosition, { align: 'center' });
      
      // Save the PDF
      doc.save(`lumina-profile-data-${user.displayName || 'user'}-${Date.now()}.pdf`);
      
      console.log('Profile data PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading profile data:', error);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-body-mid">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-normal text-ink mb-2">Account Settings</h1>
          <p className="text-body-mid">Manage your profile, security, and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-canvas-card border border-hairline rounded-sm p-4"
            >
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-colors ${
                    activeSection === 'overview' 
                      ? 'bg-white text-black' 
                      : 'text-body-mid hover:bg-canvas-soft hover:text-ink'
                  }`}
                >
                  <User size={16} />
                  <span className="text-sm font-normal">Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('personal')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-colors ${
                    activeSection === 'personal' 
                      ? 'bg-white text-black' 
                      : 'text-body-mid hover:bg-canvas-soft hover:text-ink'
                  }`}
                >
                  <Edit2 size={16} />
                  <span className="text-sm font-normal">Personal Info</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-colors ${
                    activeSection === 'security' 
                      ? 'bg-white text-black' 
                      : 'text-body-mid hover:bg-canvas-soft hover:text-ink'
                  }`}
                >
                  <Shield size={16} />
                  <span className="text-sm font-normal">Security</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('email')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm transition-colors ${
                    activeSection === 'email' 
                      ? 'bg-white text-black' 
                      : 'text-body-mid hover:bg-canvas-soft hover:text-ink'
                  }`}
                >
                  <Mail size={16} />
                  <span className="text-sm font-normal">Email Preferences</span>
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-canvas-card border border-hairline rounded-sm p-6"
              >
                <h2 className="text-2xl font-normal text-ink mb-6">Profile Overview</h2>
                
                {/* Profile Picture Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {profileImage || user?.photoURL ? (
                        <img 
                          src={profileImage || user.photoURL} 
                          alt={user.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-white" />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-canvas hover:bg-gray-100 transition-colors"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={18} className="text-black" />
                      )}
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-normal text-ink">{user?.displayName}</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-body-mid hover:text-ink transition-colors rounded-sm hover:bg-canvas-soft"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-3 text-body-mid">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{user?.email}</span>
                        {user?.emailVerified && (
                          <Shield size={16} className="text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-white" />
                      <span className="text-sm font-normal text-ink">Profile Completion</span>
                    </div>
                    <div className="text-2xl font-normal text-white">85%</div>
                    <p className="text-xs text-body-mid">Profile filled out</p>
                  </div>
                  
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-white" />
                      <span className="text-sm font-normal text-ink">Security Level</span>
                    </div>
                    <div className="text-2xl font-normal text-white">High</div>
                    <p className="text-xs text-body-mid">Account secured</p>
                  </div>
                  
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-white" />
                      <span className="text-sm font-normal text-ink">Member Since</span>
                    </div>
                    <div className="text-2xl font-normal text-white">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2024'}</div>
                    <p className="text-xs text-body-mid">Years active</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-canvas-card border border-hairline rounded-sm p-6"
              >
                <h2 className="text-2xl font-normal text-ink mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-body-mid mb-2">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-white transition-colors"
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-normal text-body-mid mb-2">Bio</label>
                    <textarea
                      className="w-full px-4 py-3 bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-white transition-colors resize-none"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-normal text-body-mid mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-white transition-colors"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <button
                    onClick={handleSaveProfile}
                    className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-black font-normal rounded-sm transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-canvas-card border border-hairline rounded-sm p-6"
              >
                <h2 className="text-2xl font-normal text-ink mb-6">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <h3 className="text-lg font-normal text-ink mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-white" />
                      Password Security
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 rounded-sm hover:bg-canvas transition-colors">
                        <span className="text-ink">Change Password</span>
                        <ChevronRight size={16} className="text-body-mid" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 rounded-sm hover:bg-canvas transition-colors">
                        <span className="text-ink">Enable Two-Factor Authentication</span>
                        <ChevronRight size={16} className="text-body-mid" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <h3 className="text-lg font-normal text-ink mb-4 flex items-center gap-2">
                      <User size={18} className="text-white" />
                      Privacy Settings
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3">
                        <span className="text-ink">Profile Visibility</span>
                        <button className="px-3 py-1 bg-white/10 text-white rounded-sm text-sm">Public</button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="text-ink">Show Email Publicly</span>
                        <button className="px-3 py-1 bg-canvas text-body-mid rounded-sm text-sm">Hidden</button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="text-ink">Activity Status</span>
                        <button className="px-3 py-1 bg-white/10 text-white rounded-sm text-sm">Active</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <h3 className="text-lg font-normal text-ink mb-4 flex items-center gap-2">
                      <Settings size={18} className="text-white" />
                      Data & Storage
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={handleDownloadData}
                        className="w-full flex items-center justify-between p-3 rounded-sm hover:bg-canvas transition-colors"
                      >
                        <span className="text-ink">Download Your Data</span>
                        <ChevronRight size={16} className="text-body-mid" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-canvas-card border border-hairline rounded-sm p-6"
              >
                <h2 className="text-2xl font-normal text-ink mb-6">Email Preferences</h2>
                
                <div className="space-y-6">
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <h3 className="text-lg font-normal text-ink mb-4">Notification Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <span className="text-ink block">Product Updates</span>
                          <span className="text-body-mid text-sm">New features and announcements</span>
                        </div>
                        <button className="px-3 py-1 bg-white text-black rounded-sm text-sm">Enabled</button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <span className="text-ink block">Security Alerts</span>
                          <span className="text-body-mid text-sm">Important security notifications</span>
                        </div>
                        <button className="px-3 py-1 bg-white text-black rounded-sm text-sm">Enabled</button>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <span className="text-ink block">Marketing Emails</span>
                          <span className="text-body-mid text-sm">Tips and promotional content</span>
                        </div>
                        <button className="px-3 py-1 bg-canvas text-body-mid rounded-sm text-sm">Disabled</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-canvas-soft rounded-sm p-4 border border-hairline">
                    <h3 className="text-lg font-normal text-ink mb-4">Communication Preferences</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-normal text-body-mid mb-2">Preferred Language</label>
                        <select className="w-full px-4 py-3 bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-white transition-colors">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                          <option>German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-normal text-body-mid mb-2">Time Zone</label>
                        <select className="w-full px-4 py-3 bg-canvas border border-hairline rounded-sm text-ink focus:outline-none focus:border-white transition-colors">
                          <option>UTC-08:00 Pacific Time</option>
                          <option>UTC-05:00 Eastern Time</option>
                          <option>UTC+00:00 London</option>
                          <option>UTC+01:00 Paris</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
