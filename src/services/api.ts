import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.diginer.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  user_id: string;
  farcaster_id?: string;
  wallet_address: string;
  username: string;
  reading_lists: string[];
  followed_genres: string[];
  created_at: string;
  updated_at: string;
}

export interface ReadingList {
  list_id: string;
  user_id: string;
  name: string;
  books: Book[];
  created_at: string;
  updated_at: string;
  source_tiktok_urls: string[];
  is_public: boolean;
}

export interface Book {
  book_id: string;
  title: string;
  author: string;
  isbn?: string;
  cover_image_url: string;
  description?: string;
  genre_ids: string[];
  trending_score: number;
}

export interface Genre {
  genre_id: string;
  name: string;
  description: string;
  trending_tiktoks: string[];
  member_count: number;
  trending_books: Book[];
}

export interface AMA {
  ama_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  title: string;
  description: string;
  schedule: string;
  audience_genre: string[];
  status: 'upcoming' | 'live' | 'completed';
  participant_count: number;
}

export interface TrendData {
  category: string;
  title: string;
  current: number;
  previous: number;
  change: number;
  period: string;
}

// API Functions
export const userAPI = {
  async getProfile(walletAddress: string): Promise<User> {
    const response = await apiClient.get(`/users/${walletAddress}`);
    return response.data;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}`, updates);
    return response.data;
  },

  async followGenre(userId: string, genreId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/genres/${genreId}/follow`);
  },

  async unfollowGenre(userId: string, genreId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/genres/${genreId}/follow`);
  },
};

export const readingListAPI = {
  async getUserLists(userId: string): Promise<ReadingList[]> {
    const response = await apiClient.get(`/users/${userId}/reading-lists`);
    return response.data;
  },

  async createList(listData: Omit<ReadingList, 'list_id' | 'created_at' | 'updated_at'>): Promise<ReadingList> {
    const response = await apiClient.post('/reading-lists', listData);
    return response.data;
  },

  async updateList(listId: string, updates: Partial<ReadingList>): Promise<ReadingList> {
    const response = await apiClient.patch(`/reading-lists/${listId}`, updates);
    return response.data;
  },

  async deleteList(listId: string): Promise<void> {
    await apiClient.delete(`/reading-lists/${listId}`);
  },

  async addBookToList(listId: string, bookId: string): Promise<void> {
    await apiClient.post(`/reading-lists/${listId}/books/${bookId}`);
  },

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    await apiClient.delete(`/reading-lists/${listId}/books/${bookId}`);
  },

  async createFromTikTok(userId: string, tiktokUrl: string, listName?: string): Promise<ReadingList> {
    const response = await apiClient.post('/reading-lists/from-tiktok', {
      user_id: userId,
      tiktok_url: tiktokUrl,
      list_name: listName,
    });
    return response.data;
  },
};

export const bookAPI = {
  async searchBooks(query: string, limit = 20): Promise<Book[]> {
    const response = await apiClient.get('/books/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  async getBookDetails(bookId: string): Promise<Book> {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  },

  async getTrendingBooks(genreId?: string, limit = 10): Promise<Book[]> {
    const response = await apiClient.get('/books/trending', {
      params: { genre_id: genreId, limit },
    });
    return response.data;
  },
};

export const genreAPI = {
  async getAllGenres(): Promise<Genre[]> {
    const response = await apiClient.get('/genres');
    return response.data;
  },

  async getGenreDetails(genreId: string): Promise<Genre> {
    const response = await apiClient.get(`/genres/${genreId}`);
    return response.data;
  },

  async getTrendingGenres(limit = 10): Promise<Genre[]> {
    const response = await apiClient.get('/genres/trending', {
      params: { limit },
    });
    return response.data;
  },
};

export const amaAPI = {
  async getUpcomingAMAs(limit = 10): Promise<AMA[]> {
    const response = await apiClient.get('/amas/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  async getAMADetails(amaId: string): Promise<AMA> {
    const response = await apiClient.get(`/amas/${amaId}`);
    return response.data;
  },

  async joinAMA(amaId: string, userId: string): Promise<void> {
    await apiClient.post(`/amas/${amaId}/join`, { user_id: userId });
  },

  async leaveAMA(amaId: string, userId: string): Promise<void> {
    await apiClient.delete(`/amas/${amaId}/join`, { data: { user_id: userId } });
  },
};

export const trendAPI = {
  async getTrendData(period: 'day' | 'week' | 'month' = 'week'): Promise<TrendData[]> {
    const response = await apiClient.get('/trends', {
      params: { period },
    });
    return response.data;
  },

  async getBookTokTrends(limit = 20): Promise<any[]> {
    const response = await apiClient.get('/trends/booktok', {
      params: { limit },
    });
    return response.data;
  },

  async getGenreTrends(genreId: string, period = 'week'): Promise<TrendData[]> {
    const response = await apiClient.get(`/trends/genres/${genreId}`, {
      params: { period },
    });
    return response.data;
  },
};

// TikTok Integration Service
export const tiktokAPI = {
  async extractBooksFromUrl(url: string): Promise<{ books: Book[]; metadata: any }> {
    const response = await apiClient.post('/tiktok/extract-books', { url });
    return response.data;
  },

  async validateTikTokUrl(url: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/tiktok/validate', { url });
      return response.data.valid;
    } catch {
      return false;
    }
  },
};

// Farcaster Integration
export const farcasterAPI = {
  async createFrameAction(actionType: string, data: any): Promise<any> {
    const response = await apiClient.post('/farcaster/frame-action', {
      action_type: actionType,
      data,
    });
    return response.data;
  },

  async getUserByFid(fid: string): Promise<User | null> {
    try {
      const response = await apiClient.get(`/farcaster/users/${fid}`);
      return response.data;
    } catch {
      return null;
    }
  },
};

export default apiClient;
