import { pool } from '../db.ts';
import { Fanfic } from '../models/fanfic.ts';

export const getAll = async (): Promise<Fanfic[]> => {
    const result = await pool.query(
        `SELECT f.*, fc.content,
                ARRAY(
                    SELECT g.name
                    FROM fanfic_genres fg
                    JOIN genres g ON fg.genre_id = g.genre_id
                    WHERE fg.fanfic_id = f.fanfic_id
                ) AS genres
         FROM fanfics f
         LEFT JOIN fanfic_contents fc ON f.fanfic_id = fc.fanfic_id`);

    return result.rows.map((r: any) => ({
        fanfic_id: r.fanfic_id,
        user_id: r.user_id || '',
        title: r.title,
        description: r.description,
        genre: r.genres || [],
        restriction: r.restriction,
        rating: Number(r.rating) || 0,
        reports: Number(r.reports) || 0,
        content: r.content
    }) as Fanfic);
};

export const getById = async (id: string): Promise<Fanfic | null> => {
    const result = await pool.query(
        `SELECT f.*, fc.content,
                ARRAY(
                    SELECT g.name
                    FROM fanfic_genres fg
                    JOIN genres g ON fg.genre_id = g.genre_id
                    WHERE fg.fanfic_id = f.fanfic_id
                ) AS genres
         FROM fanfics f
         LEFT JOIN fanfic_contents fc ON f.fanfic_id = fc.fanfic_id
         WHERE f.fanfic_id = $1`, [id]);

    if (!result.rows.length) return null;
    const r = result.rows[0];
    return {
        fanfic_id: r.fanfic_id,
        user_id: r.user_id || '',
        title: r.title,
        description: r.description,
        genre: r.genres || [],
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
            `INSERT INTO fanfics (user_id, title, description, reports, restriction, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING fanfic_id`,
            [fanfic.user_id || null, fanfic.title, fanfic.description, fanfic.reports || 0, fanfic.restriction || '0+', fanfic.rating || 0]
        );
        const newId = insert.rows[0].fanfic_id;

        if (fanfic.content) {
            await client.query(`INSERT INTO fanfic_contents (fanfic_id, content) VALUES ($1, $2)`, [newId, fanfic.content]);
        }

        if (fanfic.genre && Array.isArray(fanfic.genre)) {
            for (const g of fanfic.genre) {
                await client.query(`INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [g]);
                const sel = await client.query(`SELECT genre_id FROM genres WHERE name=$1`, [g]);
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

        if (fanfic.genre !== undefined) {
            await client.query(`DELETE FROM fanfic_genres WHERE fanfic_id = $1`, [id]);
            if (fanfic.genre && Array.isArray(fanfic.genre)) {
                for (const g of fanfic.genre) {
                    await client.query(`INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`, [g]);
                    const sel = await client.query(`SELECT genre_id FROM genres WHERE name=$1`, [g]);
                    const genreId = sel.rows[0].genre_id;
                    await client.query(`INSERT INTO fanfic_genres (fanfic_id, genre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, genreId]);
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
