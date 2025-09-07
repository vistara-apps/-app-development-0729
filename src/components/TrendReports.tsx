import React, { useState } from 'react';
import { TrendingUp, BarChart3, Eye, Calendar, BookOpen, Users, Star } from 'lucide-react';

interface TrendData {
  title: string;
  change: number;
  current: number;
  previous: number;
  category: string;
}

interface TrendReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  highlights: string[];
  topBooks: Array<{
    title: string;
    author: string;
    growth: number;
  }>;
  topGenres: Array<{
    name: string;
    engagement: number;
    change: number;
  }>;
}

const TrendReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  
  const trendData: TrendData[] = [
    { title: 'Total BookTok Mentions', change: 23, current: 45600, previous: 37000, category: 'engagement' },
    { title: 'New Authors Discovered', change: 15, current: 128, previous: 111, category: 'authors' },
    { title: 'Genre Diversity Score', change: 8, current: 87, previous: 81, category: 'diversity' },
    { title: 'Reading List Creations', change: 31, current: 2340, previous: 1790, category: 'lists' }
  ];

  const reports: TrendReport[] = [
    {
      id: '1',
      title: 'Weekly BookTok Trend Report',
      date: '2024-02-12',
      summary: 'Dark academia continues to dominate, while cozy fantasy sees unprecedented growth.',
      highlights: [
        'Dark Academia books mentioned 2.3x more than last week',
        'Cozy Fantasy sees 45% increase in new followers',
        'Romance remains steady with consistent engagement',
        'New indie horror titles gaining traction'
      ],
      topBooks: [
        { title: 'Fourth Wing', author: 'Rebecca Yarros', growth: 67 },
        { title: 'The Seven Moons of Maali Almeida', author: 'Shehan Karunatilaka', growth: 45 },
        { title: 'Book Lovers', author: 'Emily Henry', growth: 38 }
      ],
      topGenres: [
        { name: 'Dark Academia', engagement: 89, change: 23 },
        { name: 'Cozy Fantasy', engagement: 76, change: 45 },
        { name: 'Spicy Romance', engagement: 82, change: 12 }
      ]
    },
    {
      id: '2',
      title: 'Monthly Genre Deep Dive',
      date: '2024-02-01',
      summary: 'Analysis of genre trends and emerging patterns in BookTok recommendations.',
      highlights: [
        'Fantasy Romance dominates with 34% of all mentions',
        'Contemporary Fiction sees surprising surge',
        'Indie publishers gaining more visibility',
        'International authors trending upward'
      ],
      topBooks: [
        { title: 'The Atlas Six', author: 'Olivie Blake', growth: 52 },
        { title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', growth: 41 },
        { title: 'Mexican Gothic', author: 'Silvia Moreno-Garcia', growth: 35 }
      ],
      topGenres: [
        { name: 'Fantasy Romance', engagement: 92, change: 18 },
        { name: 'Contemporary Fiction', engagement: 71, change: 29 },
        { name: 'Magical Realism', engagement: 68, change: 22 }
      ]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Eye className="w-5 h-5" />;
      case 'authors': return <Users className="w-5 h-5" />;
      case 'diversity': return <Star className="w-5 h-5" />;
      case 'lists': return <BookOpen className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trend Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'week' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'month' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'quarter' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Quarter
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendData.map((data, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-600">
                {getCategoryIcon(data.category)}
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                data.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${data.change < 0 ? 'rotate-180' : ''}`} />
                <span>{data.change > 0 ? '+' : ''}{data.change}%</span>
              </div>
            </div>
            <h3 className="font-semibold text-sm text-gray-600 mb-1">{data.title}</h3>
            <p className="text-2xl font-bold text-primary">{formatNumber(data.current)}</p>
            <p className="text-xs text-gray-500 mt-1">
              vs {formatNumber(data.previous)} last {selectedPeriod}
            </p>
          </div>
        ))}
      </div>

      {/* Trend Reports */}
      <div className="space-y-6">
        {reports.map((report) => (
          <div key={report.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(report.date).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="btn-primary text-sm">
                View Full Report
              </button>
            </div>

            <p className="text-gray-700 mb-6">{report.summary}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Key Highlights */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Key Highlights</span>
                </h4>
                <ul className="space-y-2">
                  {report.highlights.map((highlight, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Books */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Trending Books</span>
                </h4>
                <div className="space-y-3">
                  {report.topBooks.map((book, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-sm">{book.title}</p>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                      <span className="text-green-600 text-sm font-medium">+{book.growth}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Genres */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Top Genres</span>
                </h4>
                <div className="space-y-3">
                  {report.topGenres.map((genre, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{genre.name}</p>
                        <span className="text-green-600 text-sm font-medium">+{genre.change}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${genre.engagement}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="card border-2 border-dashed border-gray-300">
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">More Analytics Coming Soon</h3>
          <p className="text-gray-500 mb-4">
            We're working on advanced analytics including author sentiment analysis, 
            predictive trending, and personalized insights.
          </p>
          <button className="btn-primary">
            Request Early Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendReports;