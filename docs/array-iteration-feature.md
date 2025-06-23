# Array Iteration with Flexible Concatenation

This feature extends the existing placeholder system to support array iteration with flexible concatenation options.

## Syntax

Use the `[[@array(metadata-path)separator]]` syntax to iterate over arrays and join them with any separator you specify.

## Examples

### Basic Usage with Comma

```html
<!-- Metadata: contacts = ["John Doe", "Jane Smith", "Bob Johnson"] -->
<p>Contact us: [[@array(contacts),]]</p>
<!-- Output: Contact us: John Doe, Jane Smith, Bob Johnson -->
```

### Custom Separators

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

### No Separator (Space Default)

```html
<!-- No separator specified -->
<p>Contact us: [[@array(contacts)]]</p>
<!-- Output: Contact us: John Doe Jane Smith Bob Johnson -->
```

### Nested Metadata Paths

```html
<!-- Metadata: event-data = {"organizers": ["Adobe Events", "Tech Partners"]} -->
<p>Organizers: [[@array(event-data.organizers),]]</p>
<!-- Output: Organizers: Adobe Events, Tech Partners -->
```

## Separator Behavior

- **Author's Choice**: Use any separator you want (comma, pipe, bullet, etc.)
- **Space Default**: If no separator is provided, space is used as default
- **Exact Matching**: The separator you specify is used exactly as written

## Error Handling

- **Empty arrays**: Returns empty string
- **Non-array metadata**: Returns empty string
- **Missing metadata**: Returns empty string

## Implementation Details

The feature is implemented in `events/scripts/content-update.js`:

1. **Detection**: The `getContent` function checks for `@array(` syntax
2. **Processing**: The `processArrayIteration` function handles the array parsing
3. **Separator Logic**: Uses provided separator, defaults to space if none provided
4. **Integration**: Works seamlessly with existing placeholder processing

## Testing

Comprehensive tests are available in `test/unit/scripts/content-update.test.js` covering:

- Basic array iteration with commas
- Custom separators (pipes, bullets, etc.)
- No separator (space default)
- Error handling
- Nested metadata paths
- Edge cases

## Migration from Manual Lists

Instead of manually creating concatenated lists in metadata, you can now use arrays:

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

This approach provides cleaner data management and flexible concatenation options. 
