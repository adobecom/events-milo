# Timing Framework

The Timing Framework is a robust system for managing dynamic content scheduling and transitions in event pages. It works in conjunction with the Chronobox block and various plugins to provide precise control over content display timing.

## Architecture Overview

### Core Components

1. **Chronobox Block**
   - Entry point for the timing system
   - Loads schedule from metadata or static configuration
   - Generates and manages global tabId via sessionStorage
   - Dynamically imports and initializes required plugins
   - Creates and manages the Timing Worker
   - Handles fragment loading with loading states

2. **Timing Worker**
   - Web Worker that manages schedule processing
   - Maintains current and next schedule items
   - Handles time-based transitions with server-synchronized time
   - Manages plugin state via BroadcastChannel
   - Uses random intervals (500-1500ms) for polling to prevent thundering herd

3. **Plugin System**
   - Extensible architecture for custom timing conditions
   - Currently supports:
     - Mobile Rider Plugin: Manages mobile rider web player content
     - Metadata Plugin: Handles metadata-based conditions
   - Plugins communicate via BroadcastChannel
   - Each plugin maintains its own state store
   - Plugins use `getCurrentTabId()` API for unified state management

### Data Flow

1. **Schedule Definition**
   ```json
   {
     "schedule-id": "unique-id",
     "schedule": [
       {
         "pathToFragment": "/path/to/fragment",
         "toggleTime": 1234567890,
         "mobileRider": { "sessionId": "session1" },
         "metadata": { "key": "value", "expectedValue": "expected" }
       }
     ]
   }
   ```

2. **Schedule Processing**
   - Schedules are converted to a double-linked list for efficient traversal
   - Each schedule item can have multiple conditions (time, plugins, metadata)
   - Worker maintains current and next schedule items
   - Initial position determined by `getStartScheduleItemByToggleTime`

## Initialization Flow

The framework uses a Promise-based initialization pattern to enable CLS prevention while maintaining the original timing framework behavior:

### Chronobox Block Initialization
1. **Schedule Loading**: Loads schedule from metadata or static configuration
2. **Plugin Initialization**: Dynamically imports and initializes required plugins
3. **Worker Creation**: Creates the Timing Worker and sends initial configuration
4. **Message Handler Setup**: Sets up the worker message handler
5. **Promise Return**: Returns a Promise that resolves when the first message is received
6. **Normal Operation**: Worker continues normal operation for subsequent messages

### Worker Initialization
1. **Message Reception**: Receives initial configuration (schedule, plugins, testing, tabId)
2. **Schedule Positioning**: Determines initial position using `getStartScheduleItemByToggleTime`
3. **First Message**: Immediately sends the first schedule item back to the main thread
4. **Timer Setup**: Begins polling for schedule transitions (if not in testing mode)

### Promise-Based CLS Prevention
- **Promise Return**: The `init()` function returns a Promise that resolves when the first message is received
- **Timeout Protection**: 3-second timeout balances CLS prevention with LCP/FCP performance
- **CLS Prevention**: Calling code can `await` the initialization to prevent layout shifts
- **Unchanged Framework**: The timing framework continues to work exactly as before
- **Safe Integration**: Never rejects, safe for Promise.all() usage

**Example Flow:**
```javascript
// Before (async, non-blocking)
init(chronoBoxElement); // Returns immediately
// First message arrives later (async) - potential CLS

// After (Promise-based with timeout)
await init(chronoBoxElement); // Blocks until first message or timeout
// First message received, content loaded - no CLS
// Note: Promise always resolves, never rejects
```

## Schedule Position Determination

The framework uses a two-phase approach to determine the current schedule position:

### Phase 1: Initial Time-based Position
The framework first determines the likely position based on `toggleTime` only, using `getStartScheduleItemByToggleTime`:

