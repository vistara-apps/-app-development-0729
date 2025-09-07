import React, { useState } from 'react';
import { X, Link, Upload, BookOpen, CreditCard, Loader2 } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

interface CreateListModalProps {
  onClose: () => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ onClose }) => {
  const [method, setMethod] = useState<'tiktok' | 'manual'>('tiktok');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [listName, setListName] = useState('');
  const [manualBooks, setManualBooks] = useState([{ title: '', author: '' }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [extractedBooks, setExtractedBooks] = useState<Array<{ title: string; author: string }>>([]);

  const { createSession } = usePaymentContext();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      await createSession();
      setPaid(true);
      
      // Simulate TikTok processing
      setTimeout(() => {
        setExtractedBooks([
          { title: 'Fourth Wing', author: 'Rebecca Yarros' },
          { title: 'Iron Flame', author: 'Rebecca Yarros' },
          { title: 'The Seven Moons of Maali Almeida', author: 'Shehan Karunatilaka' }
        ]);
        setListName('BookTok Recommendations - ' + new Date().toLocaleDateString());
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
      alert('Payment failed. Please connect your wallet and try again.');
    }
  };

  const addManualBook = () => {
    setManualBooks([...manualBooks, { title: '', author: '' }]);
  };

  const updateManualBook = (index: number, field: 'title' | 'author', value: string) => {
    const updated = manualBooks.map((book, i) => 
      i === index ? { ...book, [field]: value } : book
    );
    setManualBooks(updated);
  };

  const removeManualBook = (index: number) => {
    setManualBooks(manualBooks.filter((_, i) => i !== index));
  };

  const handleCreateList = () => {
    if (method === 'tiktok' && extractedBooks.length > 0) {
      // Create list with extracted books
      console.log('Creating list:', { name: listName, books: extractedBooks, source: tiktokUrl });
    } else if (method === 'manual' && manualBooks.some(book => book.title && book.author)) {
      // Create list with manual books
      const validBooks = manualBooks.filter(book => book.title && book.author);
      console.log('Creating manual list:', { name: listName, books: validBooks });
    }
    
    alert('Reading list created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Create New Reading List</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to create your list?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMethod('tiktok')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  method === 'tiktok' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Link className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-semibold">From TikTok URL</h3>
                <p className="text-sm text-gray-600">Extract books from BookTok videos</p>
                <p className="text-xs text-accent font-medium mt-1">$0.25 per list</p>
              </button>
              
              <button
                onClick={() => setMethod('manual')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  method === 'manual' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <BookOpen className="w-6 h-6 text-primary mb-2" />
                <h3 className="font-semibold">Manual Entry</h3>
                <p className="text-sm text-gray-600">Add books manually</p>
                <p className="text-xs text-green-600 font-medium mt-1">Free</p>
              </button>
            </div>
          </div>

          {/* TikTok Method */}
          {method === 'tiktok' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok Video URL
                </label>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@username/video/..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={paid}
                />
              </div>

              {!paid ? (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <CreditCard className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold">Premium List Generation</h3>
                      <p className="text-sm opacity-90">AI-powered book extraction from TikTok videos</p>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={!tiktokUrl || isProcessing}
                    className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay $0.25 & Generate List</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Books Extracted Successfully!</h4>
                    <p className="text-sm text-green-700">
                      We found {extractedBooks.length} books from the TikTok video.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      List Name
                    </label>
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extracted Books
                    </label>
                    <div className="space-y-2">
                      {extractedBooks.map((book, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-gray-600">by {book.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Method */}
          {method === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  List Name
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="My Awesome Reading List"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Books
                </label>
                <div className="space-y-3">
                  {manualBooks.map((book, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Book Title"
                          value={book.title}
                          onChange={(e) => updateManualBook(index, 'title', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Author Name"
                          value={book.author}
                          onChange={(e) => updateManualBook(index, 'author', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      {manualBooks.length > 1 && (
                        <button
                          onClick={() => removeManualBook(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addManualBook}
                  className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  + Add Another Book
                </button>
              </div>
            </div>
          )}

          {/* Create Button */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateList}
              disabled={
                (method === 'tiktok' && !paid) ||
                (method === 'manual' && !manualBooks.some(book => book.title && book.author)) ||
                !listName
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Reading List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;