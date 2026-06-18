# LifeTrack — Phase 3 (Architect Mode)

A small CLI that logs life events (work / study / exercise / meal) and fans each
one out to several outputs at once. No output knows the others exist.

## Run it

```bash
cd lifetrack
ruby lifetrack.rb
```

It creates `events.log` (a text log) and `dashboard.html` (open it in a browser).

## Files (one job each)

| File                  | Job                                                      |
| --------------------- | ------------------------------------------------------- |
| `event.rb`            | The data — what one event carries                       |
| `handler.rb`          | The shared interface — the one method `handle(event)`   |
| `console_handler.rb`  | Output: print to the terminal                           |
| `file_handler.rb`     | Output: append to `events.log`                          |
| `html_handler.rb`     | Output: rebuild `dashboard.html` on every event         |
| `event_router.rb`     | The Observer — sends one event to every handler         |
| `lifetrack.rb`        | The menu + wiring (run this)                            |
| `slack_handler.rb`    | Bonus output (see below)                                |

**Observer** lives in `event_router.rb` (it notifies all handlers).
**Strategy** lives in each `*_handler.rb` (each is a swappable algorithm).

## SOLID Self-Check

- [x] **S** — Each class has one job. `ConsoleHandler` has no file I/O; `EventRouter` has no menu logic.
- [x] **O** — The third output was added by creating one new file. The router was not opened.
- [x] **L** — Any handler can be swapped for another in the registered list and the router still works.
- [x] **I** — The `Handler` interface has exactly one method: `handle`.
- [x] **D** — Open `event_router.rb` and search for `Console` / `File` / `Html`. Result: **zero**. The router depends only on the `Handler` abstraction.

## Bonus — The Architect's Test (Slack notifications)

Answered **before** coding:

1. **Name & location:** `SlackHandler`, in a new file `slack_handler.rb`.
2. **One method it must implement:** `handle(event)` (the same contract every output shares).
3. **Files I would open to plug it in:** only `lifetrack.rb` — to `require_relative` the new file and add one `router.register(SlackHandler.new)` line.
4. **Does the list include the router or interface?** No. So no SOLID principle is violated — the design already supports extension without modification (Open/Closed).

**Verified:** `slack_handler.rb` exists and needs zero changes to the router or
interface. To enable it, add these two lines to `lifetrack.rb`:

```ruby
require_relative "slack_handler"
router.register(SlackHandler.new)
```

That one-file, one-line change confirms the written answers were correct.
