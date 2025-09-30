# Advanced Content Features

This document describes the advanced content rendering features available in the events-milo project, including array iteration and conditional content rendering.

## Table of Contents

1. [Array Iteration with Flexible Concatenation](#array-iteration-with-flexible-concatenation)
2. [Conditional Content Rendering](#conditional-content-rendering)
3. [BlockMediator Integration](#blockmediator-integration)
4. [Combined Usage Examples](#combined-usage-examples)
5. [Implementation Details](#implementation-details)
6. [Testing](#testing)

---

## Array Iteration with Flexible Concatenation

This feature extends the existing placeholder system to support array iteration with flexible concatenation options, including object attribute extraction and nested array handling.

### Syntax

Use the `[[@array(metadata-path.attribute)separator]]` syntax to iterate over arrays and join them with any separator you specify.

### Examples

#### Basic Usage with Comma

```html
<!-- Metadata: contacts = ["John Doe", "Jane Smith", "Bob Johnson"] -->
<p>Contact us: [[@array(contacts),]]</p>
<!-- Output: Contact us: John Doe, Jane Smith, Bob Johnson -->
```

#### Object Attribute Extraction

```html
<!-- Metadata: speakers = [{"name": "Dr. Alice Brown", "title": "Senior Researcher"}, {"name": "Prof. Charlie Wilson", "title": "Professor"}] -->
<p>Speakers: [[@array(speakers.name),]]</p>
<!-- Output: Speakers: Dr. Alice Brown, Prof. Charlie Wilson -->

<p>Speakers: [[@array(speakers.title) | ]]</p>
<!-- Output: Speakers: Senior Researcher | Professor -->
```

#### Custom Separators

```html
<!-- Using pipe separator -->
<p>Contact us: [[@array(contacts) | ]]</p>
<!-- Output: Contact us: John Doe | Jane Smith | Bob Johnson -->

<!-- Using bullet separator -->
<p>Contact us: [[@array(contacts) • ]]</p>
<!-- Output: Contact us: John Doe • Jane Smith • Bob Johnson -->

<!-- Using newline separator -->
<p>Contact us: [[@array(contacts)
]]</p>
<!-- Output: Contact us: John Doe
Jane Smith
Bob Johnson -->
```

#### No Separator (Space Default)

```html
<!-- No separator specified -->
<p>Contact us: [[@array(contacts)]]</p>
<!-- Output: Contact us: John Doe Jane Smith Bob Johnson -->
```

#### Nested Metadata Paths

```html
<!-- Metadata: event-data = {"organizers": ["Adobe Events", "Tech Partners"]} -->
<p>Organizers: [[@array(event-data.organizers),]]</p>
<!-- Output: Organizers: Adobe Events, Tech Partners -->

<!-- Nested objects with attribute extraction -->
<!-- Metadata: event-data = {"speakers": [{"name": "Dr. Alice", "title": "Researcher"}, {"name": "Prof. Bob", "title": "Professor"}]} -->
<p>Speakers: [[@array(event-data.speakers.name),]]</p>
<!-- Output: Speakers: Dr. Alice, Prof. Bob -->
```

---

## Conditional Content Rendering

This feature enables dynamic content rendering based on conditions, with support for complex logical operations and reactive updates via BlockMediator stores.

### Syntax

Use the `[[condition?(true-content):(false-content)]]` syntax for conditional content rendering.

### Basic Conditional Syntax

```html
<!-- Simple condition -->
<p>[[is-full?(Event is full.):(Event has spots.)]]</p>

<!-- Equality check -->
<p>[[status=live?(Event is live.):(Event is not live.)]]</p>

<!-- Inequality check -->
<p>[[status!=live?(Event is not live.):(Event is live.)]]</p>
```

### Complex Logical Operations

#### AND Conditions (`&`)

```html
<!-- Multiple conditions must all be true -->
<p>[[is-full&status=live?(Event is full and live.):(Event is not full or not live.)]]</p>
```

#### OR Conditions (`||`)

```html
<!-- At least one condition must be true -->
<p>[[is-virtual||is-online?(Virtual or online event.):(In-person event.)]]</p>
```

#### Combined Operations

```html
<!-- Complex combinations -->
<p>[[allow-wait-listing&@BM.rsvpData.registrationStatus!=registered&@BM.eventData.isFull?(This event has reached capacity. Join the waitlist to receive a notification if a spot opens up.):()]]</p>
```

### BlockMediator Store Integration

#### Store References (`@BM.storeName.property`)

```html
<!-- Check if user is registered -->
<p>[[@BM.rsvpData.registrationStatus=registered?(User is registered.):(User is not registered.)]]</p>

<!-- Null/undefined checks -->
<p>[[@BM.rsvpData=null?(User not registered.):(User is registered.)]]</p>
<p>[[@BM.rsvpData!=null?(User is registered.):(User not registered.)]]</p>

<!-- Nested store properties -->
<p>[[@BM.rsvpData.registrationStatus=registered?(User is registered.):(User is not registered.)]]</p>
```

#### Reactive Updates

Content automatically updates when BlockMediator store values change:

```html
<!-- This content will update when rsvpData or eventData stores change -->
<p>[[@BM.rsvpData.registrationStatus=registered&@BM.eventData.isFull?(Complex condition content.):()]]</p>
```

### Advanced Examples

#### Event State Management

```html
<!-- Check multiple event conditions -->
<p>[[is-full&allow-wait-listing?(Event is full but waitlist is available.):(Event has spots available.)]]</p>

<!-- Time-based conditions -->
<p>[[event-start-time<now?(Event has started.):(Event hasn't started yet.)]]</p>
```

#### User-Specific Content

```html
<!-- User registration status -->
<p>[[@BM.rsvpData.registrationStatus=registered?(You are registered for this event.):(Register for this event.)]]</p>

<!-- User type-based content -->
<p>[[@BM.userProfile.accountType=premium?(Premium user content.):(Standard user content.)]]</p>
```

---

## BlockMediator Integration

### Store Access Pattern

Use `@BM.storeName.property` to access BlockMediator store values:

```html
<!-- Access store data -->
<p>[[@BM.eventData.title]]</p>
<p>[[@BM.rsvpData.registrationStatus]]</p>
<p>[[@BM.userProfile.email]]</p>
```

### Reactive Content Updates

Content with BlockMediator references automatically updates when store values change:

1. **Initial Render**: Content renders based on current store values
2. **Store Updates**: Content automatically re-renders when stores change
3. **Subscription Management**: Automatically subscribes to relevant stores
4. **Cleanup**: Unsubscribes when elements are removed

### Store Availability Handling

- **Available Stores**: Content renders immediately
- **Missing Stores**: Content is hidden until stores become available
- **Store Updates**: Content updates reactively when stores change

---

## Combined Usage Examples

### Array Iteration with Conditions

```html
<!-- Show speakers only if event is live -->
<p>[[status=live?(Speakers: [[@array(speakers.name),]]):()]]</p>

<!-- Show contacts with different formatting based on event state -->
<p>[[is-full?(Contact us: [[@array(contacts) | ]]):(Contact us: [[@array(contacts),]])]]</p>
```

### Complex Event Management

```html
<!-- Multi-condition event status -->
<p>[[@BM.rsvpData.registrationStatus=registered&@BM.eventData.isFull?(You are registered and the event is full.):(@BM.rsvpData.registrationStatus=registered?(You are registered.):(Register for this event.)))]]</p>
```

### Dynamic Content Based on Store State

```html
<!-- Show different content based on user registration and event capacity -->
<p>[[@BM.rsvpData.registrationStatus=registered?(You're registered!):(@BM.eventData.isFull?(Event is full.):(Register now!))]]</p>
```

---

## Implementation Details

### Array Iteration

The array iteration feature is implemented in `events/scripts/utils.js`:

1. **Detection**: The `parseMetadataPath` function checks for `@array(` syntax
2. **Processing**: Handles array parsing and attribute extraction
3. **Path Resolution**: Uses `parseRegularPath` to handle nested structures
4. **Attribute Extraction**: Extracts specific attributes from objects when specified
5. **Separator Logic**: Uses provided separator, defaults to space if none provided

### Conditional Content

The conditional content feature is implemented in `events/scripts/utils.js` and `events/scripts/content-update.js`:

1. **Parsing**: `parseConditionalContent` function handles conditional syntax
2. **Evaluation**: `evaluateCondition` function evaluates individual conditions
3. **Store Integration**: `parseMetadataPathWithBlockMediator` handles store references
4. **Reactive Updates**: `createContextualContent` manages reactive subscriptions
5. **DOM Updates**: `updateContextualContent` preserves styling during updates

### Integration Points

- **Content Update**: `autoUpdateContent` function processes both features
- **Store Management**: BlockMediator integration for reactive updates
- **DOM Preservation**: Maintains styling and structure during updates

---

## Testing

### Automated Tests

Comprehensive tests are available in `test/unit/scripts/content-update.test.js` and `test/unit/scripts/utils.test.js` covering:

- Array iteration with various separators
- Object attribute extraction
- Conditional content with different operators
- BlockMediator store integration
- Error handling and edge cases

### Manual Tests

Interactive test files are available in `test/manual/`:

- **`test-logging.html`**: Tests conditional content with BlockMediator integration
- **`test-manual.html`**: Tests timing framework with plugin stores
- **`test-multiple-chronoboxes.html`**: Tests multi-instance scenarios

See [Manual Testing Guide](./manual-testing.md) for detailed usage instructions.

---

## Migration Guide

### From Manual Lists to Array Iteration

**Before:**
```html
<meta name="contacts" content="John Doe, Jane Smith, Bob Johnson">
<p>Contact us: [[contacts]]</p>
```

**After:**
```html
<meta name="contacts" content='["John Doe", "Jane Smith", "Bob Johnson"]'>
<p>Contact us: [[@array(contacts),]]</p>
```

### From Static Content to Conditional Content

**Before:**
```html
<p>Event is full.</p>
```

**After:**
```html
<p>[[is-full?(Event is full.):(Event has spots.)]]</p>
```

### Adding Reactive Updates

**Before:**
```html
<p>User is registered.</p>
```

**After:**
```html
<p>[[@BM.rsvpData.registrationStatus=registered?(User is registered.):(User is not registered.)]]</p>
```

---

## Best Practices

### Array Iteration

1. **Use Arrays**: Store data as arrays in metadata for flexibility
2. **Choose Separators**: Select appropriate separators for your content
3. **Extract Attributes**: Use attribute extraction for object arrays
4. **Handle Errors**: Plan for missing or invalid data

### Conditional Content

1. **Keep Conditions Simple**: Avoid overly complex conditions
2. **Use Store References**: Leverage BlockMediator for reactive content
3. **Plan for Updates**: Consider how content will change over time
4. **Test Edge Cases**: Verify behavior with missing or invalid data

### Performance Considerations

1. **Store Subscriptions**: Only subscribe to stores that are actually used
2. **DOM Updates**: Use efficient DOM manipulation techniques
3. **Error Handling**: Implement proper error handling for robustness
4. **Cleanup**: Ensure proper cleanup of subscriptions and event listeners

---

## Troubleshooting

### Common Issues

1. **Array Not Rendering**: Check that metadata is valid JSON array
2. **Conditional Not Working**: Verify condition syntax and store availability
3. **Store Updates Not Reflecting**: Check store subscription and update logic
4. **Styling Issues**: Ensure DOM structure is preserved during updates

### Debug Tips

1. **Console Logging**: Use browser console to debug store values
2. **Element Inspection**: Check DOM structure and data attributes
3. **Store Inspection**: Use BlockMediator.get() to check store values
4. **Manual Testing**: Use test files in `test/manual/` for debugging

For more detailed troubleshooting, see [Manual Testing Guide](./manual-testing.md).
