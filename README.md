# Garn Logger

Garn Logger is a utility to enhance the default console logging in
JavaScript/TypeScript. It allows you to set logging levels and filter logs based on a query.

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
better(console).level("warn");

console.error("This is an error"); // Will log
console.warn("This is a warning"); // Will log
console.info("This is an info"); // Will not log
console.debug("This is a debug"); // Will not log
```

### Setting Log Filter

You can filter logs based on a string or regular expression.

```typescript
better(console).filter("test");

console.error("this is a test"); // Will log
console.warn("another test"); // Will log
console.info("not a match"); // Will not log
console.debug("test again"); // Will log
```

Using a regular expression:

```typescript
better(console).filter(/test/i);

console.error("this is a test"); // Will log
console.warn("another test"); // Will log
console.info("not a match"); // Will not log
console.debug("test again"); // Will log
```

Using mutliple filters acts as an OR operation:

```typescript
better(console).filter("test","another");

console.error("this is a test"); // Will log
console.warn("another"); // Will log
console.info("not a match"); // Will not log
```

Or use addFilter to add multiple filters:

```typescript
better(console).addFilter("test").addFilter("another");
console.error("this is a test"); // Will log
console.warn("another"); // Will log
console.info("not a match"); // Will not log
```

Reset filter with `.resetFilter()`:

```typescript
better(console).filter("XXX");
better(console).resetFilter();
console.error("this is a test"); // Will log
```

### Use console.only

You can use `console.only` to log only this log and filter every it log ahead.

```typescript

better(console)

console.only("logs this"); // Will log
console.error("this is filtered out"); // Will log
```

It's a shortcut for:
```typescript
better(console).filter("logs this");
console.debug("logs this");
```