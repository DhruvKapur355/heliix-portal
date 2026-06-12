import { useState } from 'react';
import NavBar from './components/NavBar';
import LiveView from './views/LiveView';
import InspectionMedia from './views/InspectionMedia';
import Reports from './views/Reports';
import Settings from './views/Settings';
import AuthPage from './views/AuthPage';
import { useDroneSim } from './hooks/useDroneSim';
import { useInspectionData } from './hooks/useInspectionData';
import { useAuth } from './hooks/useAuth';

type Page = 'live' | 'media' | 'reports' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('live');
  const { user, login, signup, logout } = useAuth();

  const { state: droneState, events, pauseMission, resumeMission, abortMission, returnToStart } = useDroneSim();
  const { media, rooms, reports, selectedReport, selectedReportId, setSelectedReportId, updateMediaItem, deleteMediaItem, generateReport } = useInspectionData();

  if (!user) {
    return <AuthPage onLogin={login} onSignup={signup} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      <NavBar active={page} onChange={setPage} user={user} onLogout={logout} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {page === 'live' && (
          <LiveView
            droneState={droneState}
            events={events}
            onPause={pauseMission}
            onResume={resumeMission}
            onAbort={abortMission}
            onReturn={returnToStart}
          />
        )}
        {page === 'media' && (
          <InspectionMedia
            media={media}
            rooms={rooms}
            onUpdateItem={updateMediaItem}
            onDeleteItem={deleteMediaItem}
          />
        )}
        {page === 'reports' && (
          <Reports
            reports={reports}
            selectedReport={selectedReport}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
            onGenerateReport={generateReport}
          />
        )}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  );
}
