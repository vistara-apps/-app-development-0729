import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit, ExternalLink } from 'lucide-react';

interface ReadingListsProps {
  onCreateList: () => void;
}

interface ReadingList {
  id: string;
  name: string;
  books: Book[];
  created_at: string;
  source_tiktok_urls: string[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url: string;
}

const ReadingLists: React.FC<ReadingListsProps> = ({ onCreateList }) => {
  const [lists] = useState<ReadingList[]>([
    {
      id: '1',
      name: 'Dark Academia Vibes',
      books: [
        { id: '1', title: 'The Secret History', author: 'Donna Tartt', cover_image_url: '/api/placeholder/120/180' },
        { id: '2', title: 'If We Were Villains', author: 'M.L. Rio', cover_image_url: '/api/placeholder/120/180' },
        { id: '3', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', cover_image_url: '/api/placeholder/120/180' },
      ],
      created_at: '2024-01-15',
      source_tiktok_urls: ['https://tiktok.com/@bookish_user/video1', 'https://tiktok.com/@bookish_user/video2']
    },
    {
      id: '2',
      name: 'Fantasy Romance Must-Reads',
      books: [
        { id: '4', title: 'Fourth Wing', author: 'Rebecca Yarros', cover_image_url: '/api/placeholder/120/180' },
        { id: '5', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', cover_image_url: '/api/placeholder/120/180' },
      ],
      created_at: '2024-01-10',
      source_tiktok_urls: ['https://tiktok.com/@fantasy_lover/video1']
    }
  ]);

  const [selectedList, setSelectedList] = useState<ReadingList | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Reading Lists</h2>
        <button onClick={onCreateList} className="btn-primary">
          <Plus className="w-4 h-4 inline mr-2" />
          Create New List
        </button>
      </div>

      {selectedList ? (
        // List Detail View
        <div className="animate-slide-up">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedList.name}</h3>
                <p className="text-gray-600">{selectedList.books.length} books</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedList(null)}
                  className="btn-primary"
                >
                  Back to Lists
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {selectedList.books.map((book) => (
                <div key={book.id} className="card hover:shadow-lg transition-shadow">
                  <div className="w-full h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h4>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </div>
              ))}
            </div>

            {selectedList.source_tiktok_urls.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Source TikToks</h4>
                <div className="space-y-2">
                  {selectedList.source_tiktok_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-sm">TikTok Video {index + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Lists Overview
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div 
              key={list.id} 
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedList(list)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{list.name}</h3>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-600 hover:text-primary">
                    <Edit className="w-3 h-3" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {list.books.slice(0, 3).map((book, index) => (
                  <div key={book.id} className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                {list.books.length > 3 && (
                  <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{list.books.length - 3}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{list.books.length} books</span>
                <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {/* Add New List Card */}
          <div 
            className="card border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer flex items-center justify-center min-h-[200px]"
            onClick={onCreateList}
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Create New List</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingLists;