# Authentication Architecture
**Supabase Auth + Next.js App Router (`@supabase/ssr`)**

This project uses **Supabase Auth with cookie-based sessions** so that authentication works consistently across:

- Middleware (route protection)
- Server Components (SSR)
- Route Handlers / Server Actions
- Client Components (UI state)

This document explains **how auth is wired**, **which utilities to use**, and **how the OAuth flow works**, so you don’t have to re-derive it every time.

---

## Core idea (TL;DR)

- **Auth state lives in cookies**, not localStorage
- **Supabase SSR clients read/write cookies depending on runtime**
- **OAuth is completed via a callback route that exchanges a code for cookies**
- **Server enforces access, client reflects auth state**

---

## Mental model

There are **four places auth code can run**:

1. **Browser (Client Components)**
2. **Server Components**
3. **Server Actions / Route Handlers**
4. **Middleware (Edge Runtime)**

Each has a **different Supabase client**.

---

## Supabase client factories

All Supabase clients are created in:
`utils/supabase/server-client.ts`

### 1. `createSupabaseBrowserClient()`

**Use in:** Client Components (`"use client"`)

**Purpose:**
- Start OAuth sign-in
- Read auth state for UI
- Run client-side queries

**Notes:**
- Reads/writes cookies in the browser
- Should not be used on the server

---

### 2. `createSupabaseServerComponentClient()`

**Use in:** Server Components (RSC)

**Purpose:**
- Read current user/session during SSR
- Fetch user-scoped data on the server

**Important:**
- Can **read** cookies
- Cannot **set** cookies
- Do NOT use for OAuth completion or sign-out

---

### 3. `createSupabaseServerActionClient()`

**Use in:** Server Actions & Route Handlers

**Purpose:**
- Auth operations that must modify cookies

**Examples:**
- OAuth `exchangeCodeForSession`
- Server-side sign-out

---

### 4. `createSupabaseMiddlewareClient(req, res)`

**Use in:** `middleware.ts`

**Purpose:**
- Protect routes
- Redirect unauthenticated users
- Keep auth cookies fresh at the edge

---

## OAuth login flow (Google)

### Step-by-step

1. User clicks **Sign in with Google**
2. Client calls:

```ts
supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: "/auth/callback?next=/ingredients"
  }
})
```

3.	Google authenticates the user
4.	Supabase redirects back with a code
5.	/auth/callback route handler:
•	exchanges the code for a session
•	sets auth cookies
•	redirects into the app
6.	Auth is now available everywhere (middleware, server, client)

⸻

## OAuth callback route

`app/auth/callback/route.ts`

Responsibilities:
	•	Read code from URL
	•	Call exchangeCodeForSession(code)
	•	Write session cookies
	•	Redirect to a safe internal path

This is the only place cookies are written during OAuth.
If login “half works,” start debugging here.

⸻

# Middleware (route protection)

`middleware.ts`

**Current behavior**:
	•	Protects /ingredients/:path*
	•	Redirects to /signin if no user

**Notes**:
	•	Middleware runs before the page loads
	•	Use it for “hard” access control
	•	Client context does NOT affect middleware

⸻

## Client auth context

`context/Authenticated.tsx`

**Purpose**:
	•	Drive UI state (signed in / signed out)
	•	Attach profile data (username, etc.)

**Flow**:
	1.	Browser client calls auth.getUser()
	2.	If user exists → fetch profile
	3.	Store result in React context

Impo**r**tant:
	•	This is UI state, not security
	•	Middleware + server auth are the real gatekeepers

⸻

## Server-side user helper

utils/supabase/getUserSessionServer.ts

Purpose:
	•	Get the authenticated user inside Server Components

Implementation:
	•	Uses createSupabaseServerComponentClient()
	•	Returns User | null

⸻

## Which utility should I use?

- Client Component: `createSupabaseBrowserClient()`
- Server Component: `createSupabaseServerComponentClient()` or `getUserSessionServer()`
- Need to set or clear auth cookies? - `createSupabaseServerActionClient()`
- Protect routes: - `createSupabaseMiddlewareClient(req, res)`


⸻

## Common failure modes

User exists but UI says “not logged in”

Usually means:
	•	OAuth callback didn’t run
	•	Cookies weren’t written
	•	Profile fetch failed
	•	App is pointing at the wrong Supabase project

What to check
	•	Network tab: did /auth/callback execute?
	•	Application → Cookies: are Supabase auth cookies present?
	•	Browser console: supabase.auth.getSession()
	•	Server logs: any Auth session missing errors

Why this setup works well
	•	SSR-safe authentication
	•	Middleware-level access control
	•	OAuth handled correctly
	•	Clean separation of concerns