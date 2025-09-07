import React, { useState } from 'react';
import { Heart, Users, TrendingUp, BookOpen, Plus } from 'lucide-react';

interface Genre {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  trendingBooks: string[];
  isFollowed: boolean;
}

const GenreDiscovery: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([
    {
      id: '1',
      name: 'Dark Academia',
      description: 'Mysterious, gothic, and scholarly vibes with elite institutions and dark secrets.',
      memberCount: 12500,
      trendingBooks: ['The Secret History', 'If We Were Villains', 'The Picture of Dorian Gray'],
      isFollowed: true
    },
    {
      id: '2',
      name: 'Cozy Fantasy',
      description: 'Low-stakes fantasy with found family, magical communities, and comfort reads.',
      memberCount: 8900,
      trendingBooks: ['Legends & Lattes', 'The House in the Cerulean Sea', 'Beach Read'],
      isFollowed: false
    },
    {
      id: '3',
      name: 'Spicy Romance',
      description: 'Steamy contemporary and fantasy romance with high heat levels.',
      memberCount: 15600,
      trendingBooks: ['It Ends with Us', 'The Love Hypothesis', 'From Lukov with Love'],
      isFollowed: true
    },
    {
      id: '4',
      name: 'Indie Horror',
      description: 'Unique, atmospheric horror from independent publishers and emerging authors.',
      memberCount: 5200,
      trendingBooks: ['Mexican Gothic', 'The Only Good Indians', 'Ring Shout'],
      isFollowed: false
    },
    {
      id: '5',
      name: 'Queer Sci-Fi',
      description: 'Science fiction featuring LGBTQ+ characters and themes.',
      memberCount: 7800,
      trendingBooks: ['The Left Hand of Darkness', 'An Unkindness of Magicians', 'The Future of Another Timeline'],
      isFollowed: false
    },
    {
      id: '6',
      name: 'Afrofuturism',
      description: 'Speculative fiction exploring African diaspora culture and futures.',
      memberCount: 6400,
      trendingBooks: ['Parable of the Sower', 'The Fifth Season', 'Who Fears Death'],
      isFollowed: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'following'>('all');

  const toggleFollow = (genreId: string) => {
    setGenres(genres.map(genre => 
      genre.id === genreId 
        ? { ...genre, isFollowed: !genre.isFollowed }
        : genre
    ));
  };

  const filteredGenres = filter === 'following' 
    ? genres.filter(genre => genre.isFollowed)
    : genres;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discover Genres</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Genres
          </button>
          <button
            onClick={() => setFilter('following')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'following' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Featured Genres */}
      <div className="card gradient-bg text-white">
        <h3 className="text-xl font-bold mb-4">Trending This Week</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Dark Academia</h4>
            <p className="text-sm opacity-90">+45% engagement this week</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Cozy Fantasy</h4>
            <p className="text-sm opacity-90">+32% new followers</p>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Spicy Romance</h4>
            <p className="text-sm opacity-90">+28% book additions</p>
          </div>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGenres.map((genre) => (
          <div key={genre.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold">{genre.name}</h3>
                  {genre.isFollowed && (
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{genre.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{genre.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleFollow(genre.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  genre.isFollowed
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {genre.isFollowed ? 'Unfollow' : 'Follow'}
              </button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2 flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>Trending Books</span>
              </h4>
              <div className="space-y-1">
                {genre.trendingBooks.map((book, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                    <span className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span>{book}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Join Community</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGenres.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No genres found</h3>
          <p className="text-gray-500">
            {filter === 'following' 
              ? "You're not following any genres yet. Explore and follow genres that interest you!"
              : "No genres available at the moment."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreDiscovery;