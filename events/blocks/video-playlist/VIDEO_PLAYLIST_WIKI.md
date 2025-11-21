# Video Playlist Block - Technical Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Overview](#overview)
3. [API Dependencies](#api-dependencies)
4. [Configuration Properties](#configuration-properties)
5. [API Endpoints & Specifications](#api-endpoints--specifications)
6. [Data Flow](#data-flow)
7. [Features](#features)

---

## Introduction

The **Video Playlist Block** is a comprehensive component that displays a collection of video sessions in a playlist format. It supports two content fetching modes: **tag-based** (dynamic content from Chimera API) and **author-authored** (curated playlists with specific session paths). The block includes features like auto-play, favorites management, social sharing, progress tracking, and seamless integration with both Adobe MPC and YouTube video players.

---

## Overview

### Key Capabilities
- **Dual Content Modes**: Tag-based dynamic playlists or author-curated playlists
- **Video Player Integration**: Supports Adobe MPC and YouTube players
- **Progress Tracking**: Saves and resumes video playback progress
- **Auto-Play**: Automatically advances to next video when current completes
- **Favorites Management**: Users can favorite/unfavorite sessions (requires registration)
- **Social Sharing**: Share playlists on Facebook, Twitter, LinkedIn, or copy link
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Skip links and ARIA labels for screen readers

### Architecture
- **Main Component**: `video-playlist.js` - Core playlist logic and rendering
- **Player Manager**: `player-manager.js` - Handles video player events and progress
- **Favorites Manager**: `favorites-manager.js` - Manages user favorites (lazy loaded)
- **Social Sharing**: `social.js` - Social share functionality (lazy loaded)
- **API Adapter**: `api.js` - Abstracts API calls with mock fallback

---

## API Dependencies

The Video Playlist block requires the following APIs to be implemented:

### 1. **Chimera Collection API** (Tag-Based Playlists)
**Endpoint**: `/chimera-api/collection`

**Method**: `GET`

**Query Parameters**:
- `contentSource` (string, required): Content source identifier (e.g., "Northstar")
- `originSelection` (string, required): Origin selection (e.g., "Northstar")
- `language` (string, required): Language code (e.g., "en")
- `country` (string, required): Country code (e.g., "US")
- `environment` (string, optional): Environment (e.g., "prod")
- `complexQuery` (string, required): Complex query string for tag filtering

**Complex Query Format**:
```
complexQuery=("tag1" AND "tag2" AND "tag3")
```
- Tags are comma-separated in authoring: `caas:events/max,caas:events/year/2025`
- Must be converted to: `("caas:events/max" AND "caas:events/year/2025")`
- URL encoding: Spaces become `%20`, quotes become `%22`
- Example: `complexQuery=(%22caas:events/max%22%20AND%20%22caas:events/year/2025%22)`

**Expected Response Format**:
```json
{
  "cards": [
    {
      "id": "string",
      "search": {
        "thumbnailUrl": "string",
        "videoDuration": "string (HH:MM:SS)",
        "mpcVideoId": "string",
        "videoId": "string",
        "videoService": "string (adobeTv|mpc|youtube)",
        "sessionId": "string",
        "sessionCode": "string"
      },
      "contentArea": {
        "title": "string",
        "description": "string",
        "url": "string"
      },
      "overlayLink": "string (absolute URL)"
    }
  ],
  "filters": [],
  "isHashed": true
}
```

**Reference**: See `mock-chimera-response.json` for complete response structure.

---

### 2. **Entity Lookup Service** (Author-Authored Playlists)
**Endpoint**: `https://14257-chidlookupservice.adobeio-static.net/api/v1/web/chidlookupservice-0.0.1/__id-lookup`

**Method**: `GET`

**Query Parameters**:
- `env` (string, required): Environment (e.g., "prod")
- `container` (string, required): Container identifier (e.g., "live")
- `uri` (string, required): URL-encoded session path(s)

**Multiple URIs**: Can pass multiple `uri` parameters for batch lookup:
```
?env=prod&container=live&uri=url1&uri=url2&uri=url3
```

**Expected Response Format**:
```json
[
  {
    "entityId": "string (UUID)",
    "contentId": "string (UUID)",
    "arbitrary": [
      { "sessionId": "string" },
      { "sessionCode": "string" },
      { "sessionTimeID": "string" },
      { "thumbnailUrl": "string" },
      { "videoDuration": "string" },
      { "mpcVideoId": "string" },
      { "videoId": "string" },
      { "videoService": "string" }
    ],
    "cardData": {
      "headline": "string",
      "details": "string",
      "cta": {
        "primaryCta": {
          "url": "string"
        }
      }
    },
    "description": "string",
    "title": "string",
    "thumbnail": {
      "url": "string",
      "altText": "string"
    },
    "url": "string"
  }
]
```

**Reference**: See `mock-entity-lookup-response.json` for complete response structure.

---

### 3. **Chimera Featured Cards API** (Author-Authored Playlists)
**Endpoint**: `/chimera-api/collection`

**Method**: `GET`

**Query Parameters**:
- `contentSource` (string, required): e.g., "northstar"
- `originSelection` (string, required): e.g., "northstar"
- `language` (string, required): e.g., "en"
- `country` (string, required): e.g., "us"
- `environment` (string, required): e.g., "prod"
- `featuredCards` (string, required): Comma-separated entity IDs

**Example**:
```
/chimera-api/collection?contentSource=northstar&originSelection=northstar&language=en&country=us&environment=prod&featuredCards=entity-id-1,entity-id-2,entity-id-3
```

**Expected Response Format**: Same as Entity Lookup Service response (array of items with `arbitrary`, `cardData`, `entityId`, etc.)

**Reference**: See `mock-featured-cards-response.json` for complete response structure.

---

### 4. **User Registration Check API**
**Endpoint**: TBD (Currently using `MOCK_API.isUserRegistered()`)

**Method**: `GET`

**Purpose**: Check if user is signed in and registered for the event

**Expected Response**:
```json
{
  "isRegistered": true|false
}
```

**Note**: This API is required before loading the Favorites Manager module. If user is not registered, favorites functionality will not be loaded.

---

### 5. **Favorites API** (Northstar API)
**Base**: `window.northstar.api` (to be implemented)

#### 5.1. Get User Favorites
**Method**: `getInterests()` or similar

**Expected Response**:
```json
{
  "items": [
    {
      "sessionId": "string"
    }
  ],
  "responseCode": "0"
}
```

**Transformed Format** (used by block):
```json
{
  "sessionInterests": [
    {
      "sessionID": "string"
    }
  ],
  "responseCode": "0"
}
```

#### 5.2. Toggle Favorite
**Method**: `toggleInterest({ sessionTimeId, sessionId })` or similar

**Request Body**:
```json
{
  "sessionTimeId": "string",
  "sessionId": "string"
}
```

**Expected Response**:
```json
{
  "success": true|false,
  "responseCode": "0"
}
```

---

## Configuration Properties

All configuration properties are authored in AEM using the block's metadata structure. Properties are case-insensitive and will be normalized to camelCase.

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `playlistId` | string | `null` | **Reserved for future use** - Unique identifier for the playlist (for analytics/tracking). Currently not actively used in the codebase. |
| `playlistTitle` | string | `"Video Playlist"` | Main title displayed in the playlist header |
| `topicEyebrow` | string | `""` | Eyebrow text displayed above the title |
| `skipPlaylistText` | string | `"Skip playlist"` | Text for the skip link (accessibility) |
| `autoplayText` | string | `"Play All"` | Label for the auto-play toggle checkbox |
| `minimumSessions` | number | `4` | Minimum number of sessions required to display playlist |

### Content Source Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isTagbased` | boolean | `true` | If `true`, uses tag-based API. If `false`, uses author-authored playlist |
| `tags` | string | `""` | Comma-separated tags for tag-based playlists (e.g., `"caas:events/max,caas:events/year/2025"`) |
| `sessionPath` | string | `""` | Comma-separated session paths for author-authored playlists (e.g., `"/max/2025/sessions/session1.html,/max/2025/sessions/session2.html"`) |

### Sorting Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sort` | string | `"default"` | Sort order: <br>- `"default"` - No sorting (original order)<br>- `"titleAscending"` - Sort by title A-Z<br>- `"titleDescending"` - Sort by title Z-A<br>- `"timeAscending"` - Sort by video duration (shortest to longest)<br>- `"timeDescending"` - Sort by video duration (longest to shortest) |

### Social Sharing Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `socialSharing` | boolean | `true` | Enable/disable social sharing functionality |
| `enableFacebook` | boolean | `false` | Enable Facebook share button |
| `facebookAltText` | string | `"Share Playlist on Facebook"` | Alt text for Facebook button |
| `enableTwitter` | boolean | `false` | Enable Twitter/X share button |
| `twitterCustomText` | string | `""` | Custom tweet text (falls back to `playlistTitle` if empty) |
| `twitterAltText` | string | `"Share Playlist on X"` | Alt text for Twitter button |
| `enableLinkedIn` | boolean | `false` | Enable LinkedIn share button |
| `linkedInAltText` | string | `"Share Playlist on LinkedIn"` | Alt text for LinkedIn button |
| `enableCopyLink` | boolean | `false` | Enable copy link button |
| `copyLinkAltText` | string | `"Share with link"` | Alt text for copy link button |
| `copyNotificationText` | string | `"Link copied to clipboard!"` | Toast message when link is copied |

### Favorites Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `favoritesEnabled` | boolean | `true` | Enable/disable favorites functionality |
| `favoritesTooltipText` | string | `"Add to favorites"` | Tooltip text for favorite button |
| `favoritesNotificationText` | string | `"Session added to favorites"` | Toast message when session is favorited |
| `favoritesButtonText` | string | `"View"` | Text for the button in favorites notification |
| `favoritesButtonLink` | string | `"/schedule"` | URL for the favorites button (typically schedule page) |

### Display Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `theme` | string | `"light"` | Theme variant (e.g., `"light"`, `"dark"`) |
| `videoUrl` | string | `""` | Reserved for future use |

---

## API Endpoints & Specifications

### Endpoint Summary

| Endpoint | Purpose | When Used |
|----------|---------|-----------|
| `/chimera-api/collection` (with `complexQuery`) | Fetch tag-based playlists | When `isTagbased: true` |
| Entity Lookup Service | Convert session paths to entity IDs | When `isTagbased: false` |
| `/chimera-api/collection` (with `featuredCards`) | Fetch cards by entity IDs | When `isTagbased: false` |
| User Registration API | Check if user can use favorites | Before loading favorites manager |
| Favorites API (`getInterests`) | Get user's favorited sessions | On favorites manager setup |
| Favorites API (`toggleInterest`) | Add/remove favorite | When user clicks favorite button |

### Request/Response Examples

#### Tag-Based Playlist Request
```
GET /chimera-api/collection?contentSource=Northstar&originSelection=Northstar&language=en&country=US&environment=prod&complexQuery=(%22caas:events/max%22%20AND%20%22caas:events/year/2025%22)
```

#### Author-Authored Playlist Flow
1. **Entity Lookup**:
   ```
   GET https://14257-chidlookupservice.adobeio-static.net/api/v1/web/chidlookupservice-0.0.1/__id-lookup?env=prod&container=live&uri=https%3A%2F%2Fwww.adobe.com%2Fmax%2F2025%2Fsessions%2Fsession1.html&uri=https%3A%2F%2Fwww.adobe.com%2Fmax%2F2025%2Fsessions%2Fsession2.html
   ```

2. **Featured Cards**:
   ```
   GET /chimera-api/collection?contentSource=northstar&originSelection=northstar&language=en&country=us&environment=prod&featuredCards=entity-id-1,entity-id-2
   ```

---

## Data Flow

### Tag-Based Playlist Flow
```
1. User loads page
2. Block reads config → isTagbased: true
3. Block constructs complexQuery from tags
4. Block calls Chimera Collection API
5. API returns cards array
6. Block filters cards (must have thumbnailUrl)
7. Block sorts cards (if configured)
8. Block renders playlist
9. User interacts with videos
```

### Author-Authored Playlist Flow
```
1. User loads page
2. Block reads config → isTagbased: false, sessionPath provided
3. Block splits sessionPath into array
4. Block calls Entity Lookup Service (batch)
5. Service returns entity IDs for each path
6. Block calls Chimera Featured Cards API with entity IDs
7. API returns cards array
8. Block filters and sorts cards
9. Block renders playlist
10. User interacts with videos
```

### Favorites Flow
```
1. Block checks favoritesEnabled: true
2. Block calls User Registration API
3. If registered:
   a. Dynamically loads favorites-manager.js
   b. Calls Favorites API (getInterests)
   c. Renders favorite buttons on cards
4. User clicks favorite button
5. Block calls Favorites API (toggleInterest)
6. Block updates UI and shows toast notification
```

### Auto-Play Flow
```
1. Video completes
2. Player Manager detects completion
3. Checks localStorage for auto-play preference
4. If enabled:
   a. Finds current video in playlist
   b. Gets next video URL
   c. Navigates to next video
5. If disabled:
   a. Stops at current video
```

---

## Features

### 1. Progress Tracking
- Saves video progress to `localStorage` every 5 seconds
- Displays progress bar on session cards
- Resumes playback from saved position
- Restarts video if user watched >90% (RESTART_THRESHOLD)

### 2. Player Integration
- **Adobe MPC**: Listens to postMessage events for status updates
- **YouTube**: Uses YouTube iframe API for progress tracking
- Automatically detects player type and sets up appropriate hooks

### 3. Lazy Loading
- **Social Sharing**: Only loads `social.js` if `socialSharing: true`
- **Favorites Manager**: Only loads `favorites-manager.js` if:
  - `favoritesEnabled: true` AND
  - User is registered for event

### 4. Accessibility
- Skip link to jump past playlist header
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

### 5. Error Handling
- Graceful fallback if APIs fail
- Console warnings for missing data
- Continues rendering even if some features fail

---

## Implementation Notes for API Team

### Critical Requirements

1. **Complex Query Format**: The `complexQuery` parameter must support the exact format:
   ```
   ("tag1" AND "tag2" AND "tag3")
   ```
   With proper URL encoding (spaces as `%20`, quotes as `%22`).

2. **Batch Entity Lookup**: The Entity Lookup Service must support multiple `uri` parameters in a single request to avoid multiple round trips.

3. **Response Consistency**: All card responses must include:
   - `search.thumbnailUrl` (required for filtering)
   - `search.videoDuration` (format: `HH:MM:SS` or `MM:SS`)
   - `contentArea.title` and `contentArea.description`
   - `overlayLink` (absolute URL)

4. **User Registration Check**: Must be available before favorites functionality can be used.

5. **Favorites API**: Must be available at `window.northstar.api` with methods:
   - `getInterests()` - Returns user's favorited sessions
   - `toggleInterest({ sessionTimeId, sessionId })` - Toggles favorite status

### Testing Recommendations

1. Test with various tag combinations
2. Test batch entity lookup with 1, 5, and 10+ session paths
3. Test response format matches mock JSON files exactly
4. Test error scenarios (404, 500, network failures)
5. Verify URL encoding of complex queries

---

## Mock Data Files

For reference, the following mock JSON files show the expected response formats:

- `mock-chimera-response.json` - Tag-based playlist response
- `mock-entity-lookup-response.json` - Entity lookup response
- `mock-featured-cards-response.json` - Featured cards response

These files are used during development and should match the actual API response structure.

---

## Support & Questions

For questions or clarifications about API requirements, please refer to this documentation or contact the Video Playlist development team.

**Last Updated**: [Current Date]
**Version**: 1.0


