# Video Playlist Block

## Overview

The Video Playlist Block is a comprehensive Milo component that provides a complete video playlist experience with session management, progress tracking, favorites functionality, and seamless integration with video players. It supports both tag-based (dynamic) and AEM-based (manual) playlists.

## Features

### Core Functionality
- **Session Management**: Display and navigate through multiple video sessions
- **Progress Tracking**: Save and restore video progress using localStorage
- **Autoplay Control**: "Play All" toggle for continuous playback
- **Favorites System**: User registration and session favoriting with notifications
- **Social Sharing**: Integrated social media sharing capabilities
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: WCAG compliant with skip links and proper ARIA labels

### Video Player Integration
- **MPC Player Support**: Full integration with Adobe Media Player
- **YouTube Player Support**: YouTube iframe API integration
- **Progress Synchronization**: Real-time progress updates
- **Session Highlighting**: Visual indication of currently playing session
- **Automatic Navigation**: Seamless transition between sessions

### Analytics & Tracking
- **Adobe Analytics**: Comprehensive tracking of user interactions
- **Progress Analytics**: Track viewing patterns and engagement
- **Favorites Analytics**: Monitor user preferences and behavior

## Authoring Guide

### Basic Configuration

The Video Playlist Block is configured through data attributes on a `data-playlist-config` element:

```html
<div data-playlist-config
     data-playlist-id="my-playlist"
     data-playlist-title="My Video Playlist"
     data-topic-eyebrow="Category"
     data-autoplay-text="Play All"
     data-skip-playlist-text="Skip playlist"
     data-minimum-sessions="2"
     data-sort="default"
     data-is-tag-based="false"
     data-social-sharing="true"
     data-favorites-enabled="true">
</div>
```

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-playlist-id` | String | `null` | Unique identifier for the playlist |
| `data-playlist-title` | String | `"Video Playlist"` | Display title for the playlist |
| `data-topic-eyebrow` | String | `""` | Category or topic label |
| `data-autoplay-text` | String | `"Play All"` | Text for the autoplay toggle |
| `data-skip-playlist-text` | String | `"Skip playlist"` | Accessibility skip link text |
| `data-minimum-sessions` | Number | `2` | Minimum sessions required to display playlist |
| `data-sort` | String | `"default"` | Sort order: `default`, `title`, `duration`, `reverse` |
| `data-is-tag-based` | Boolean | `false` | Whether playlist is tag-based (dynamic) or AEM-based (manual) |
| `data-social-sharing` | Boolean | `false` | Enable social sharing functionality |
| `data-favorites-enabled` | Boolean | `false` | Enable favorites functionality |

### Favorites Configuration

When `data-favorites-enabled="true"`, additional parameters are available:

```html
<div data-playlist-config
     data-favorites-enabled="true"
     data-favorites-tooltip-text="Add this session to your favorites"
     data-favorites-notification-text="Session added to your favorites!"
     data-favorites-button-text="View My Schedule"
     data-favorites-button-link="/my-schedule">
</div>
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-favorites-tooltip-text` | String | `"Add to favorites"` | Tooltip text for favorite button |
| `data-favorites-notification-text` | String | `"Session added to favorites"` | Notification message when adding to favorites |
| `data-favorites-button-text` | String | `"View Schedule"` | Text for notification action button |
| `data-favorites-button-link` | String | `"/schedule"` | URL for notification action button |

### Related Playlists

Configure related playlists using JSON:

```html
<div data-playlist-config
     data-related-playlists='[
       {"title":"Photoshop Fundamentals","link":"/playlists/photoshop"},
       {"title":"Illustrator Basics","link":"/playlists/illustrator"}
     ]'>
</div>
```

## API Integration

### Current Mock API

The block currently uses a mock API for testing. Replace the `mockAPI` object in `video-playlist.js` with real API calls:

```javascript
// Replace mockAPI with real API calls
const realAPI = {
  async getSessions(playlistId = null, entityIds = null) {
    const response = await fetch(`/api/sessions?playlistId=${playlistId}&entityIds=${entityIds}`);
    return response.json();
  },

  async getFavorites() {
    const response = await fetch('/api/favorites');
    return response.json();
  },

  async toggleFavorite(sessionId) {
    const response = await fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return response.json();
  }
};
```

### Expected API Response Format

#### Sessions API Response
```json
{
  "cards": [
    {
      "search": {
        "mpcVideoId": "session_001",
        "videoId": "yt_001",
        "videoService": "mpc",
        "sessionId": "sess_001",
        "thumbnailUrl": "https://example.com/thumbnail.jpg",
        "videoDuration": "45:30"
      },
      "contentArea": {
        "title": "Session Title",
        "description": "Session description"
      },
      "overlayLink": "/sessions/session-url"
    }
  ]
}
```

#### Favorites API Response
```json
{
  "sessionInterests": [
    { "sessionID": "sess_001" },
    { "sessionID": "sess_003" }
  ]
}
```

### Video Player Integration

The block automatically detects and integrates with video players:

1. **MPC Player**: Listens for `postMessage` events from the player
2. **YouTube Player**: Loads YouTube iframe API and sets up event handlers
3. **Progress Tracking**: Saves progress every 5 seconds and on pause
4. **Session Highlighting**: Highlights the currently playing session

## Use Cases

### 1. Event Session Playlists
**Scenario**: Conference or event with multiple sessions
- Tag-based playlists for dynamic content
- Progress tracking across sessions
- Favorites for personalized experience

### 2. Educational Course Content
**Scenario**: Online learning platform
- Sequential video lessons
- Progress persistence
- Social sharing for engagement

### 3. Product Demo Collections
**Scenario**: Software or product demonstrations
- Categorized demo videos
- Autoplay for continuous viewing
- Related content recommendations

### 4. Training Video Libraries
**Scenario**: Corporate training materials
- Skill-based video collections
- Progress tracking for compliance
- Favorites for bookmarking

## Implementation Examples

### Basic Playlist
```html
<div id="video-playlist">
  <div data-playlist-config
       data-playlist-id="basic-playlist"
       data-playlist-title="Basic Video Collection"
       data-minimum-sessions="1">
  </div>
