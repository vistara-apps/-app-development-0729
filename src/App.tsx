import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { BookOpen, TrendingUp, Users, Calendar, Plus, Heart, Star, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ReadingLists from './components/ReadingLists';
import GenreDiscovery from './components/GenreDiscovery';
import AuthorAMAs from './components/AuthorAMAs';
import TrendReports from './components/TrendReports';
import CreateListModal from './components/CreateListModal';

type Tab = 'dashboard' | 'lists' | 'genres' | 'amas' | 'trends';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3 },
    { id: 'lists' as Tab, label: 'My Lists', icon: BookOpen },
    { id: 'genres' as Tab, label: 'Genres', icon: Heart },
    { id: 'amas' as Tab, label: 'AMAs', icon: Calendar },
    { id: 'trends' as Tab, label: 'Trends', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onCreateList={() => setShowCreateModal(true)} />;
      case 'lists':
        return <ReadingLists onCreateList={() => setShowCreateModal(true)} />;
      case 'genres':
        return <GenreDiscovery />;
      case 'amas':
        return <AuthorAMAs />;
      case 'trends':
        return <TrendReports />;
      default:
        return <Dashboard onCreateList={() => setShowCreateModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="gradient-bg text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DIGINER</h1>
              <p className="text-sm opacity-90">Your BookTok to Reality Reading Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New List</span>
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-card overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="animate-fade-in">
          {renderContent()}
        </main>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <CreateListModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default App;