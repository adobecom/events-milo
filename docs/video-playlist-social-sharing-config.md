# Video Playlist Social Sharing Configuration

## Overview

The Video Playlist component now supports configurable social sharing functionality that matches the original AEM component's capabilities. You can enable/disable individual platforms and customize text for each platform.

## Configuration Structure

The social sharing configuration is provided via the `data-socials` attribute on the video playlist container element. The configuration follows this JSON structure:

```json
{
  "facebook": {
    "enabled": true,
    "altText": "Share Playlist on Facebook"
  },
  "twitter": {
    "enabled": true,
    "twitterTextType": "custom",
    "twitterCustomText": "Check out this amazing playlist!",
    "extraText": "Additional text for Twitter",
    "altText": "Share Playlist on X"
  },
  "linkedin": {
    "enabled": true,
    "altText": "Share Playlist on LinkedIn"
  },
  "copy": {
    "enabled": true,
    "tooltip": "Copy link to clipboard",
    "altText": "Share with link",
    "toasterText": "Link copied to clipboard"
  }
}
```

## Platform Configuration Options

### Facebook
- **enabled** (boolean): Whether Facebook sharing is enabled
- **altText** (string): Accessible text for the Facebook share button

### Twitter/X
- **enabled** (boolean): Whether Twitter sharing is enabled
- **twitterTextType** (string): Type of Twitter text ("custom" or "default")
- **twitterCustomText** (string): Custom text to include in Twitter share
- **extraText** (string): Additional text for Twitter (fallback if twitterCustomText is not provided)
- **altText** (string): Accessible text for the Twitter share button

### LinkedIn
- **enabled** (boolean): Whether LinkedIn sharing is enabled
- **altText** (string): Accessible text for the LinkedIn share button

### Copy Link
- **enabled** (boolean): Whether copy link functionality is enabled
- **tooltip** (string): Tooltip text for the copy button (future enhancement)
- **altText** (string): Accessible text for the copy link button
- **toasterText** (string): Notification text shown when link is copied

## Implementation Example

### HTML Structure
```html
<div 
  class="video-playlist-container"
  data-socials='{
    "facebook": {
      "enabled": true,
      "altText": "Share Playlist on Facebook"
    },
    "twitter": {
      "enabled": true,
      "twitterCustomText": "Check out this amazing video playlist!",
      "altText": "Share Playlist on X"
    },
    "linkedin": {
      "enabled": false
    },
    "copy": {
      "enabled": true,
      "altText": "Copy playlist link",
      "toasterText": "Playlist link copied to clipboard!"
    }
  }'
>
  <!-- Video playlist content -->
</div>
```

### AEM Component Configuration
When configuring in AEM, you would set these properties:

- **Enable Facebook**: Checkbox to enable/disable Facebook sharing
- **Facebook Alt Text**: Text for Facebook share button accessibility
- **Enable Twitter**: Checkbox to enable/disable Twitter sharing
- **Twitter Custom Text**: Custom text for Twitter shares
- **Twitter Alt Text**: Text for Twitter share button accessibility
- **Enable LinkedIn**: Checkbox to enable/disable LinkedIn sharing
- **LinkedIn Alt Text**: Text for LinkedIn share button accessibility
- **Enable Copy Link**: Checkbox to enable/disable copy link functionality
- **Copy Link Alt Text**: Text for copy link button accessibility
- **Copy Notification Text**: Text shown when link is copied

## Default Behavior

If no `data-socials` attribute is provided, the component will use these default settings:

```json
{
  "facebook": { "enabled": true, "altText": "Share Playlist on Facebook" },
  "twitter": { "enabled": true, "altText": "Share Playlist on X" },
  "linkedin": { "enabled": true, "altText": "Share Playlist on LinkedIn" },
  "copy": { "enabled": true, "altText": "Share with link", "toasterText": "Link copied to clipboard" }
}
```

## Dynamic Menu Generation

The social sharing menu is dynamically generated based on the enabled platforms. Only platforms with `enabled: true` will appear in the menu. If no platforms are enabled, the social sharing button will not be displayed at all.

## URL Sharing

All platforms share the current page URL (`window.location.href`). The component automatically:
- URL-encodes the current page URL
- Opens sharing windows in new tabs
- Handles clipboard copying with fallback for older browsers
- Shows appropriate notifications for copy actions

## Accessibility

Each platform button includes:
- Proper `aria-label` attributes using the configured `altText`
- `daa-ll` attributes for analytics tracking
- Keyboard navigation support
- Screen reader friendly text

## Analytics Integration

The component includes analytics tracking with these event names:
- `Facebook_Share Playlist`
- `Twitter_Share Playlist` 
- `LinkedIn_Share Playlist`
- `Link_Share Playlist`

## Future Enhancements

Potential future enhancements could include:
- Tooltip support for copy link button
- Custom share text for Facebook and LinkedIn
- Image sharing capabilities
- Social media preview customization
- Analytics event customization