```javascript
static getStartScheduleItemByToggleTime(scheduleRoot) {
  const currentTime = new Date().getTime();
  let pointer = scheduleRoot;
  let start = null;

  while (pointer) {
    const { toggleTime: t } = pointer;
    const toggleTimePassed = typeof t !== 'number' || currentTime > t;

    if (!toggleTimePassed) break;

    start = pointer;
    pointer = pointer.next;
  }

  return start || scheduleRoot;
}
```

This method:
- Traverses the schedule from the beginning
- Finds the last item whose `toggleTime` has passed
- Returns that item as the initial position
- Falls back to the first item if no time has passed

### Phase 2: Context Validation
After finding the initial position, the framework then validates this position against other conditions:

1. **Mobile Rider Status**
   - If the initial position has an active MR session, it stays
   - If the previous position has an active MR session, it may need to go back

2. **Metadata Conditions**
   - Validates metadata conditions for the initial position
   - May need to adjust position if conditions aren't met

This two-phase approach ensures:
- Quick initial positioning based on time
- Accurate final position based on all conditions
- Efficient handling of schedule navigation
- Proper handling of edge cases (like MR overrun)

### Example

```json
{
  "schedule": [
    {
      "pathToFragment": "/pre-event",
      "toggleTime": 1234567890
    },
    {
      "pathToFragment": "/session1",
      "toggleTime": 1234567899,
      "mobileRider": { "sessionId": "session1" }
    },
    {
      "pathToFragment": "/post-event",
      "toggleTime": 1234567908
    }
  ]
}
```

If current time is 1234567900:
1. Phase 1: Finds "/session1" as initial position (last passed toggleTime)
2. Phase 2: 
   - Checks if session1 is still active
   - If active, stays on "/session1"
   - If ended, proceeds to "/post-event"

## Schedule Trigger Mechanism

The framework uses a sophisticated trigger system that considers multiple factors when determining when to transition between schedule items. The trigger evaluation happens in a specific order of precedence:

### Trigger Evaluation Order

1. **Mobile Rider (MR) Status**
   - Overrun Check: If current item has MR and session is still active, stay on current item
   - Underrun Check: If next item has MR and session has ended, proceed to next item
   - MR takes precedence over time-based triggers
   - Uses BroadcastChannel for real-time status updates

2. **Metadata Conditions**
   - Checks if metadata key matches expected value
   - If condition not met, blocks transition regardless of time
   - Can be used to force specific content based on external state
   - Updates via BroadcastChannel for dynamic changes

3. **Time-based Trigger (toggleTime)**
   - Only evaluated if no MR or metadata conditions are blocking
   - Uses server-synchronized time to prevent client clock manipulation
   - Supports testing mode via URL parameters
   - Random polling interval to prevent server load

### Example Scenarios

#### Scenario 1: Basic Time-based Transition
```json
{
  "schedule": [
    {
      "pathToFragment": "/pre-event",
      "toggleTime": 1234567890
    },
    {
      "pathToFragment": "/during-event",
      "toggleTime": 1234567899
    }
  ]
}
```
- At 1234567890: Transitions to "during-event"
- Simple time-based transition with no conditions
- Uses random polling interval (500-1500ms)

#### Scenario 2: Mobile Rider Overrun
```json
{
  "schedule": [
    {
      "pathToFragment": "/session1",
      "toggleTime": 1234567890,
      "mobileRider": { "sessionId": "session1" }
    },
    {
      "pathToFragment": "/session2",
      "toggleTime": 1234567899
    }
  ]
}
```
- At 1234567890: Checks MR status via BroadcastChannel
- If session1 is still active: Stays on current content
- If session1 has ended: Proceeds to session2
- Time trigger is ignored if MR session is active

#### Scenario 3: Metadata-based Control
```json
{
  "schedule": [
    {
      "pathToFragment": "/default",
      "toggleTime": 1234567890,
      "metadata": { "key": "eventStatus", "expectedValue": "active" }
    },
    {
      "pathToFragment": "/fallback",
      "toggleTime": 1234567890
    }
  ]
}
```
- At 1234567890: Checks metadata condition via BroadcastChannel
- If eventStatus = "active": Shows default content
- If condition not met: Shows fallback content
- Time trigger is same for both, decision based on metadata

