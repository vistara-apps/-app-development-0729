import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { User, ReadingList, Genre, AMA, Book } from '../services/api';
import { userAPI, readingListAPI, genreAPI, amaAPI } from '../services/api';

// Types
interface AppState {
  user: User | null;
  readingLists: ReadingList[];
  genres: Genre[];
  followedGenres: Genre[];
  upcomingAMAs: AMA[];
  trendingBooks: Book[];
  loading: {
    user: boolean;
    lists: boolean;
    genres: boolean;
    amas: boolean;
    trends: boolean;
  };
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_READING_LISTS'; payload: ReadingList[] }
  | { type: 'ADD_READING_LIST'; payload: ReadingList }
  | { type: 'UPDATE_READING_LIST'; payload: ReadingList }
  | { type: 'DELETE_READING_LIST'; payload: string }
  | { type: 'SET_GENRES'; payload: Genre[] }
  | { type: 'SET_FOLLOWED_GENRES'; payload: Genre[] }
  | { type: 'FOLLOW_GENRE'; payload: Genre }
  | { type: 'UNFOLLOW_GENRE'; payload: string }
  | { type: 'SET_UPCOMING_AMAS'; payload: AMA[] }
  | { type: 'SET_TRENDING_BOOKS'; payload: Book[] }
  | { type: 'RESET_STATE' };

const initialState: AppState = {
  user: null,
  readingLists: [],
  genres: [],
  followedGenres: [],
  upcomingAMAs: [],
  trendingBooks: [],
  loading: {
    user: false,
    lists: false,
    genres: false,
    amas: false,
    trends: false,
  },
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'SET_READING_LISTS':
      return {
        ...state,
        readingLists: action.payload,
      };

    case 'ADD_READING_LIST':
      return {
        ...state,
        readingLists: [...state.readingLists, action.payload],
      };

    case 'UPDATE_READING_LIST':
      return {
        ...state,
        readingLists: state.readingLists.map(list =>
          list.list_id === action.payload.list_id ? action.payload : list
        ),
      };

    case 'DELETE_READING_LIST':
      return {
        ...state,
        readingLists: state.readingLists.filter(list => list.list_id !== action.payload),
      };

    case 'SET_GENRES':
      return {
        ...state,
        genres: action.payload,
      };

    case 'SET_FOLLOWED_GENRES':
      return {
        ...state,
        followedGenres: action.payload,
      };

    case 'FOLLOW_GENRE':
      return {
        ...state,
        followedGenres: [...state.followedGenres, action.payload],
      };

    case 'UNFOLLOW_GENRE':
      return {
        ...state,
        followedGenres: state.followedGenres.filter(genre => genre.genre_id !== action.payload),
      };

    case 'SET_UPCOMING_AMAS':
      return {
        ...state,
        upcomingAMAs: action.payload,
      };

    case 'SET_TRENDING_BOOKS':
      return {
        ...state,
        trendingBooks: action.payload,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    loadUserProfile: (walletAddress: string) => Promise<void>;
    loadReadingLists: (userId: string) => Promise<void>;
    createReadingList: (listData: Omit<ReadingList, 'list_id' | 'created_at' | 'updated_at'>) => Promise<ReadingList>;
    updateReadingList: (listId: string, updates: Partial<ReadingList>) => Promise<void>;
    deleteReadingList: (listId: string) => Promise<void>;
    loadGenres: () => Promise<void>;
    followGenre: (userId: string, genreId: string) => Promise<void>;
    unfollowGenre: (userId: string, genreId: string) => Promise<void>;
    loadUpcomingAMAs: () => Promise<void>;
    loadTrendingBooks: (genreId?: string) => Promise<void>;
    createListFromTikTok: (userId: string, tiktokUrl: string, listName?: string) => Promise<ReadingList>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { address, isConnected } = useAccount();

  // Actions
  const actions = {
    async loadUserProfile(walletAddress: string) {
      dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: true } });
      try {
        const user = await userAPI.getProfile(walletAddress);
        dispatch({ type: 'SET_USER', payload: user });
        
        // Load user's followed genres
        const followedGenres = state.genres.filter(genre => 
          user.followed_genres.includes(genre.genre_id)
        );
        dispatch({ type: 'SET_FOLLOWED_GENRES', payload: followedGenres });
        
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to load user profile:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user profile' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: false } });
      }
    },

