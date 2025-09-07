import React from 'react';
import { BookOpen, TrendingUp, Users, Star, BarChart3, Plus } from 'lucide-react';

interface DashboardProps {
  onCreateList: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateList }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reading Lists</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
            <BookOpen className="w-8 h-8 text-primary opacity-70" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Books Saved</p>
              <p className="text-2xl font-bold text-primary">247</p>
            </div>
            <Star className="w-8 h-8 text-accent opacity-70" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Genres Followed</p>
              <p className="text-2xl font-bold text-primary">8</p>
            </div>
            <Users className="w-8 h-8 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trend Score</p>
              <p className="text-2xl font-bold text-primary">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Lists</h3>
            <button onClick={onCreateList} className="btn-primary text-sm">
              <Plus className="w-4 h-4 inline mr-1" />
              New List
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Dark Academia Vibes', books: 8, updated: '2 hours ago' },
              { name: 'Fantasy Romance Must-Reads', books: 15, updated: '1 day ago' },
              { name: 'Spicy BookTok Finds', books: 12, updated: '3 days ago' },
            ].map((list, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{list.name}</p>
                  <p className="text-sm text-gray-600">{list.books} books</p>
                </div>
                <p className="text-xs text-gray-500">{list.updated}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trending in Your Genres</h3>
          <div className="space-y-3">
            {[
              { title: 'Fourth Wing', author: 'Rebecca Yarros', trend: '+45%' },
              { title: 'The Seven Moons of Maali Almeida', author: 'Shehan Karunatilaka', trend: '+32%' },
              { title: 'Book Lovers', author: 'Emily Henry', trend: '+28%' },
            ].map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
                <span className="text-green-600 text-sm font-medium">{book.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button 
            onClick={onCreateList}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span>Create List from TikTok</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity">
            <Users className="w-5 h-5" />
            <span>Discover Genres</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-opacity">
            <BarChart3 className="w-5 h-5" />
            <span>View Trends</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;