#### Scenario 4: Combined Conditions
```json
{
  "schedule": [
    {
      "pathToFragment": "/session1",
      "toggleTime": 1234567890,
      "mobileRider": { "sessionId": "session1" },
      "metadata": { "key": "streamStatus", "expectedValue": "live" }
    },
    {
      "pathToFragment": "/next",
      "toggleTime": 1234567899
    }
  ]
}
```
- At 1234567890: Evaluates in order:
  1. Checks if session1 is still active (MR)
  2. If MR ended, checks if streamStatus = "live"
  3. If both conditions met, proceeds to next item
  4. If either condition fails, stays on current content

### Testing

The framework includes a testing system that allows:
- Time manipulation via URL parameters (`?timing=1234567890`)
- Simulation of plugin conditions via BroadcastChannel
- Testing of schedule transitions
- Server time synchronization testing

#### Testing Mode Behavior

When testing mode is enabled via the `timing` URL parameter:

1. **Time Simulation**: The framework simulates being at the specified EPOCH timestamp
2. **Polling Optimization**: Worker polling is disabled to show the exact state at that timestamp
3. **Schedule Positioning**: The schedule immediately jumps to the appropriate position based on the simulated time
4. **Plugin Testing**: Plugin conditions still work normally via BroadcastChannel

**Example Usage:**
```
https://your-site.com/event-page?timing=1640995200000
```

This would simulate the page as if it were running at December 31, 2021 (timestamp 1640995200000), allowing you to:
- Test how content appears at specific moments
- Verify schedule positioning without waiting
- Debug timing-sensitive content transitions
- Test edge cases around schedule boundaries

**Note**: In testing mode, the worker stops continuous polling since you're viewing a fixed point in time. This provides a more accurate representation of what users would see at that exact timestamp.

## Error Handling

The framework includes comprehensive error handling:
- Schedule parsing errors
- Plugin initialization failures
- Time synchronization issues
- Network errors during fragment loading

All errors are logged via the Splunk LANA logging system for monitoring and debugging.

## Technical Implementation Details

### Web Worker Usage
The framework uses a Web Worker for schedule processing to:
- Keep the main thread responsive during schedule processing
- Prevent UI blocking during time checks and condition evaluations
- Handle schedule processing in parallel with UI updates
- Maintain consistent timing even under heavy main thread load

