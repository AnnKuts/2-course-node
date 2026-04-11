import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID, UUID } from 'node:crypto';
import { Review } from '../models/review.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../../data/review.json');

export const getAllReviewsAsync = async (): Promise<Review[]> => {
    try {
        const data = await fsPromises.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const getReviewsByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    const reviews = await getAllReviewsAsync();
    return reviews.filter(r => r.pub_id === pub_id);
};

export const getReviewByIdAsync = async (review_id: UUID): Promise<Review | null> => {
    const reviews = await getAllReviewsAsync();
    return reviews.find(r => r.review_id === review_id) || null;
};

export const insertReviewAsync = async (review: Omit<Review, 'review_id'>): Promise<Review> => {
    const reviews = await getAllReviewsAsync();
    const created: Review = { review_id: randomUUID(), ...review };
    reviews.push(created);
    await fsPromises.writeFile(dataPath, JSON.stringify(reviews, null, 2));
    return created;
};

export const updateReviewAsync = async (review: Review): Promise<void> => {
    const reviews = await getAllReviewsAsync();
    const index = reviews.findIndex(r => r.review_id === review.review_id);

    if (index > -1) {
        reviews[index] = review;
    } else {
        reviews.push(review);
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(reviews, null, 2));
};

export const deleteReviewAsync = async (review_id: UUID): Promise<boolean> => {
    const reviews = await getAllReviewsAsync();
    const filtered = reviews.filter(r => r.review_id !== review_id);

    if (filtered.length === reviews.length) {
        return false;
    }

    await fsPromises.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    return true;
};
