import React, { useState } from 'react';
import { Calendar, Clock, Users, Star, Bell, MessageCircle } from 'lucide-react';

interface AMA {
  id: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    books: string[];
  };
  title: string;
  schedule: string;
  duration: string;
  genre: string;
  status: 'upcoming' | 'live' | 'ended';
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
}

const AuthorAMAs: React.FC = () => {
  const [amas, setAmas] = useState<AMA[]>([
    {
      id: '1',
      author: {
        name: 'Rebecca Yarros',
        avatar: '/api/placeholder/60/60',
        bio: 'NYT Bestselling Author of Fourth Wing and Iron Flame',
        books: ['Fourth Wing', 'Iron Flame', 'In the Likely Event']
      },
      title: 'Dragons, Romance, and Writing Fantasy That Breaks Hearts',
      schedule: '2024-02-15T19:00:00Z',
      duration: '60 minutes',
      genre: 'Fantasy Romance',
      status: 'upcoming',
      attendees: 1250,
      maxAttendees: 2000,
      isRegistered: true
    },
    {
      id: '2',
      author: {
        name: 'Emily Henry',
        avatar: '/api/placeholder/60/60',
        bio: 'Author of Beach Read, People We Meet on Vacation, and Book Lovers',
        books: ['Beach Read', 'People We Meet on Vacation', 'Book Lovers']
      },
      title: 'Writing Contemporary Romance That Feels Real',
      schedule: '2024-02-12T18:00:00Z',
      duration: '45 minutes',
      genre: 'Contemporary Romance',
      status: 'live',
      attendees: 1890,
      maxAttendees: 2000,
      isRegistered: false
    },
    {
      id: '3',
      author: {
        name: 'Donna Tartt',
        avatar: '/api/placeholder/60/60',
        bio: 'Pulitzer Prize-winning author of The Secret History',
        books: ['The Secret History', 'The Little Friend', 'The Goldfinch']
      },
      title: 'The Art of Literary Fiction and Dark Academia',
      schedule: '2024-02-08T17:00:00Z',
      duration: '75 minutes',
      genre: 'Literary Fiction',
      status: 'ended',
      attendees: 1654,
      maxAttendees: 1800,
      isRegistered: false
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered'>('all');

  const toggleRegistration = (amaId: string) => {
    setAmas(amas.map(ama => 
      ama.id === amaId 
        ? { 
            ...ama, 
            isRegistered: !ama.isRegistered,
            attendees: ama.isRegistered ? ama.attendees - 1 : ama.attendees + 1
          }
        : ama
    ));
  };

  const filteredAMAs = amas.filter(ama => {
    if (filter === 'upcoming') return ama.status === 'upcoming';
    if (filter === 'registered') return ama.isRegistered;
    return true;
  });

  const getStatusColor = (status: AMA['status']) => {
    switch (status) {
      case 'live': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'ended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: AMA['status']) => {
    switch (status) {
      case 'live': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'ended': return 'Ended';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Author AMAs</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All AMAs
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'upcoming' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('registered')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'registered' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Registered
          </button>
        </div>
      </div>

      {/* Featured Live AMA */}
      {amas.some(ama => ama.status === 'live') && (
        <div className="card bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">LIVE NOW</span>
          </div>
          {amas.filter(ama => ama.status === 'live').map(ama => (
            <div key={ama.id}>
              <h3 className="text-xl font-bold mb-2">{ama.title}</h3>
              <p className="mb-4">with {ama.author.name}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{ama.attendees} watching</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{ama.duration}</span>
                  </span>
                </div>
                <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Join Live
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AMA List */}
      <div className="space-y-4">
        {filteredAMAs.map((ama) => (
          <div key={ama.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              {/* Author Avatar */}
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gray-400" />
              </div>

              {/* AMA Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{ama.title}</h3>
                    <p className="text-gray-600 text-sm">with {ama.author.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ama.status)}`}>
                    {getStatusText(ama.status)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{ama.author.bio}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(ama.schedule).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(ama.schedule).toLocaleTimeString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{ama.attendees}/{ama.maxAttendees}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                    {ama.genre}
                  </span>
                  {ama.author.books.slice(0, 2).map((book, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {book}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {ama.isRegistered && (
                      <span className="flex items-center space-x-1 text-green-600 text-sm">
                        <Bell className="w-4 h-4" />
                        <span>Registered</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {ama.status === 'live' && (
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>Join Live</span>
                      </button>
                    )}
                    
                    {ama.status === 'upcoming' && (
                      <button
                        onClick={() => toggleRegistration(ama.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          ama.isRegistered
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-primary text-white hover:opacity-90'
                        }`}
                      >
                        {ama.isRegistered ? 'Unregister' : 'Register'}
                      </button>
                    )}
                    
                    {ama.status === 'ended' && (
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        View Recording
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAMAs.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No AMAs found</h3>
          <p className="text-gray-500">
            {filter === 'registered' 
              ? "You haven't registered for any AMAs yet. Check out upcoming sessions!"
              : filter === 'upcoming'
              ? "No upcoming AMAs scheduled at the moment."
              : "No AMAs available at the moment."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthorAMAs;