import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, onAuthStateChange, signInWithGoogle, signOutUser } from '../config/firebase';

interface Job {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'rejected' | 'offer';
  date: string;
  notes: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseContextType {
  // Auth functions
  user: any;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Job tracker functions
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateJob: (jobId: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  getJobs: (userId: string) => Promise<Job[]>;
  subscribeToJobs: (userId: string, callback: (jobs: Job[]) => void) => () => void;
  
  // Generic database functions
  addToCollection: (collectionName: string, data: any) => Promise<string>;
  updateDocument: (collectionName: string, docId: string, data: any) => Promise<void>;
  deleteDocument: (collectionName: string, docId: string) => Promise<void>;
  getCollection: (collectionName: string, userId?: string) => Promise<any[]>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auth functions
  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // localStorage fallback functions
  const getLocalStorageJobs = (): Job[] => {
    try {
      const stored = localStorage.getItem('jobTrackerJobs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  };

  const setLocalStorageJobs = (jobs: Job[]): void => {
    try {
      localStorage.setItem('jobTrackerJobs', JSON.stringify(jobs));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  const generateId = (): string => {
    return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Job tracker functions
  const addJob = async (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    if (!db) {
      // Fallback to localStorage
      const jobs = getLocalStorageJobs();
      const newJob: Job = {
        ...job,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      jobs.push(newJob);
      setLocalStorageJobs(jobs);
      return newJob.id;
    }

    try {
      const jobData = {
        ...job,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>): Promise<void> => {
    if (!db) {
      // Fallback to localStorage
      const jobs = getLocalStorageJobs();
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        jobs[jobIndex] = {
          ...jobs[jobIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        setLocalStorageJobs(jobs);
      } else {
        throw new Error('Job not found');
      }
      return;
    }

    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (jobId: string): Promise<void> => {
    if (!db) {
      // Fallback to localStorage
      const jobs = getLocalStorageJobs();
      const filteredJobs = jobs.filter(job => job.id !== jobId);
      setLocalStorageJobs(filteredJobs);
      return;
    }

    try {
      const jobRef = doc(db, 'jobs', jobId);
      await deleteDoc(jobRef);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const getJobs = async (userId: string): Promise<Job[]> => {
    if (!db) {
      // Fallback to localStorage
      const jobs = getLocalStorageJobs();
      return jobs.filter(job => job.userId === userId);
    }

    try {
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(jobsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };

  const subscribeToJobs = (userId: string, callback: (jobs: Job[]) => void) => {
    if (!db) {
      // Fallback to localStorage - return initial data and set up storage event listener
      const jobs = getLocalStorageJobs().filter(job => job.userId === userId);
      callback(jobs);
      
      // Set up storage event listener for cross-tab sync
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'jobTrackerJobs') {
          const updatedJobs = getLocalStorageJobs().filter(job => job.userId === userId);
          callback(updatedJobs);
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    const jobsQuery = query(
      collection(db, 'jobs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(jobsQuery, (querySnapshot) => {
      try {
        if (!querySnapshot || !querySnapshot.docs) {
          console.warn('Query snapshot or docs is undefined');
          callback([]);
          return;
        }
        
        const jobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Job));
        callback(jobs);
      } catch (error) {
        console.error('Error processing jobs snapshot:', error);
        callback([]);
      }
    }, (error) => {
      console.error('Firestore subscription error:', error);
      callback([]);
    });

    return unsubscribe;
  };

  // Generic database functions
  const addToCollection = async (collectionName: string, data: any): Promise<string> => {
    if (!db) {
      throw new Error('Database is not available. Firebase is not configured.');
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      throw error;
    }
  };

  const updateDocument = async (collectionName: string, docId: string, data: any): Promise<void> => {
    if (!db) {
      throw new Error('Database is not available. Firebase is not configured.');
    }

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  };

  const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
    if (!db) {
      throw new Error('Database is not available. Firebase is not configured.');
    }

    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  };

  const getCollection = async (collectionName: string, userId?: string): Promise<any[]> => {
    if (!db) {
      return [];
    }

    try {
      let collectionQuery;
      if (userId) {
        collectionQuery = query(
          collection(db, collectionName),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      } else {
        collectionQuery = query(
          collection(db, collectionName),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(collectionQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  };

  const value: DatabaseContextType = {
    // Auth
    user,
    loading,
    signIn,
    signOut,
    
    // Job tracker
    addJob,
    updateJob,
    deleteJob,
    getJobs,
    subscribeToJobs,
    
    // Generic database
    addToCollection,
    updateDocument,
    deleteDocument,
    getCollection
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
