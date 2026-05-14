import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsEvents } from '../lib/analytics';
import ResumeCraftApp from '../../resume-craft-module/src/App.tsx';
import '../../resume-craft-module/src/index.css';

export default function ResumeBuilderStandalone() {
  const location = useLocation();

  useEffect(() => {
    analyticsEvents.pageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="h-dvh w-full overflow-hidden">
      <ResumeCraftApp />
    </div>
  );
}
