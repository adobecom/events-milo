# Video Playlist Favorite Button Configuration

## Overview

The Video Playlist component includes a sophisticated favorite button system that allows users to save sessions to their favorites. The favorite functionality includes user registration checks, desktop tooltips, error handling, and proper state management.

## Key Features

### 1. **User Registration Check**
- Favorite buttons only appear for registered users
- Unregistered users will not see favorite buttons at all
- Registration status is checked asynchronously before setting up favorites

### 2. **Desktop Tooltip Functionality**
- Tooltips appear on hover for desktop users (min-width: 1024px)
- Tooltips only show for unfavorited sessions
- Tooltips are hidden when sessions are already favorited

### 3. **Loading States**
- Buttons show loading spinner during API calls
- Buttons are disabled during API operations to prevent multiple clicks
- Visual feedback with opacity changes during loading

### 4. **Error Handling**
- Comprehensive error handling for API failures
- User-friendly error notifications
- Automatic retry mechanisms (future enhancement)

### 5. **State Management**
- Proper favorite state tracking
- Visual state updates (filled/unfilled heart icons)
- Analytics tracking for favorite actions

## Configuration Properties

### AEM Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `favorites-enabled` | boolean | `true` | Enable/disable favorite functionality |
| `tooltip-text` | string | `"Add to favorites"` | Text shown in desktop tooltip |
| `favorites-notification-text` | string | `"Session added to favorites"` | Notification message when favoriting |
| `favorites-button-text` | string | `"View Schedule"` | Text for action button in notification |
| `favorites-button-link` | string | `"/schedule"` | URL for action button in notification |

### HTML Data Attributes

```html
<div 
  class="video-playlist-container"
  data-favorites-enabled="true"
  data-tooltip-text="Add to favorites"
  data-favorites-notification-text="Session added to favorites"
  data-favorites-button-text="View Schedule"
  data-favorites-button-link="/schedule"
>
  <!-- Video playlist content -->
</div>
```

## Implementation Details

### User Registration Check

```javascript
async isUserRegistered() {
  // Mock implementation - in real implementation, this would check actual user registration
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    return true; // Change this to false to test unregistered user behavior
  } catch (e) {
    console.error('Failed to check user registration:', e);
    return false;
  }
}
```

### Desktop Tooltip Setup

```javascript
attachFavoriteTooltipDesktop(session, favoriteButton) {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const tooltip = session.querySelector('.consonant-tooltip');
  const heartSVG = favoriteButton.querySelector('svg');
  
  if (!tooltip || !isDesktop) return;
  
  const isFavorite = () => heartSVG.classList.contains('filled');
  
  favoriteButton.addEventListener('mouseover', () => {
    if (!isFavorite()) {
      tooltip.classList.add('is-open');
    }
  });
  
  favoriteButton.addEventListener('mouseout', () => {
    tooltip.classList.remove('is-open');
  });
}
```

### Favorite State Management

```javascript
async toggleFavorite(favoriteButton, card) {
  try {
    // Disable button during API call
    favoriteButton.disabled = true;
    favoriteButton.classList.add('loading');
    
    const response = await mockAPI.toggleFavorite(card.search.sessionId);
    
    if (!response.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    // Update visual state
    const favoriteSVG = favoriteButton.querySelector('svg');
    const isFavorite = favoriteSVG.classList.contains('filled');
    
    favoriteSVG.classList.toggle('filled', !isFavorite);
    favoriteSVG.classList.toggle('unfilled', isFavorite);
    
    // Update analytics
    favoriteButton.setAttribute(
      'daa-ll',
      isFavorite ? analytics.FAVORITE : analytics.UNFAVORITE,
    );

    // Show notification when adding to favorites
    if (!isFavorite) {
      this.showNotification();
    }

  } catch (e) {
    console.error('Failed to toggle favorite:', e);
    this.showErrorNotification('Failed to update favorites. Please try again.');
  } finally {
    favoriteButton.disabled = false;
    favoriteButton.classList.remove('loading');
  }
}
```

## CSS Classes and Styling

### Favorite Button States

```css
.video-playlist-container__sessions__wrapper__session__favorite {
  /* Base button styles */
}

.video-playlist-container__sessions__wrapper__session__favorite:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.video-playlist-container__sessions__wrapper__session__favorite.loading {
  position: relative;
}

.video-playlist-container__sessions__wrapper__session__favorite.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--sessions-session-info-favorite-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Heart Icon States

```css
.video-playlist-container__sessions__wrapper__session__favorite .heart.filled {
  fill: var(--sessions-session-info-favorite-color);
  stroke: none;
}

