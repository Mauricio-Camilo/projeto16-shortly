CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE urls (
    "shortUrl" TEXT NOT NULL,
    url TEXT NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);