    async loadReadingLists(userId: string) {
      dispatch({ type: 'SET_LOADING', payload: { key: 'lists', value: true } });
      try {
        const lists = await readingListAPI.getUserLists(userId);
        dispatch({ type: 'SET_READING_LISTS', payload: lists });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to load reading lists:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load reading lists' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'lists', value: false } });
      }
    },

    async createReadingList(listData: Omit<ReadingList, 'list_id' | 'created_at' | 'updated_at'>) {
      try {
        const newList = await readingListAPI.createList(listData);
        dispatch({ type: 'ADD_READING_LIST', payload: newList });
        return newList;
      } catch (error) {
        console.error('Failed to create reading list:', error);
        throw error;
      }
    },

    async updateReadingList(listId: string, updates: Partial<ReadingList>) {
      try {
        const updatedList = await readingListAPI.updateList(listId, updates);
        dispatch({ type: 'UPDATE_READING_LIST', payload: updatedList });
      } catch (error) {
        console.error('Failed to update reading list:', error);
        throw error;
      }
    },

    async deleteReadingList(listId: string) {
      try {
        await readingListAPI.deleteList(listId);
        dispatch({ type: 'DELETE_READING_LIST', payload: listId });
      } catch (error) {
        console.error('Failed to delete reading list:', error);
        throw error;
      }
    },

    async loadGenres() {
      dispatch({ type: 'SET_LOADING', payload: { key: 'genres', value: true } });
      try {
        const genres = await genreAPI.getAllGenres();
        dispatch({ type: 'SET_GENRES', payload: genres });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to load genres:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load genres' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'genres', value: false } });
      }
    },

    async followGenre(userId: string, genreId: string) {
      try {
        await userAPI.followGenre(userId, genreId);
        const genre = state.genres.find(g => g.genre_id === genreId);
        if (genre) {
          dispatch({ type: 'FOLLOW_GENRE', payload: genre });
        }
      } catch (error) {
        console.error('Failed to follow genre:', error);
        throw error;
      }
    },

    async unfollowGenre(userId: string, genreId: string) {
      try {
        await userAPI.unfollowGenre(userId, genreId);
        dispatch({ type: 'UNFOLLOW_GENRE', payload: genreId });
      } catch (error) {
        console.error('Failed to unfollow genre:', error);
        throw error;
      }
    },

    async loadUpcomingAMAs() {
      dispatch({ type: 'SET_LOADING', payload: { key: 'amas', value: true } });
      try {
        const amas = await amaAPI.getUpcomingAMAs();
        dispatch({ type: 'SET_UPCOMING_AMAS', payload: amas });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to load AMAs:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load AMAs' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'amas', value: false } });
      }
    },

    async loadTrendingBooks(genreId?: string) {
      dispatch({ type: 'SET_LOADING', payload: { key: 'trends', value: true } });
      try {
        const books = await bookAPI.getTrendingBooks(genreId);
        dispatch({ type: 'SET_TRENDING_BOOKS', payload: books });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        console.error('Failed to load trending books:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load trending books' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'trends', value: false } });
      }
    },

    async createListFromTikTok(userId: string, tiktokUrl: string, listName?: string) {
      try {
        const newList = await readingListAPI.createFromTikTok(userId, tiktokUrl, listName);
        dispatch({ type: 'ADD_READING_LIST', payload: newList });
        return newList;
      } catch (error) {
        console.error('Failed to create list from TikTok:', error);
        throw error;
      }
    },
  };

  // Load initial data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      actions.loadUserProfile(address);
      actions.loadGenres();
      actions.loadUpcomingAMAs();
    } else {
      dispatch({ type: 'RESET_STATE' });
    }
  }, [isConnected, address]);

  // Load user-specific data when user is loaded
  useEffect(() => {
    if (state.user) {
      actions.loadReadingLists(state.user.user_id);
      actions.loadTrendingBooks();
    }
  }, [state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