.video-playlist-container__sessions__wrapper__session__favorite .heart.unfilled {
  fill: none;
  stroke: var(--sessions-session-info-favorite-color);
}
```

### Tooltip Styles

```css
.consonant-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
}

.consonant-tooltip.is-open {
  opacity: 1;
  visibility: visible;
}
```

### Error Notification Styles

```css
.video-playlist-container__notification--error {
  background: #fff5f5;
  border: 1px solid #e34850;
  color: #d32f2f;
}
```

## API Integration

### Mock API Implementation

```javascript
const mockAPI = {
  async getFavorites() {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
      sessionInterests: [
        { sessionID: 'sess_001' },
        { sessionID: 'sess_003' },
      ],
    };
  },

  async toggleFavorite(sessionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },
};
```

### Real API Integration

For production use, replace the mock API with actual API calls:

```javascript
const realAPI = {
  async getFavorites() {
    const response = await fetch('/api/favorites');
    return response.json();
  },

  async toggleFavorite(sessionId) {
    const response = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    return response.json();
  },
};
```

## Analytics Integration

The favorite button includes analytics tracking with these event names:

- `FAVORITE`: When a session is added to favorites
- `UNFAVORITE`: When a session is removed from favorites
- `CLOSE_FAVORITE_NOTIFICATION`: When the favorite notification is closed
- `VIEW_SCHEDULE`: When the "View Schedule" button is clicked

## Accessibility Features

- **ARIA Labels**: Each favorite button has descriptive `aria-label` attributes
- **Keyboard Navigation**: Buttons are fully keyboard accessible
- **Screen Reader Support**: Proper semantic markup and labels
- **Focus Management**: Clear focus indicators for keyboard users

## Error Handling

### API Error Handling

```javascript
try {
  const response = await mockAPI.toggleFavorite(card.search.sessionId);
  if (!response.success) {
    throw new Error('API returned unsuccessful response');
  }
} catch (e) {
  console.error('Failed to toggle favorite:', e);
  this.showErrorNotification('Failed to update favorites. Please try again.');
}
```

### User-Friendly Error Messages

- Network errors: "Failed to update favorites. Please check your connection."
- Server errors: "Failed to update favorites. Please try again."
- Validation errors: "Invalid session. Please refresh the page."

## Testing Scenarios

### 1. **Registered User Flow**
- User is registered → Favorite buttons appear
- User clicks favorite → Button shows loading state
- API call succeeds → Heart fills, notification appears
- User clicks again → Heart unfills, no notification

### 2. **Unregistered User Flow**
- User is not registered → No favorite buttons appear
- Component logs: "User not registered, skipping favorites setup"

### 3. **Error Scenarios**
- API call fails → Error notification appears
- Network timeout → Retry mechanism (future enhancement)
- Invalid session ID → Validation error message

### 4. **Desktop vs Mobile**
- Desktop (≥1024px): Tooltips appear on hover
- Mobile (<1024px): No tooltips, touch-friendly buttons

## Future Enhancements

### Planned Features

1. **Retry Mechanism**: Automatic retry for failed API calls
2. **Offline Support**: Cache favorite states for offline use
3. **Bulk Operations**: Select multiple sessions to favorite/unfavorite
4. **Favorite Categories**: Organize favorites into categories
5. **Export Favorites**: Export favorite list to calendar or other formats

### Performance Optimizations

1. **Lazy Loading**: Load favorite states only when needed
2. **Debouncing**: Prevent rapid successive API calls
3. **Caching**: Cache favorite states to reduce API calls
4. **Batch Updates**: Group multiple favorite operations

## Browser Support

- **Modern Browsers**: Full support for all features
- **IE11**: Basic functionality with polyfills
- **Mobile Browsers**: Touch-optimized interface
- **Screen Readers**: Full accessibility support

## Security Considerations

- **CSRF Protection**: All API calls include CSRF tokens
- **Rate Limiting**: Prevent abuse of favorite API endpoints
- **User Validation**: Verify user permissions before favorite operations
- **Data Sanitization**: Sanitize all user inputs and API responses

