import { useState } from 'react';
import NavBar from './components/NavBar';
import LiveView from './views/LiveView';
import Homes from './views/Homes';
import InspectionMedia from './views/InspectionMedia';
import Reports from './views/Reports';
import Settings from './views/Settings';
import AuthPage from './views/AuthPage';
import { useDroneSim } from './hooks/useDroneSim';
import { useInspectionData } from './hooks/useInspectionData';
import { useAuth } from './hooks/useAuth';

type Page = 'homes' | 'live' | 'media' | 'reports' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('homes');
  const [selectedHomeId, setSelectedHomeId] = useState('elmwood');
  const { user, login, signup, logout } = useAuth();

  const { state: droneState, events, pauseMission, resumeMission, abortMission, returnToStart } = useDroneSim();
  const { homes, mediaByHomeId, rooms, reports, selectedReport, selectedReportId, setSelectedReportId, updateMediaItem, deleteMediaItem, generateReport } = useInspectionData();

  const selectedHome = homes.find((home) => home.id === selectedHomeId) ?? homes[0];

  function handlePageChange(nextPage: Page) {
    setPage(nextPage);
  }

  function openHome(homeId: string) {
    setSelectedHomeId(homeId);
    setPage('media');
  }

  function handleBackToHomes() {
    setPage('homes');
  }

  function handleUpdateMediaItem(id: string, updates: Parameters<typeof updateMediaItem>[2]) {
    updateMediaItem(selectedHome.id, id, updates);
  }

  function handleDeleteMediaItem(id: string) {
    deleteMediaItem(selectedHome.id, id);
  }

  if (!user) {
    return <AuthPage onLogin={login} onSignup={signup} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', flexDirection: 'column' }}>
      <NavBar active={page === 'media' ? 'homes' : page} onChange={handlePageChange} user={user} onLogout={logout} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {page === 'homes' && <Homes homes={homes} onOpenHome={openHome} />}
        {page === 'live' && (
          <LiveView
            droneState={droneState}
            events={events}
            home={selectedHome}
            onBackToHomes={handleBackToHomes}
            onPause={pauseMission}
            onResume={resumeMission}
            onAbort={abortMission}
            onReturn={returnToStart}
          />
        )}
        {page === 'media' && (
          <InspectionMedia
            home={selectedHome}
            media={mediaByHomeId[selectedHome.id] ?? []}
            rooms={rooms}
            onBackToHomes={handleBackToHomes}
            onUpdateItem={handleUpdateMediaItem}
            onDeleteItem={handleDeleteMediaItem}
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
