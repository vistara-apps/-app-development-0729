import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Heart, TrendingUp, ExternalLink } from 'lucide-react';
import { farcasterAPI, tiktokAPI } from '../services/api';
import { useApp } from '../contexts/AppContext';

interface FrameProps {
  frameType: 'create-list' | 'genre-discovery' | 'book-recommendation';
  initialData?: any;
}

interface FrameState {
  step: number;
  data: any;
  loading: boolean;
  error: string | null;
}

const FarcasterFrame: React.FC<FrameProps> = ({ frameType, initialData = {} }) => {
  const { state, actions } = useApp();
  const [frameState, setFrameState] = useState<FrameState>({
    step: 1,
    data: initialData,
    loading: false,
    error: null,
  });

  const updateFrameState = (updates: Partial<FrameState>) => {
    setFrameState(prev => ({ ...prev, ...updates }));
  };

  // Create List from TikTok Frame
  const CreateListFrame = () => {
    const [tiktokUrl, setTiktokUrl] = useState('');
    const [listName, setListName] = useState('');
    const [extractedBooks, setExtractedBooks] = useState<any[]>([]);

    const handleTikTokSubmit = async () => {
      if (!state.user) return;
      
      updateFrameState({ loading: true, error: null });
      
      try {
        // Validate TikTok URL
        const isValid = await tiktokAPI.validateTikTokUrl(tiktokUrl);
        if (!isValid) {
          throw new Error('Invalid TikTok URL');
        }

        // Extract books from TikTok
        const result = await tiktokAPI.extractBooksFromUrl(tiktokUrl);
        setExtractedBooks(result.books);
        
        // Auto-generate list name if not provided
        if (!listName) {
          setListName(`BookTok List - ${new Date().toLocaleDateString()}`);
        }

        updateFrameState({ step: 2 });
      } catch (error) {
        updateFrameState({ error: (error as Error).message });
      } finally {
        updateFrameState({ loading: false });
      }
    };

    const handleCreateList = async () => {
      if (!state.user) return;

      updateFrameState({ loading: true });
      
      try {
        await actions.createListFromTikTok(state.user.user_id, tiktokUrl, listName);
        
        // Create Farcaster frame action
        await farcasterAPI.createFrameAction('list_created', {
          list_name: listName,
          book_count: extractedBooks.length,
          tiktok_url: tiktokUrl,
        });

        updateFrameState({ step: 3 });
      } catch (error) {
        updateFrameState({ error: 'Failed to create reading list' });
      } finally {
        updateFrameState({ loading: false });
      }
    };

    switch (frameState.step) {
      case 1:
        return (
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-4">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-2" />
              <h2 className="text-xl font-bold">Create List from TikTok</h2>
              <p className="text-gray-600 text-sm">Turn BookTok videos into organized reading lists</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">TikTok URL</label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@user/video/..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">List Name (Optional)</label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="My BookTok Finds"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                onClick={handleTikTokSubmit}
                disabled={!tiktokUrl || frameState.loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {frameState.loading ? 'Processing...' : 'Extract Books'}
              </button>
            </div>

            {frameState.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{frameState.error}</p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="card max-w-md mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">Review Extracted Books</h2>
              <p className="text-gray-600 text-sm">Found {extractedBooks.length} books</p>
            </div>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {extractedBooks.map((book, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{book.title}</p>
                    <p className="text-xs text-gray-600">by {book.author}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCreateList}
                disabled={frameState.loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {frameState.loading ? 'Creating List...' : `Create "${listName}"`}
              </button>
              
              <button
                onClick={() => updateFrameState({ step: 1 })}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="card max-w-md mx-auto text-center">
            <div className="text-green-600 mb-4">
              <BookOpen className="w-16 h-16 mx-auto mb-2" />
              <h2 className="text-xl font-bold">List Created Successfully!</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              "{listName}" has been added to your reading lists with {extractedBooks.length} books.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => window.open('/lists', '_blank')}
                className="w-full btn-primary"
              >
                <ExternalLink className="w-4 h-4 inline mr-2" />
                View My Lists
              </button>
              
              <button
                onClick={() => updateFrameState({ step: 1, data: {}, error: null })}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Create Another List
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Genre Discovery Frame
  const GenreDiscoveryFrame = () => {
    const [selectedGenre, setSelectedGenre] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollowGenre = async (genre: any) => {
      if (!state.user) return;

      try {
        await actions.followGenre(state.user.user_id, genre.genre_id);
        setIsFollowing(true);
        
        // Create Farcaster frame action
        await farcasterAPI.createFrameAction('genre_followed', {
          genre_id: genre.genre_id,
          genre_name: genre.name,
        });
      } catch (error) {
        console.error('Failed to follow genre:', error);
      }
    };

    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center mb-4">
          <Heart className="w-12 h-12 text-accent mx-auto mb-2" />
          <h2 className="text-xl font-bold">Discover Genres</h2>
          <p className="text-gray-600 text-sm">Find your reading tribe</p>
        </div>

        {!selectedGenre ? (
          <div className="space-y-3">
            {state.genres.slice(0, 5).map((genre) => (
              <button
                key={genre.genre_id}
                onClick={() => setSelectedGenre(genre)}
                className="w-full p-3 text-left border rounded-md hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium">{genre.name}</h3>
                <p className="text-sm text-gray-600 truncate">{genre.description}</p>
                <p className="text-xs text-gray-500 mt-1">{genre.member_count} members</p>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-bold">{selectedGenre.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{selectedGenre.description}</p>
              <p className="text-xs text-gray-500">{selectedGenre.member_count} members</p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Trending Books:</h4>
              <div className="space-y-2">
                {selectedGenre.trending_books?.slice(0, 3).map((book: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-gray-600">by {book.author}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {!isFollowing ? (
                <button
                  onClick={() => handleFollowGenre(selectedGenre)}
                  className="w-full btn-primary"
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Follow Genre
                </button>
              ) : (
                <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-center">
                  <p className="text-green-600 font-medium">Following {selectedGenre.name}!</p>
                </div>
              )}
              
              <button
                onClick={() => setSelectedGenre(null)}
                className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Back to Genres
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Book Recommendation Frame
  const BookRecommendationFrame = () => {
    const [currentBookIndex, setCurrentBookIndex] = useState(0);
    const trendingBooks = state.trendingBooks.slice(0, 5);

    if (trendingBooks.length === 0) {
      return (
        <div className="card max-w-md mx-auto text-center">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
          <h2 className="text-xl font-bold">No Trending Books</h2>
          <p className="text-gray-600 text-sm">Check back later for recommendations!</p>
        </div>
      );
    }

    const currentBook = trendingBooks[currentBookIndex];

    const handleNext = () => {
      setCurrentBookIndex((prev) => (prev + 1) % trendingBooks.length);
    };

    const handleAddToList = async () => {
      // This would open a modal to select which list to add to
      console.log('Add to list:', currentBook);
    };

    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center mb-4">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
          <h2 className="text-xl font-bold">Trending Now</h2>
          <p className="text-gray-600 text-sm">Book {currentBookIndex + 1} of {trendingBooks.length}</p>
        </div>

        <div className="text-center mb-6">
          <div className="w-32 h-48 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            {currentBook.cover_image_url ? (
              <img
                src={currentBook.cover_image_url}
                alt={currentBook.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <h3 className="text-lg font-bold mb-1">{currentBook.title}</h3>
          <p className="text-gray-600 mb-2">by {currentBook.author}</p>
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              Trending Score: {currentBook.trending_score}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAddToList}
            className="w-full btn-primary"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add to List
          </button>
          
          <button
            onClick={handleNext}
            className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Next Book
          </button>
        </div>
      </div>
    );
  };

  // Render appropriate frame based on type
  const renderFrame = () => {
    switch (frameType) {
      case 'create-list':
        return <CreateListFrame />;
      case 'genre-discovery':
        return <GenreDiscoveryFrame />;
      case 'book-recommendation':
        return <BookRecommendationFrame />;
      default:
        return <div>Unknown frame type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 flex items-center justify-center">
      {renderFrame()}
    </div>
  );
};

export default FarcasterFrame;
