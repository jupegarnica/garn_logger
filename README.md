# Garn Logger

Garn Logger is a utility to enhance the default console logging in
JavaScript/TypeScript. It allows you to set logging levels and filter logs based
on a query.

## Installation

```sh
deno add jsr:@garn/logger
```

or

```sh
npx jsr add @garn/logger
```

## Usage

### Importing

```typescript
import { better } from "@garn/logger";
```

### Setting Log Level

You can set the log level to control which logs are displayed. The available
levels are `error`, `warn`, `info`, and `debug`.

```typescript
better(console).setLevel("warn");

console.error("This is an error"); // Will log
console.warn("This is a warning"); // Will log
console.info("This is an info"); // Will not log
console.debug("This is a debug"); // Will not log
```

### Setting Log Filter

You can filter logs based on a string or regular expression.

```typescript
better(console).setFilter("test");

console.error("this is a test"); // Will log
console.warn("another test"); // Will log
console.info("not a match"); // Will not log
console.debug("test again"); // Will log
```

Using a regular expression:

```typescript
better(console).setFilter(/test/i);

console.error("this is a test"); // Will log
console.warn("another test"); // Will log
console.info("not a match"); // Will not log
console.debug("test again"); // Will log
```

## API

### `better(console: Console): Config`

Enhances the provided console object with additional configuration options.

#### `Config`

- `setLevel(level: ConsoleLevel): Config`
  - Sets the log level. Only logs at or above this level will be displayed.
  - `level`: `"error" | "warn" | "info" | "debug"`

- `setFilter(query: string | RegExp): Config`
  - Sets a filter for log messages. Only logs matching the query will be
    displayed.
  - `query`: `string | RegExp`
