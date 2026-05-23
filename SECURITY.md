# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x.x   | ✅ Active |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please email **nishantchaudhary.dev@gmail.com** with:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You should receive a response within **48 hours**. If you don't hear back, please follow up.

## Scope

dashcraft is a client-side React library. The main security considerations are:
- XSS via unsanitized widget titles or data passed as props
- Prototype pollution via untrusted JSON in the HTTP client
- localStorage data integrity for persisted layouts

## Out of Scope

- Vulnerabilities in peer dependencies (recharts, @nivo, @dnd-kit) — report those to their maintainers
- The playground's `/api/analyze` route requires a server-side `ANTHROPIC_API_KEY` — users are responsible for securing their own deployment

## Disclosure Policy

We follow a 90-day coordinated disclosure timeline. We'll credit researchers in the changelog unless they prefer to remain anonymous.
