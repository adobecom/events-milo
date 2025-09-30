# Manual Testing Guide

This document describes the manual test files available for development and debugging of the events-milo project.

## Overview

Manual test files are located in `test/manual/` and provide interactive testing capabilities for complex features that require browser APIs, real-time debugging, and visual inspection.

## Test Files

### 1. `test-logging.html` - BlockMediator & Conditional Content Testing

**Purpose**: Tests the new conditional content feature with BlockMediator integration and reactive updates.

**What it tests**:
- Complex conditional syntax with multiple operators (`&`, `||`, `=`, `!=`)
- BlockMediator store reactivity and subscriptions
- Content update functionality with styling preservation
- Mock store data and real-time updates

**Key Features**:
- Tests complex conditions like: `allow-wait-listing&@BM.rsvpData.registrationStatus!=registered&@BM.eventData.isFull?(content):()`
- Simulates store updates with 2-second delays
- Visual debugging with console logging
- Tests both simple and complex conditional content

**How to use**:
1. Open `test/manual/test-logging.html` in a browser
2. Open browser developer console to see logging
3. Watch for store subscription messages
4. Observe content updates after 2 seconds
5. Verify conditional content renders correctly

### 2. `test-manual.html` - Timing Framework Testing

**Purpose**: Comprehensive testing of the timing framework with multiple chrono-boxes, plugin stores, and worker communication.

**What it tests**:
- Chrono-box initialization and configuration
- Plugin store functionality (metadata, mobile-rider)
- Worker API and BroadcastChannel communication
- Integration between different framework components
- Store isolation and data sharing

**Test Scenarios**:
- **Basic Test**: Element detection, metadata parsing, UUID generation
- **Plugin Test**: Plugin imports, store creation, get/set functionality
- **Worker Test**: Worker API availability, BroadcastChannel communication
- **Integration Test**: Full chrono-box initialization with mocked dependencies

**How to use**:
1. Open `test/manual/test-manual.html` in a browser
2. Click the test buttons to run different scenarios
3. Observe test results in the results section
4. Check console for detailed logging
5. Verify all tests pass (green indicators)

### 3. `test-multiple-chronoboxes.html` - Multi-Instance Testing

**Purpose**: Tests multiple chrono-boxes on the same page with unified tab ID sharing and cross-instance communication.

**What it tests**:
- Multiple chrono-box instances on the same page
- Unified tab ID sharing across instances
- Store communication via BroadcastChannel
- Plugin store isolation and data sharing
- Worker communication between instances

**Key Features**:
- Tests store data sharing between multiple chrono-boxes
- Verifies BroadcastChannel communication
- Tests plugin store isolation
- Simulates real-world multi-instance scenarios

**How to use**:
1. Open `test/manual/test-multiple-chronoboxes.html` in a browser
2. Click "Run Unified Tab Test" to test store sharing
3. Click "Check Worker Communication" to test BroadcastChannel
4. Observe test results and verify store communication
5. Check that multiple chrono-boxes share the same tab ID

## Development Workflow

### When to use Manual Tests

Use manual tests for:
- **Complex Integration Testing**: Features requiring real browser APIs
- **Visual Debugging**: When you need to see results in the browser
- **Interactive Testing**: Features requiring user interaction
- **Real-time Debugging**: State management and reactive updates
- **Stakeholder Demos**: Showing functionality to non-technical users

### When to use Automated Tests

Use automated tests (`npm run test`) for:
- **Unit Testing**: Individual function testing
- **Regression Testing**: Ensuring changes don't break existing functionality
- **CI/CD Integration**: Automated testing in build pipelines
- **Code Coverage**: Measuring test coverage
- **Fast Feedback**: Quick validation of changes

## Best Practices

### Manual Test Development

1. **Clear Test Names**: Use descriptive names for test scenarios
2. **Visual Feedback**: Provide clear success/error indicators
3. **Console Logging**: Include detailed logging for debugging
4. **Mock Data**: Use realistic mock data for testing
5. **Error Handling**: Include proper error handling and reporting

### Test Maintenance

1. **Keep Tests Updated**: Update tests when features change
2. **Document Changes**: Update this documentation when adding new tests
3. **Clean Up**: Remove obsolete test files
4. **Version Control**: Include test files in version control for team sharing

## Troubleshooting

### Common Issues

1. **Module Import Errors**: Ensure all dependencies are available
2. **Mock Data Issues**: Verify mock data matches expected format
3. **Browser Compatibility**: Test in different browsers if issues arise
4. **Timing Issues**: Some tests rely on timing - adjust delays if needed

### Debug Tips

1. **Use Console**: Check browser console for error messages
2. **Network Tab**: Monitor network requests for failed resources
3. **Element Inspection**: Use browser dev tools to inspect DOM changes
4. **Step Through**: Use debugger to step through complex logic

## File Structure

```
test/
├── manual/                    # Manual test files
│   ├── test-logging.html     # BlockMediator & conditional content
│   ├── test-manual.html      # Timing framework testing
│   └── test-multiple-chronoboxes.html  # Multi-instance testing
└── unit/                     # Automated unit tests
    ├── blocks/              # Block component tests
    ├── features/            # Feature tests
    └── scripts/            # Script tests
```

## Contributing

When adding new manual tests:

1. **Follow Naming Convention**: Use `test-<feature-name>.html`
2. **Include Documentation**: Update this file with test description
3. **Add Clear Instructions**: Include step-by-step usage instructions
4. **Test Thoroughly**: Verify the test works as expected
5. **Update Index**: Add new tests to the file structure section

## Related Documentation

- [Advanced Content Features](./advanced-content-features.md) - Comprehensive guide to array iteration and conditional content features
- [Automated Testing](../test/unit/README.md) - Unit test documentation
- [Development Setup](../README.md) - Project setup and development guide
- [Code Coverage](../coverage/lcov-report/index.html) - Coverage reports
