# Redirink

> I want this to be a complete project, not just programming and designing but also **product** thinking and project management.
>
> It should be close to the real world requirements.
>
> More _simple backend and frontend_, less featureful but **finished** at the time.

Fast short link redirect service.

Web service to create **short redirect links**.

The idea and technology is similar to the **Bit.ly** service:

- authentication/authorization

- CRUD links

- short unique URLs (UIDs)

- redirect via HTTP 301 to longer links

- CORS

- identification

## Roadmap

- Links

- Insights (redirects, clicks, visits, metrics, analytics)

- Setup React.js JS library (more convenient)

- Dashboard (interface template)

  - customize template (Volt React Dashboard)

- Setup AWS (production)

## Checklist

- [ ] Authentication interface

- [ ] Link CRUD interface

- [ ] Insights API

- [ ] Insights interface

- [ ] Production

## Design

Product: short link/URL redirect service

Topics:

- generate short unique identification

- identify requesting users (visitor IP address or authenticated user)

- store unique insight

- render dashboard (queryset, filter, information in text/graphs/plots/...)

Database (API recourses):

- User

- Link

- Insight

API (server interface):

- authentication (login, logout, register, password, etc.)

  - `/api/auth/login/`

  - `/api/auth/{method}/`

- Link CRUD API (create, retrieve, update, delete):

  - OPTIONS/GET/POST/PUT/PATCH `/api/links/`

- insight (read, list, filter):

  - `/api/insights/`

- Redirecting (by server MVT or SPA)

  - `/<link_uid_regex>/`

- Analytics (count insights - Celery Task):

  - `/<link_uid_regex/`

Frontend:

- authentication

  - `/login`

  - `/logout`

  - `/signup`

- links

  - GET `/{link_uid_regex}` - redirect to the original URL

## Links

Links should be available only for users:

- authenticated is required for all operation (there will be a separate view for redirecting/viewing/following link

  - owner is required for detail endpoints (retrieve, update, delete)
  - list is filtered for the current user (not all links)

- authorization works only for DRF auth token authenticated users

- result will be paginated by 20 (just in case overload)

- can be ordered by creation time

Specific requirements to test:

- user can not create 2 links to the same URL.

## Frontend

Frontend will be created based on the Vote React Dashboard template. It provides styling/markup and some scripting.

Customized template:

- authentication

- CRUD components

- presentation/landing

- design/branding/assets

- debug frontend React.js code? how to debug application?

Authentication:

The user can sign in and up using SPA interface.

- the authentication state will be stored in the root components and then passed to children that need to get/set it.

- authenticated state will be determined every time the page is reloaded (component state is not persistent)

- authentication token will be checked synchronously before rendering the root component (app).

- authenticated state will be determined by token stored in the local storage.

- sign in/up requests will be in the different file/class/methods

- sign in/up can fail or be successful:

  1. User will be redirected to the dashboard page (react router DOM). State and form will be cleared (DOM removed)

  2. Form will be filled with errors or error notification will be displayed

- When user is not authenticated it can not access certain routes and will be redirected to the sign in/up pages (authorization)

  - conditional URL routing and page rendering
