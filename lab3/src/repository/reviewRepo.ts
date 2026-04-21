import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID, UUID } from 'node:crypto';
import { Review } from '../models/review.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/review.json');

export const getAllReviewsSync = (): Review[] => {
    try {
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data) as Review[];
    } catch (error) {
        return [];
    }
};

export const getAllReviewsCallback = (
    callback: (err: NodeJS.ErrnoException | null, reviews: Review[]) => void
): void => {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            return callback(null, []);
        }
        try {
            callback(null, JSON.parse(data) as Review[]);
        } catch (parseErr) {
            callback(parseErr as NodeJS.ErrnoException, []);
        }
    });
};

export const getAllReviewsPromise = (): Promise<Review[]> => {
    return fsPromises
        .readFile(dataPath, 'utf-8')
        .then((data) => JSON.parse(data) as Review[])
        .catch(() => []);
};

export const getAllReviewsAsync = async (): Promise<Review[]> => {
    try {
        const data = await fsPromises.readFile(dataPath, 'utf-8');
        return JSON.parse(data) as Review[];
    } catch (error) {
        return [];
    }
};

export const getReviewsByPubIdAsync = (pub_id: UUID): Promise<Review[]> => {
    return getAllReviewsPromise().then((reviews) =>
        reviews.filter((r) => r.pub_id === pub_id)
    );
};

export const getReviewByIdAsync = (review_id: UUID): Promise<Review | null> => {
    return new Promise((resolve) => {
        getAllReviewsCallback((_err, reviews) => {
            resolve(reviews.find((r) => r.review_id === review_id) || null);
        });
    });
};

export const insertReviewAsync = async (
    review: Omit<Review, 'review_id'>
): Promise<Review> => {
    const reviews = await getAllReviewsAsync();
    const created: Review = { review_id: randomUUID(), ...review };
    reviews.push(created);
    await fsPromises.writeFile(dataPath, JSON.stringify(reviews, null, 2));
    return created;
};

export const updateReviewAsync = async (review: Review): Promise<void> => {
    const reviews = await getAllReviewsAsync();
    const index = reviews.findIndex((r) => r.review_id === review.review_id);

    if (index > -1) {
        reviews[index] = review;
    } else {
        reviews.push(review);
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(reviews, null, 2));
};

export const deleteReviewAsync = async (review_id: UUID): Promise<boolean> => {
    const reviews = getAllReviewsSync();
    const filtered = reviews.filter((r) => r.review_id !== review_id);

    if (filtered.length === reviews.length) {
        return false;
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    return true;
};
