# Angular Posts & Comments Application

A modern Angular application that displays posts and comments with advanced features, using a JSON server as a REST API backend. The application prominently displays all available API endpoints on the homepage for easy developer reference.

## Features

- **API Endpoints Display**: All REST API endpoints prominently displayed on homepage
- **Post Management**: Display posts with professional pagination using ng-bootstrap
- **Comments System**: View comments for each post with toggle functionality
- **Bulk Operations**: "Open/Collapse All Comments" button for easy comment management
- **Component Architecture**: Clean separation with dedicated child components
- **Responsive Design**: Bootstrap-powered responsive UI
- **REST API Integration**: JSON server backend with proper error handling
- **Loading States**: Smooth loading indicators and user feedback

## Recent Updates

### Enhanced Features
- **API Endpoints Display**: All REST API endpoints prominently displayed on homepage
- **ng-bootstrap Pagination**: Professional pagination controls with first/last page buttons
- **Post Comments Component**: Dedicated child component for comments management
- **Bulk Comment Toggle**: Single button to open or collapse all comments simultaneously
- **Improved UX**: Better visual feedback and intuitive controls

### Technical Improvements
- **Component Architecture**: Clean separation of concerns with parent-child components
- **State Management**: Efficient comment visibility state handling
- **Performance**: Optimized rendering and event handling
- **Accessibility**: ARIA labels and keyboard navigation support

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── post-list/           # Main posts listing component
│   │   │   ├── post-list.component.ts
│   │   │   ├── post-list.component.html
│   │   │   └── post-list.component.scss
│   │   └── post-comments/       # Child component for comments
│   │       ├── post-comments.component.ts
│   │       ├── post-comments.component.html
│   │       └── post-comments.component.scss
│   ├── models/                  # TypeScript interfaces
│   │   ├── post.model.ts
│   │   ├── comment.model.ts
│   │   └── user.model.ts
│   ├── services/                # API services
│   │   └── api.service.ts
│   ├── app.component.*          # Root component
│   └── app.module.ts            # Main application module
├── index.html
├── main.ts
└── styles.scss
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the JSON server:**
   ```bash
   npm run server
   ```
   This starts the JSON server on http://localhost:3000

3. **Start the Angular development server:**
   ```bash
   npm run serve
   ```
   This starts the Angular app on http://localhost:4200

### Development Commands
- `npm run serve` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start JSON server
- `npm test` - Run unit tests

## API Endpoints

All API endpoints are prominently displayed on the application homepage for easy developer reference. The JSON Server provides a full REST API with the following endpoints:

### Posts Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | Get all posts |
| GET | `/posts?_page=1&_limit=20` | Get posts with pagination |
| GET | `/posts/:id` | Get single post by ID |
| GET | `/posts?_embed=comments` | Get posts with embedded comments |
| POST | `/posts` | Create new post |
| PUT | `/posts/:id` | Update post by ID |
| DELETE | `/posts/:id` | Delete post by ID |

### Comments Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments` | Get all comments |
| GET | `/comments?postId=:id` | Get comments for specific post |
| GET | `/comments/:id` | Get single comment by ID |
| POST | `/comments` | Create new comment |
| PUT | `/comments/:id` | Update comment by ID |
| DELETE | `/comments/:id` | Delete comment by ID |

### Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get single user by ID |

### Data Structure

#### Post Object
```json
{
  "id": 1,
  "title": "Post Title",
  "body": "Post content...",
  "userId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### Comment Object
```json
{
  "id": 1,
  "postId": 1,
  "body": "Comment content...",
  "userId": 1,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### User Object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe"
}
```

### API Features

- **Full CRUD operations** for posts, comments, and users
- **Pagination support** using `_page` and `_limit` query parameters
- **Filtering** by post ID for comments
- **Embedded relationships** using `_embed` parameter
- **Real-time updates** through the Angular frontend

### Usage Examples

#### Get all posts with pagination
```bash
curl "http://localhost:3000/posts?_page=1&_limit=10"
```

#### Get posts with embedded comments
```bash
curl "http://localhost:3000/posts?_embed=comments"
```

#### Get comments for a specific post
```bash
curl "http://localhost:3000/comments?postId=1"
```

#### Create a new post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","body":"Post content","userId":1}'
```

## Component Architecture

### PostListComponent
- Main component displaying paginated posts
- Manages post data and pagination state
- Handles bulk comment operations
- Integrates ng-bootstrap pagination

### PostCommentsComponent
- Child component for displaying post comments
- Handles individual comment toggle functionality
- Receives data via Input properties
- Clean separation of comments logic

## Technologies Used

- **Angular 17+** - Modern Angular framework
- **TypeScript** - Type-safe JavaScript
- **Bootstrap 5** - Responsive CSS framework
- **ng-bootstrap** - Bootstrap components for Angular
- **JSON Server** - Mock REST API
- **RxJS** - Reactive programming library

## Key Features Implementation

### ng-bootstrap Pagination
- Professional pagination controls
- First/Last page navigation
- Limited visible page buttons for clean UI
- Accessible with ARIA labels

### Comments Management
- Individual comment toggle per post
- Bulk open/collapse all comments
- Smooth animations and transitions
- Responsive comment display

### Component Communication
- Parent-child component communication via Inputs
- Clean separation of concerns
- Reusable components
- Maintainable code structure

## Development Notes

This application demonstrates:
- Modern Angular development practices
- Component-based architecture
- REST API integration
- State management patterns
- User experience best practices
- Accessibility considerations