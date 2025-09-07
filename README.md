# Diginer - Your BookTok to Reality Reading Companion

![Diginer Logo](https://via.placeholder.com/200x80/667eea/ffffff?text=DIGINER)

**Tagline:** Your BookTok to Reality Reading Companion

Diginer helps avid BookTok users discover niche genres, interact with authors, and easily create personalized reading lists from trending TikToks, all within a Base MiniApp.

## 🚀 Features

### Core Features

1. **📚 Personalized Reading Lists from TikToks**
   - Automatically aggregates book titles mentioned in BookTok videos
   - Create lists via frame actions or by sharing TikTok video links
   - Never lose a book recommendation again

2. **🎭 Niche Genre Discovery**
   - Explore and join dedicated communities for specific book genres
   - Connect with fellow readers who share your passion
   - Discover even the most obscure genres

3. **👥 Author AMAs & Direct Interaction**
   - Scheduled or on-demand Q&A sessions with authors
   - Direct interaction with your favorite creators
   - Get your burning questions answered

4. **📊 Curated Trend Reports**
   - Data-driven insights into emerging BookTok trends
   - Author spotlights and genre analyses
   - Stay ahead of the next big read

## 💰 Business Model

- **Micro-transactions:** Pay-per-list generation ($0.25)
- **Premium Subscription:** Unlimited lists and advanced analytics ($4.99/mo)
- **Alternative Revenue:** Affiliate links, sponsored AMAs, freemium features

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom design system
- **Blockchain:** Base (Ethereum L2)
- **Wallet Integration:** RainbowKit + Wagmi
- **Payment Processing:** x402-axios for micro-transactions
- **Social Integration:** Farcaster Frames
- **State Management:** React Context + useReducer

## 🏗 Architecture

### Data Models

```typescript
interface User {
  user_id: string;
  farcaster_id?: string;
  wallet_address: string;
  username: string;
  reading_lists: string[];
  followed_genres: string[];
}

interface ReadingList {
  list_id: string;
  user_id: string;
  name: string;
  books: Book[];
  source_tiktok_urls: string[];
  is_public: boolean;
}

interface Book {
  book_id: string;
  title: string;
  author: string;
  isbn?: string;
  cover_image_url: string;
  genre_ids: string[];
  trending_score: number;
}

interface Genre {
  genre_id: string;
  name: string;
  description: string;
  trending_tiktoks: string[];
  member_count: number;
  trending_books: Book[];
}

interface AMA {
  ama_id: string;
  author_id: string;
  title: string;
  schedule: string;
  audience_genre: string[];
  status: 'upcoming' | 'live' | 'completed';
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/-app-development-0729.git
   cd -app-development-0729
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=https://api.diginer.app
   VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
   VITE_FARCASTER_APP_FID=your_farcaster_fid
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

## 📱 User Flows

### Creating a Reading List from TikTok

1. User sees a BookTok video suggestion
2. User clicks 'Add to List' button within the Farcaster frame
3. Frame action submits TikTok URL to Diginer backend
4. Backend processes URL and extracts book titles
5. New reading list is generated and saved to user's profile
6. User receives confirmation with options to view or add more books

### Discovering a Niche Genre

1. User navigates to 'Genres' tab in the MiniApp
2. User scrolls through featured niche genres
3. User clicks on a genre (e.g., 'Cozy Fantasy')
4. Frame displays trending books and discussions within that genre
5. User can 'Join Genre Community' or 'Follow Genre'
6. User is added to relevant Farcaster channel or gets genre tags

## 🎨 Design System

### Colors
- **Primary:** `hsl(240, 50%, 55%)` - Deep purple
- **Accent:** `hsl(20, 80%, 60%)` - Warm orange
- **Surface:** `hsl(0, 0%, 100%)` - Pure white
- **Background:** `hsl(240, 10%, 95%)` - Light gray

### Typography
- **Display:** `text-3xl font-bold` - For headings
- **Body:** `text-base font-normal leading-6` - For content

### Components
- **BookCard:** Book display with cover, title, author
- **GenreTag:** Genre labels with active/inactive states
- **AuthorAvatar:** Author profile images in multiple sizes
- **ListPreview:** Reading list previews in horizontal/vertical layouts
- **ActionFrame:** Farcaster frame actions for CTA/Info

## 🔌 API Documentation

### Base URL
```
https://api.diginer.app
```

### Authentication
All API requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Endpoints

#### Users
```typescript
GET    /users/{walletAddress}           // Get user profile
PATCH  /users/{userId}                  // Update user profile
POST   /users/{userId}/genres/{genreId}/follow    // Follow genre
DELETE /users/{userId}/genres/{genreId}/follow    // Unfollow genre
```

#### Reading Lists
```typescript
GET    /users/{userId}/reading-lists    // Get user's reading lists
POST   /reading-lists                   // Create new reading list
PATCH  /reading-lists/{listId}          // Update reading list
DELETE /reading-lists/{listId}          // Delete reading list
POST   /reading-lists/from-tiktok       // Create list from TikTok URL
```

#### Books
```typescript
GET    /books/search?q={query}          // Search books
GET    /books/{bookId}                  // Get book details
GET    /books/trending                  // Get trending books
```

#### Genres
```typescript
GET    /genres                          // Get all genres
GET    /genres/{genreId}                // Get genre details
GET    /genres/trending                 // Get trending genres
```

#### AMAs
```typescript
GET    /amas/upcoming                   // Get upcoming AMAs
GET    /amas/{amaId}                    // Get AMA details
POST   /amas/{amaId}/join               // Join AMA
DELETE /amas/{amaId}/join               // Leave AMA
```

#### TikTok Integration
```typescript
POST   /tiktok/extract-books            // Extract books from TikTok URL
POST   /tiktok/validate                 // Validate TikTok URL
```

#### Farcaster Integration
```typescript
POST   /farcaster/frame-action          // Create frame action
GET    /farcaster/users/{fid}           // Get user by Farcaster ID
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Docker Deployment

```dockerfile
# Use the provided Dockerfile
docker build -t diginer .
docker run -p 3000:3000 diginer
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.diginer.app
VITE_ENVIRONMENT=production
VITE_WALLET_CONNECT_PROJECT_ID=your_production_project_id
VITE_FARCASTER_APP_FID=your_production_farcaster_fid
VITE_ENABLE_ANALYTICS=true
```

## 🧪 Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### E2E Testing
```bash
npm run test:e2e
# or
yarn test:e2e
```

## 📊 Analytics & Monitoring

### Feature Flags
- `VITE_ENABLE_TIKTOK_INTEGRATION` - Enable/disable TikTok features
- `VITE_ENABLE_FARCASTER_FRAMES` - Enable/disable Farcaster integration
- `VITE_ENABLE_PAYMENT_FEATURES` - Enable/disable payment functionality
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics tracking

### Error Monitoring
Configure Sentry for production error tracking:
```env
VITE_SENTRY_DSN=your_sentry_dsn_here
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the existing design system components
- Write tests for new features
- Update documentation for API changes
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [docs.diginer.app](https://docs.diginer.app)
- **Discord:** [Join our community](https://discord.gg/diginer)
- **Email:** support@diginer.app

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core reading list functionality
- ✅ Genre discovery and following
- ✅ Basic TikTok integration
- ✅ Farcaster frame actions
- ✅ Micro-transaction payments

### Phase 2 (Next)
- 🔄 Advanced TikTok book extraction
- 🔄 Real-time author AMAs
- 🔄 Enhanced trend analytics
- 🔄 Mobile app (React Native)

### Phase 3 (Future)
- 📋 AI-powered book recommendations
- 📋 Social reading challenges
- 📋 Publisher partnerships
- 📋 NFT book collections

---

**Built with ❤️ for the BookTok community**
