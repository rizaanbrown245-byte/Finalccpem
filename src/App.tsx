import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MembersView } from './components/MembersView';
import { CrimeSafetyView } from './components/CrimeSafetyView';
import { CommunityWorkView } from './components/CommunityWorkView';
import { IssueTrackerView } from './components/IssueTrackerView';
import { MemberUpdatesView } from './components/MemberUpdatesView';
import { GalleryView } from './components/GalleryView';
import { SupportersView } from './components/SupportersView';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { ReportIssueModal } from './components/ReportIssueModal';
import { IssueTrackerModal } from './components/IssueTrackerModal';
import { LoginModal } from './components/LoginModal';
import { InAppEditor } from './components/InAppEditor';

function MainPortal() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerInitialRef, setTrackerInitialRef] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Track specific issue by reference code
  const handleTrackIssue = (ref: string) => {
    setTrackerInitialRef(ref);
    setTrackerModalOpen(true);
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Universal Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTrackerModal={() => {
          setTrackerInitialRef(null);
          setTrackerModalOpen(true);
        }}
        onOpenLoginModal={() => setLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'home' && (
          <HomeView
            onSelectTab={handleSelectTab}
            onOpenReportModal={() => setReportModalOpen(true)}
            onOpenTrackerModal={() => {
              setTrackerInitialRef(null);
              setTrackerModalOpen(true);
            }}
            onTrackIssue={handleTrackIssue}
          />
        )}

        {activeTab === 'members' && <MembersView />}

        {activeTab === 'safety' && <CrimeSafetyView />}

        {activeTab === 'community-work' && <CommunityWorkView />}

        {activeTab === 'tracker' && (
          <IssueTrackerView
            onOpenReportModal={() => setReportModalOpen(true)}
            onOpenIssueDetails={handleTrackIssue}
          />
        )}

        {activeTab === 'updates' && <MemberUpdatesView />}

        {activeTab === 'gallery' && <GalleryView />}

        {activeTab === 'supporters' && <SupportersView />}

        {activeTab === 'contact' && <ContactView />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Report Municipal Issue Modal */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onTrackSubmittedIssue={(ref) => {
          setTrackerInitialRef(ref);
          setTrackerModalOpen(true);
        }}
      />

      {/* Issue Tracker & Lookup Modal */}
      <IssueTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => {
          setTrackerModalOpen(false);
          setTrackerInitialRef(null);
        }}
        initialRef={trackerInitialRef}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* In-App Live Content & Site Editor */}
      <InAppEditor />

      {/* Footer with "Made by RB digital solutions" */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTrackerModal={() => {
          setTrackerInitialRef(null);
          setTrackerModalOpen(true);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainPortal />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