[Web Worker Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

Benefits:
- **Performance**: Schedule processing doesn't block the main thread
- **Reliability**: Time checks remain accurate even during UI updates
- **Scalability**: Can handle complex schedules without impacting page performance
- **Isolation**: Schedule logic is isolated from the main application

### BroadcastChannel Communication
The framework uses BroadcastChannel for plugin communication to:
- Enable real-time updates across different parts of the application
- Allow plugins to communicate without tight coupling
- Support multiple instances of the timing framework
- Maintain state consistency across the application

[BroadcastChannel Documentation](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

Benefits:
- **Decoupling**: Plugins can communicate without direct dependencies
- **Real-time**: Immediate updates across all framework instances
- **Cross-context**: Works across different windows, tabs, and iframes
- **State Management**: Centralized state management for plugins

#### Tab Isolation and Unification
The framework implements a sophisticated tab management system that provides both isolation and unification:

**Tab Isolation (Cross-Tab)**
- Each browser tab generates a unique UUID stored in sessionStorage
- All BroadcastChannel messages include the sender's tab ID
- Messages are only processed if they originate from the same tab
- This prevents schedule transitions in one tab from affecting others

**Tab Unification (Within Tab)**
- Multiple chrono-boxes on the same page share the same tabId via sessionStorage
- All plugin stores within a tab are unified and communicate via BroadcastChannel
- This ensures consistent state across all chrono-boxes on the same page

**Implementation Details**
- TabId is generated once per page session and stored in `sessionStorage.getItem('chrono-box-tab-id')`
- Plugins automatically retrieve the tabId via `getCurrentTabId()` API (reads from sessionStorage)
- Worker receives the tabId from the chrono-box and stores it in `this.tabId` for message filtering
- The self-supplied approach eliminates the need for manual tabId parameter passing
- Both worker and plugins use the same tabId source (sessionStorage for plugins, this.tabId for worker)

Example message format:
```javascript
{
  tabId: "550e8400-e29b-41d4-a716-446655440000",
  key: "eventStatus",
  value: "active"
}
```

This system ensures:
- **Cross-tab isolation**: Independent testing in different tabs
- **Within-tab unification**: Multiple chrono-boxes share plugin state
- **No interference**: Clean separation between different browser tabs
- **Predictable behavior**: Consistent state management within each tab

### Implementation Example

```javascript
// Chrono-box initialization with tabId management
let tabId = sessionStorage.getItem('chrono-box-tab-id');
if (!tabId) {
  tabId = crypto.randomUUID();
  sessionStorage.setItem('chrono-box-tab-id', tabId);
}

// Worker setup
const worker = new Worker('/events/features/timing-framework/worker.js');

// Plugin communication via BroadcastChannel
const channel = new BroadcastChannel('metadata-store');
channel.onmessage = (event) => {
  const { tabId: messageTabId, key, value } = event.data;
  // Only process messages from the same tab
  if (messageTabId === tabId) {
    // Handle plugin state updates
  }
};

// Worker communication
worker.postMessage({
  schedule: scheduleLinkedList,
  plugins: pluginStates,
  testing,
  tabId, // Pass the unified tabId to the worker
});
```

### Plugin Development

When creating new plugins, the tabId is automatically handled internally:

```javascript
import { getCurrentTabId } from '../../../../scripts/utils.js';

export const yourPluginStore = {
  get(key) {
    return store.get(key);
  },

  set(key, value) {
    const tabId = getCurrentTabId(); // Automatically retrieved from sessionStorage
    store.set(key, value);
    channel.postMessage({ key, value, tabId });
  },

  getAll() {
    return Object.fromEntries(store);
  },
};

export default function init(schedule) {
  // Your plugin logic here
  // No need to manually handle tabId - it's self-supplied
  
  return yourPluginStore;
}
```

**Architecture Notes:**
- **Plugins**: Run in main thread, use `getCurrentTabId()` to read from sessionStorage
- **Worker**: Runs in separate thread, uses `this.tabId` (received from chrono-box)
- **Consistency**: Both use the same tabId value, just accessed differently based on context

**Benefits of the self-supplied approach:**
- **Simplified API**: Plugins don't need to pass tabId parameters
- **Automatic Management**: tabId is retrieved when needed
- **Encapsulation**: Hides implementation details from plugins
- **Error Handling**: Centralized error handling for missing tabId
- **Testing**: Easy to mock in unit tests
- **Flexibility**: Can change implementation without updating plugins

### Why This Architecture?

1. **Separation of Concerns**
   - Schedule processing is isolated in the worker
   - UI updates happen on the main thread
   - Plugin state is managed via BroadcastChannel
   - TabId management is centralized via sessionStorage

2. **Performance Optimization**
   - Main thread stays responsive
   - Schedule processing is non-blocking
   - Real-time updates are efficient
   - Single tabId generation per page session

3. **Scalability**
   - Can handle complex schedules
   - Supports multiple plugin types
   - Maintains performance under load
   - Supports multiple chrono-boxes on the same page

4. **Reliability**
   - Consistent timing checks
   - Reliable state management
   - Robust error handling
   - Unified plugin state across chrono-boxes

5. **Tab Management**
   - **Cross-tab isolation**: Each browser tab operates independently
   - **Within-tab unification**: Multiple chrono-boxes share plugin state
   - **Session persistence**: TabId persists across page refreshes
   - **Clean separation**: No interference between different tabs
