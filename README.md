# mail

A single-page email client: a Django JSON API with a JavaScript front end that never reloads the
page. Built for **Harvard CS50W, Web Programming with Python and JavaScript** (completed 2023).

## What it does

- **Sends, receives, archives and replies to** mail between registered users
- **Three mailboxes**, inbox, sent and archive, served from one endpoint by mailbox name
- **Marks read state** on open, over the API rather than by reloading

## The API

```
GET   /emails/<mailbox>     list a mailbox
GET   /emails/<id>          one email
POST  /emails               send
PUT   /emails/<id>          mark read or archived
```

## What it demonstrates

Designing a small JSON API in Django and consuming it from the browser: `fetch`, rendering from
responses, and keeping all view state on the client while the server stays stateless between calls.

## Running it

```
python -m venv .venv && source .venv/bin/activate
pip install django
python manage.py migrate
python manage.py runserver
```

The database is not committed. `migrate` creates one.