</div>
```

### Advanced Playlist with All Features
```html
<div id="video-playlist">
  <div data-playlist-config
       data-playlist-id="advanced-playlist"
       data-playlist-title="Advanced Video Collection"
       data-topic-eyebrow="Technology"
       data-autoplay-text="Play All Videos"
       data-skip-playlist-text="Skip to main content"
       data-minimum-sessions="3"
       data-sort="title"
       data-is-tag-based="true"
       data-social-sharing="true"
       data-favorites-enabled="true"
       data-favorites-tooltip-text="Save this video"
       data-favorites-notification-text="Video saved to your favorites!"
       data-favorites-button-text="View Favorites"
       data-favorites-button-link="/favorites"
       data-related-playlists='[
         {"title":"Related Collection 1","link":"/related1"},
         {"title":"Related Collection 2","link":"/related2"}
       ]'>
  </div>
</div>
```

## Styling Customization

### CSS Custom Properties
The block uses CSS custom properties for easy theming:

```css
:root {
  --video-playlist-primary-color: #1473e6;
  --video-playlist-secondary-color: #0d5bb3;
  --video-playlist-text-color: #2c2c2c;
  --video-playlist-background-color: #f8f9fa;
  --video-playlist-border-color: #e1e1e1;
}
```

### Responsive Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

### Accessibility Features
- **Skip Links**: Navigate directly to main content
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Testing

### Unit Tests
Run the test suite:
```bash
npm run test
```

### Manual Testing
1. Open `test-video-playlist.html` in a browser
2. Test all interactive features
3. Verify responsive behavior
4. Check accessibility with screen readers

### Test Scenarios
- [ ] Playlist loads with mock data
- [ ] Autoplay toggle works correctly
- [ ] Favorites functionality works
- [ ] Progress bars display correctly
- [ ] Session highlighting works
- [ ] Responsive design on mobile
- [ ] Accessibility features work
- [ ] Error handling for API failures

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Images load as needed
- **Efficient DOM Updates**: Minimal re-renders
- **Debounced Progress Saving**: Reduces localStorage writes
- **Memory Management**: Proper cleanup on dispose

### Best Practices
- Keep playlist size reasonable (max 50 sessions)
- Use optimized thumbnail images
- Implement proper caching strategies
- Monitor localStorage usage

## Troubleshooting

### Common Issues

1. **Playlist Not Loading**
   - Check API endpoint configuration
   - Verify minimum sessions requirement
   - Check browser console for errors

2. **Progress Not Saving**
   - Verify localStorage is available
   - Check for storage quota exceeded
   - Ensure proper video ID mapping

3. **Favorites Not Working**
   - Verify user authentication
   - Check API endpoint configuration
   - Ensure session IDs match

4. **Video Player Integration Issues**
   - Verify video container class name
   - Check iframe origin restrictions
   - Ensure proper event handling

### Debug Mode
Enable debug logging by setting:
```javascript
window.DEBUG_VIDEO_PLAYLIST = true;
```

## Future Enhancements

### Planned Features
- **Offline Support**: Cache videos for offline viewing
- **Advanced Analytics**: Detailed viewing analytics
- **Custom Themes**: Theme customization options
- **Video Quality Selection**: Multiple quality options
- **Playback Speed Control**: Variable playback speeds
- **Subtitles Support**: Multi-language subtitle support

### API Enhancements
- **Real-time Updates**: WebSocket integration for live updates
- **Batch Operations**: Bulk favorites management
- **Advanced Filtering**: Filter by duration, category, etc.
- **Search Functionality**: Full-text search across sessions

## Support

For technical support or questions:
- Check the troubleshooting section
- Review the test files for examples
- Consult the API documentation
- Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: Modern browsers (ES6+)


