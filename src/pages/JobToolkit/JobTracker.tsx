import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Trophy,
  Search,
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  MoreVertical,
  Filter,
  Database,
  AlertCircle,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import SeoContent from '../../components/SeoContent';
import { useDatabase } from '../../contexts/DatabaseContext';
import { db } from '../../config/firebase';

type JobStatus = 'applied' | 'interview' | 'rejected' | 'offer';

interface Job {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  date: string;
  notes: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<JobStatus, { label: string, icon: any, colors: string }> = {
  applied: { label: 'Applied', icon: Clock, colors: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  interview: { label: 'Interviewing', icon: Plus, colors: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 font-bold' },
  rejected: { label: 'Declined', icon: XCircle, colors: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 opacity-70' },
  offer: { label: 'Offer Received', icon: Trophy, colors: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10' }
};

export default function JobTracker() {
  const { user, loading: authLoading, signIn, signOut, addJob, updateJob, deleteJob, subscribeToJobs } = useDatabase();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<Partial<Job>>({
    company: '',
    role: '',
    status: 'applied',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (authLoading) return;
    
    console.log('🔍 JobTracker useEffect triggered');
    console.log('👤 Firebase user:', user);
    
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Set up real-time listener for jobs
    const unsubscribe = subscribeToJobs(user.uid, (jobsData) => {
      console.log('📊 Jobs data received:', jobsData);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, subscribeToJobs]);

  const saveJob = async (jobData: Partial<Job>) => {
    if (!user) {
      throw new Error('You must be signed in to add jobs');
    }
    
    console.log('🔍 saveJob called with:', jobData);
    console.log('👤 Firebase user uid:', user.uid);
    
    // Validate required fields
    if (!jobData.company || !jobData.role || !jobData.status || !jobData.date) {
      console.error('❌ Missing required fields:', jobData);
      throw new Error('Please fill in all required fields (company, role, status, date)');
    }

    const now = new Date().toISOString();
    console.log('⏰ Timestamp:', now);
    
    try {
      if (editingJob) {
        // Update existing job
        console.log('📝 Updating job:', editingJob.id);
        await updateJob(editingJob.id, {
          ...jobData,
          updatedAt: now
        });
        console.log('✅ Job updated successfully');
      } else {
        // Create new job
        console.log('➕ Creating new job');
        const jobWithUserId = {
          ...jobData,
          userId: user.uid,
          createdAt: now,
          updatedAt: now
        } as Omit<Job, 'id'>;
        
        await addJob(jobWithUserId);
        console.log('✅ Job created successfully');
      }
      
      // Reset form
      setFormData({
        company: '',
        role: '',
        status: 'applied',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setEditingJob(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error saving job:', error);
      throw error;
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await deleteJob(jobId);
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      date: job.date,
      notes: job.notes
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 Form data:', formData);
    console.log('👤 Firebase user:', user);
    
    try {
      await saveJob(formData);
      console.log('✅ Job saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving job:', error);
      alert(error.message || 'Failed to save job. Please try again.');
    }
  };

  // Filter jobs
  const filteredJobs = (jobs || []).filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = searchQuery === '' || 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort jobs by date (newest first)
  const sortedJobs = filteredJobs.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <User className="w-16 h-16 text-indigo-600 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In to Job Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-md">
            Sign in with your Google account to track your job applications and keep your data synced across all your devices.
          </p>
          <button
            onClick={signIn}
            className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User info and sign-out */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
            ) : (
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.displayName || user?.email || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Signed in with Google
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
      
      <SeoContent
        title="Job Tracker - Free Job Application Manager | Lumina Toolkit"
        description="Track your job applications, interviews, and offers with our free job tracker. Stay organized and never miss an opportunity."
        features={[
          "Track unlimited job applications",
          "Monitor interview schedules",
          "Receive offer notifications", 
          "Export data to CSV",
          "Custom status tracking",
          "Real-time cloud sync"
        ]}
        steps={[
          "Add your job application details",
          "Update status as you progress",
          "Track interviews and follow-ups",
          "Manage offers and decisions"
        ]}
        benefits={[
          "Never miss important deadlines",
          "Stay organized during job search",
          "Track your success rate",
          "Professional career management"
        ]}
        faq={[
          {
            q: "Is my data secure?",
            a: "Yes, all data is encrypted and stored securely in Firebase with industry-standard security protocols."
          },
          {
            q: "Can I export my data?",
            a: "Yes, you can export all your job application data to CSV format for backup or analysis."
          },
          {
            q: "Is there a limit to applications?",
            a: "No, you can track unlimited job applications with our free job tracker."
          },
          {
            q: "Does it work on mobile?",
            a: "Yes, the job tracker is fully responsive and works seamlessly on all devices."
          }
        ]}
        ctaTitle="Start Tracking Your Job Search Today"
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Job Application Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your job applications from submission to interview to offer
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const count = (jobs || []).filter(job => job.status === status).length;
          return (
            <div key={status} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{config.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                </div>
                <div className={cn('p-3 rounded-full', config.colors)}>
                  <config.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by company, role, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as JobStatus | 'all')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                <option key={status} value={status}>{config.label}</option>
              ))}
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {sortedJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No job applications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start tracking your job applications by adding your first one.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Add Your First Job
            </button>
          </div>
        ) : (
          sortedJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.role}
                    </h3>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', STATUS_CONFIG[job.status].colors)}>
                      {STATUS_CONFIG[job.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(job.date).toLocaleDateString()}
                    </div>
                  </div>
                  {job.notes && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {job.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingJob ? 'Edit Job Application' : 'Add Job Application'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status || 'applied'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <option key={status} value={status}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    {editingJob ? 'Update Job' : 'Add Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingJob(null);
                      setFormData({
                        company: '',
                        role: '',
                        status: 'applied',
                        date: new Date().toISOString().split('T')[0],
                        notes: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
