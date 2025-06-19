# Mobile Rider Video Player Block

A comprehensive video player block for Adobe Events that supports both on-demand videos and livestreams with a responsive drawer interface for concurrent videos.

## Features

- **Video Player**: MobileRider-powered video player with ASL support
- **Drawer Interface**: Responsive drawer for concurrent videos with click-to-play functionality
- **Livestream Support**: Real-time livestream capabilities with live indicators and viewer counts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast mode support
- **Analytics**: Adobe Analytics integration
- **Timing Framework**: Integration with Adobe's timing framework for live events

## File Structure

```
mobile-rider/
├── mobile-rider.js              # Main block initialization
├── mobile-rider-drawer.js       # Drawer component for concurrent videos
├── mobile-rider-livestream.js   # Livestream functionality
├── mobile-rider.css             # Styles and responsive design
└── README.md                    # This documentation
```

## Configuration

### Basic Video Configuration

The block reads configuration from DOM metadata elements:

```html
<div>
  <div>videoid</div>
  <div>your-video-id</div>
</div>
<div>
  <div>skinid</div>
  <div>your-skin-id</div>
</div>
<div>
  <div>aslid</div>
  <div>your-asl-video-id</div>
</div>
```

### Drawer Configuration

```html
<div>
  <div>drawerenabled</div>
  <div>true</div>
</div>
<div>
  <div>drawerposition</div>
  <div>bottom</div>
</div>
<div>
  <div>drawertitle</div>
  <div>Related Videos</div>
</div>
```

### Concurrent Videos

Add multiple concurrent videos using numbered metadata:

```html
<div>
  <div>concurrentvideoid1</div>
  <div>video-id-1</div>
</div>
<div>
  <div>concurrenttitle1</div>
  <div>Video Title 1</div>
</div>
<div>
  <div>concurrentdescription1</div>
  <div>Video description 1</div>
</div>
<div>
  <div>concurrentthumbnail1</div>
  <div>https://example.com/thumbnail1.jpg</div>
</div>
<div>
  <div>concurrentaslid1</div>
  <div>asl-video-id-1</div>
</div>
<div>
  <div>concurrentsessionid1</div>
  <div>session-id-1</div>
</div>

<!-- Repeat for additional videos -->
<div>
  <div>concurrentvideoid2</div>
  <div>video-id-2</div>
</div>
<!-- ... -->
```

### Livestream Configuration

To enable livestream functionality:

```html
<div>
  <div>islivestream</div>
  <div>true</div>
</div>
<div>
  <div>sessionid</div>
  <div>your-session-id</div>
</div>
```

## Code Improvements

### 1. Better Code Organization

- **Constants**: All configuration values are centralized in `CONFIG` objects
- **Modular Functions**: Functions are broken down into smaller, focused responsibilities
- **JSDoc Comments**: Comprehensive documentation for all functions
- **Type Safety**: Better parameter validation and error handling

### 2. Improved Variable Names

- `sanitizedKeyDiv` → `sanitizeTextForClass`
- `getMetaData` → `extractMetadata`
- `defineShouldSetStreamendListener` → `shouldSetStreamEndListener`
- `setUpStreamendListener` → `setupStreamEndListener`
- `handleASLSubroutine` → `handleASLInitialization`
- `toggleClassHandler` → `setupASLButtonHandler`

### 3. Code Reusability

- **Shared Constants**: Common values reused across functions
- **Utility Functions**: Helper functions for common operations
- **Configuration Objects**: Centralized configuration management
- **Event Handling**: Consistent event listener patterns

### 4. Cleanup and Optimization

- **Removed Unused Code**: Eliminated dead code and unused CSS
- **Better Error Handling**: Improved error messages and fallbacks
- **Performance**: Optimized DOM queries and event handling
- **Memory Management**: Proper cleanup of intervals and event listeners

## Livestream Functionality

### Features

- **Live Indicator**: Visual indicator showing stream status
- **Viewer Count**: Real-time viewer count display
- **Status Polling**: Automatic status checking every 30 seconds
- **State Management**: Tracks live, ended, error, and paused states
- **Event Handling**: Listens to MobileRider stream events

### Usage

The livestream functionality is automatically initialized when:
1. `islivestream` metadata is set to `true`
2. `sessionid` metadata is provided

### API Integration

To integrate with your livestream API, modify the `getStreamStatus` function in `mobile-rider-livestream.js`:

```javascript
async getStreamStatus(sessionId) {
  const response = await fetch(`/api/stream-status/${sessionId}`);
  if (response.ok) {
    return response.json();
  }
  throw new Error('Failed to fetch stream status');
}
```

### Custom Events

The livestream manager emits custom events:

```javascript
container.addEventListener('livestream-state-change', (event) => {
  const { state, isLive } = event.detail;
  console.log(`Stream state changed to: ${state}, isLive: ${isLive}`);
});
```

## Responsive Design

### Breakpoints

- **Desktop (>768px)**: Horizontal drawer layout
- **Tablet (600px-768px)**: Horizontal drawer with adjusted spacing
- **Mobile (≤600px)**: Vertical stacked drawer layout
- **Small Mobile (≤480px)**: Compact drawer items

### Features

- **Flexible Layouts**: Drawer adapts to screen size
- **Touch-Friendly**: Optimized for touch interactions
- **Scrollable**: Horizontal scrolling on desktop, vertical on mobile
- **Accessible**: Proper focus management and keyboard navigation

## Accessibility

### Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for drawer items
- **Focus Management**: Clear focus indicators
- **High Contrast**: Support for high contrast mode
- **Semantic HTML**: Proper use of HTML elements

### Keyboard Shortcuts

- **Enter/Space**: Activate drawer items
- **Tab**: Navigate between interactive elements
- **Arrow Keys**: Navigate drawer items (when implemented)

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: Graceful degradation for older browsers

## Performance Considerations

- **Lazy Loading**: Images load only when needed
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup of resources
- **Minimal DOM Queries**: Cached element references
- **Debounced Updates**: Status polling with retry limits

## Troubleshooting

### Common Issues

1. **Player Not Loading**: Check video ID and skin ID configuration
2. **Drawer Not Appearing**: Ensure concurrent videos are configured
3. **Livestream Not Working**: Verify session ID and livestream flag
4. **ASL Not Toggling**: Check ASL button ID and video ID

### Debug Mode

Enable debug mode by setting the environment to 'dev':

```javascript
// The block automatically detects environment
// Debug logs will appear in console
```

## Future Enhancements

- **Chat Integration**: Real-time chat functionality
- **Quality Selection**: Video quality controls
- **Playback Speed**: Variable playback speed
- **Picture-in-Picture**: Native PiP support
- **Offline Support**: Cached video playback
- **Analytics Events**: Enhanced tracking capabilities

## Contributing

When contributing to this block:

1. Follow the existing code patterns and naming conventions
2. Add JSDoc comments for new functions
3. Update this README for new features
4. Test across different devices and browsers
5. Ensure accessibility compliance
6. Add appropriate error handling

## License

This block is part of the Adobe Events platform and follows Adobe's coding standards and licensing requirements. 