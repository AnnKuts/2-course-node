import { pool } from '../db.ts';
import { Fanfic } from '../models/fanfic.ts';
import { FanficDbRow } from '../interfaces/fanficDbInterface.ts';

export const getAll = async (): Promise<Fanfic[]> => {
    const result = await pool.query<FanficDbRow>(
        `SELECT f.*, fc.content,
                COALESCE(json_agg(g.name) FILTER (WHERE g.name IS NOT NULL), '[]') AS genres
         FROM fanfics f
         LEFT JOIN fanfic_contents fc ON f.fanfic_id = fc.fanfic_id
         LEFT JOIN fanfic_genres fg ON f.fanfic_id = fg.fanfic_id
         LEFT JOIN genres g ON fg.genre_id = g.genre_id
         GROUP BY f.fanfic_id, fc.content`);

    return result.rows.map((r) => ({
        fanfic_id: r.fanfic_id,
        user_id: r.user_id || '',
        title: r.title,
        description: r.description,
        genres: r.genres || [],
        restriction: r.restriction,
        rating: Number(r.rating) || 0,
        reports: Number(r.reports) || 0,
        content: r.content
    } as Fanfic));
};

export const getById = async (id: string): Promise<Fanfic | null> => {
    const result = await pool.query<FanficDbRow>(
        `SELECT f.*, fc.content,
                COALESCE(json_agg(g.name) FILTER (WHERE g.name IS NOT NULL), '[]') AS genres
         FROM fanfics f
         LEFT JOIN fanfic_contents fc ON f.fanfic_id = fc.fanfic_id
         LEFT JOIN fanfic_genres fg ON f.fanfic_id = fg.fanfic_id
         LEFT JOIN genres g ON fg.genre_id = g.genre_id
         WHERE f.fanfic_id = $1
         GROUP BY f.fanfic_id, fc.content`, [id]);

    if (!result.rows.length) return null;
    const r = result.rows[0];
    return {
        fanfic_id: r.fanfic_id,
        user_id: r.user_id || '',
        title: r.title,
        description: r.description,
        genres: r.genres || [],
        restriction: r.restriction,
        rating: Number(r.rating) || 0,
        reports: Number(r.reports) || 0,
        content: r.content
    } as Fanfic;
};

export const create = async (fanfic: Partial<Fanfic>): Promise<string> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const insert = await client.query(
            `INSERT INTO fanfics (title, description, reports, restriction, rating) VALUES ($1, $2, $3, $4, $5) RETURNING fanfic_id`,
            [fanfic.title, fanfic.description, fanfic.reports || 0, fanfic.restriction || '0+', fanfic.rating || 0]
        );
        const newId = insert.rows[0].fanfic_id;

        if (fanfic.content) {
            await client.query(`INSERT INTO fanfic_contents (fanfic_id, content) VALUES ($1, $2)`, [newId, fanfic.content]);
        }

        if (fanfic.genres && fanfic.genres.length) {
            for (const gName of fanfic.genres) {
                await client.query(`INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [gName]);
                const sel = await client.query(`SELECT genre_id FROM genres WHERE name=$1`, [gName]);
                const genreId = sel.rows[0].genre_id;
                await client.query(`INSERT INTO fanfic_genres (fanfic_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [newId, genreId]);
            }
        }

        await client.query('COMMIT');
        return newId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const update = async (id: string, fanfic: Partial<Fanfic>): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE fanfics 
             SET title = COALESCE($1, title), 
                 description = COALESCE($2, description), 
                 reports = COALESCE($3, reports), 
                 restriction = COALESCE($4, restriction), 
                 rating = COALESCE($5, rating) 
             WHERE fanfic_id = $6`,
            [
                fanfic.title ?? null, 
                fanfic.description ?? null, 
                fanfic.reports ?? null, 
                fanfic.restriction ?? null, 
                fanfic.rating ?? null, 
                id
            ]
        );

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            throw new Error('Fanfic not found');
        }

        if (fanfic.content !== undefined) {
            await client.query(
                `INSERT INTO fanfic_contents (fanfic_id, content) VALUES ($1, $2)
                 ON CONFLICT (fanfic_id) DO UPDATE SET content = EXCLUDED.content`,
                [id, fanfic.content]
            );
        }

        if (fanfic.genres !== undefined) {
            const currentGenresRes = await client.query<{ name: string }>(
                `SELECT g.name FROM fanfic_genres fg JOIN genres g ON fg.genre_id = g.genre_id WHERE fg.fanfic_id = $1`,
                [id]
            );
            const currentGenres = currentGenresRes.rows.map(r => r.name);

            const newGenres = fanfic.genres || [];

            const toAdd = newGenres.filter(g => !currentGenres.includes(g));
            const toRemove = currentGenres.filter(g => !newGenres.includes(g));

            for (const gName of toAdd) {
                await client.query(`INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [gName]);
                const sel = await client.query(`SELECT genre_id FROM genres WHERE name=$1`, [gName]);
                const genreId = sel.rows[0].genre_id;
                await client.query(`INSERT INTO fanfic_genres (fanfic_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, genreId]);
            }

            for (const gName of toRemove) {
                const sel = await client.query(`SELECT genre_id FROM genres WHERE name=$1`, [gName]);
                if (sel.rows.length) {
                    const genreId = sel.rows[0].genre_id;
                    await client.query(`DELETE FROM fanfic_genres WHERE fanfic_id = $1 AND genre_id = $2`, [id, genreId]);
                }
            }
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
