CREATE TABLE IF NOT EXISTS genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TYPE age_restriction AS ENUM (
    '0+',
    '12+',
    '16+',
    '18+'
);

CREATE TABLE IF NOT EXISTS fanfics (
    fanfic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    restriction age_restriction DEFAULT '0+',
    rating NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fanfic_genres (
    fanfic_id UUID REFERENCES fanfics(fanfic_id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE,
    PRIMARY KEY (fanfic_id, genre_id)
);