-- Létrehozandó táblák: users, professionals, reviews, requests

-- Felhasználók táblája (ügyfelek és szakemberek közös táblában)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'professional')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Szakemberekhez tartozó extra adatok (csak ha role = 'professional')
CREATE TABLE IF NOT EXISTS professionals (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    profession TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    image_url TEXT
);

-- Értékelések tábla
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    professional_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Megkeresések / foglalások
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    professional_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexek a teljesítmény javításához
CREATE INDEX idx_reviews_professional_id ON reviews(professional_id);
CREATE INDEX idx_requests_professional_id ON requests(professional_id);
CREATE INDEX idx_requests_customer_id ON requests(customer_id);
