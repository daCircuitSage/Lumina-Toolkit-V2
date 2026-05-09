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
  LogOut,
  ChevronLeft,
  ChevronRight,
  List
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
  applied: { label: 'Applied', icon: Clock, colors: 'bg-[#3ECF8E]/10 text-[#3ECF8E]' },
  interview: { label: 'Interviewing', icon: Plus, colors: 'bg-[#3ECF8E]/20 text-[#3ECF8E] font-bold' },
  rejected: { label: 'Declined', icon: XCircle, colors: 'bg-red-500/10 text-red-400 opacity-70' },
  offer: { label: 'Offer Received', icon: Trophy, colors: 'bg-[#3ECF8E]/20 text-[#3ECF8E] ring-2 ring-[#3ECF8E]/30 shadow-lg shadow-[#3ECF8E]/10' }
};

export default function JobTracker() {
  const { user, loading: authLoading, signIn, signOut, addJob, updateJob, deleteJob, subscribeToJobs } = useDatabase();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const jobsPerPage = 8;

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

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = showAllJobs ? sortedJobs : sortedJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Pagination controls
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const toggleShowAllJobs = () => {
    setShowAllJobs(!showAllJobs);
    setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-[#3ECF8E] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-[#3ECF8E]/30 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#171717] border border-[#2E2E2E] rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#3ECF8E]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#3ECF8E]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Sign In to Job Tracker
          </h2>
          <p className="text-sm sm:text-base text-[#A0A0A0] text-center mb-6 sm:mb-8">
            Sign in with your Google account to track your job applications and keep your data synced across all your devices.
          </p>
          <button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-black rounded-xl transition-colors font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-[#3ECF8E] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-[#3ECF8E]/30 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* User info and sign-out */}
      <div className="border-b border-[#2E2E2E] bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3ECF8E]/10 rounded-full flex items-center justify-center">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#3ECF8E]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {user?.displayName || user?.email || 'User'}
                </p>
                <p className="text-xs text-[#A0A0A0] hidden sm:block">
                  Signed in with Google
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-[#A0A0A0] hover:text-white transition-colors"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Job Tracker Tool - Hero Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Job Application Tracker
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#A0A0A0] max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto px-4">
            Track your job applications from submission to interview to offer
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-12">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = (jobs || []).filter(job => job.status === status).length;
            return (
              <div key={status} className="bg-[#171717] border border-[#2E2E2E] rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#A0A0A0] mb-1">{config.label}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{count}</p>
                  </div>
                  <div className={cn('p-2 sm:p-3 rounded-xl', config.colors)}>
                    <config.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-[#171717] border border-[#2E2E2E] rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search jobs by company, role, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white placeholder-[#A0A0A0] text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as JobStatus | 'all')}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-black rounded-xl transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Job
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-3 sm:space-y-4">
          {sortedJobs.length === 0 ? (
            <div className="bg-[#171717] border border-[#2E2E2E] rounded-xl p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#3ECF8E]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#3ECF8E]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                No job applications yet
              </h3>
              <p className="text-sm sm:text-base text-[#A0A0A0] mb-4 sm:mb-6 max-w-sm sm:max-w-md mx-auto px-4">
                Start tracking your job applications by adding your first one.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-black rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Add Your First Job
              </button>
            </div>
          ) : (
            <>
              {/* Results summary and pagination controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="text-sm text-[#A0A0A0]">
                  {sortedJobs.length > 0 && (
                    <span>
                      Showing {showAllJobs ? 'all' : `${startIndex + 1}-${Math.min(endIndex, sortedJobs.length)}`} of {sortedJobs.length} jobs
                    </span>
                  )}
                </div>
                {sortedJobs.length > jobsPerPage && (
                  <button
                    onClick={toggleShowAllJobs}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#171717] border border-[#2E2E2E] rounded-lg hover:bg-[#2E2E2E] transition-colors text-white"
                  >
                    <List className="w-3 h-3" />
                    {showAllJobs ? 'Show Paginated' : 'See All Jobs'}
                  </button>
                )}
              </div>

              {/* Job cards */}
              {paginatedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#171717] border border-[#2E2E2E] rounded-xl p-4 sm:p-6 hover:border-[#3ECF8E]/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-white truncate">
                          {job.role}
                        </h3>
                        <span className={cn('px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto', STATUS_CONFIG[job.status].colors)}>
                          {STATUS_CONFIG[job.status].label}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-[#A0A0A0] mb-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{new Date(job.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {job.notes && (
                        <p className="text-sm text-[#A0A0A0] leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {job.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2 ml-0 sm:ml-4">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-[#A0A0A0] hover:text-[#3ECF8E] transition-colors rounded-lg hover:bg-[#3ECF8E]/10"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 text-[#A0A0A0] hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination controls */}
              {!showAllJobs && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#2E2E2E]">
                  <div className="text-sm text-[#A0A0A0]">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#171717] border border-[#2E2E2E] rounded-lg hover:bg-[#2E2E2E] transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#3ECF8E] text-black font-medium'
                                : 'bg-[#171717] border border-[#2E2E2E] text-white hover:bg-[#2E2E2E]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#171717] border border-[#2E2E2E] rounded-lg hover:bg-[#2E2E2E] transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Job Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#171717] border border-[#2E2E2E] rounded-2xl shadow-2xl max-w-md w-full mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
                {editingJob ? 'Edit Job Application' : 'Add Job Application'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white placeholder-[#A0A0A0] text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white placeholder-[#A0A0A0] text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status || 'applied'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white text-sm sm:text-base"
                  >
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <option key={status} value={status}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-[#2E2E2E] rounded-xl focus:ring-2 focus:ring-[#3ECF8E] focus:border-transparent text-white placeholder-[#A0A0A0] resize-none text-sm sm:text-base"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-black rounded-xl transition-colors font-medium text-sm sm:text-base"
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
                    className="flex-1 px-4 py-2.5 sm:py-3 bg-[#2E2E2E] hover:bg-[#3A3A3A] text-white rounded-xl transition-colors font-medium text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Content - Secondary Section */}
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
    </div>
  );
}
