import { UUID } from 'node:crypto';
import { Review } from '../models/review.ts';
import { ReviewModel, FanficModel } from '../models/associations.ts';
import sequelize from '../sequelize.ts';
import {
    getReviewsByPubIdAsync,
    getReviewByIdAsync,
    updateReviewAsync,
    deleteReviewAsync,
} from '../repository/reviewRepo.ts';

export const getByPubIdAsync = async (pub_id: UUID): Promise<Review[]> => {
    return await getReviewsByPubIdAsync(pub_id);
};

export const getByIdAsync = async (id: UUID): Promise<Review | null> => {
    return await getReviewByIdAsync(id);
};

export const updateAsync = async (review: Review): Promise<void> => {
    await updateReviewAsync(review);
};

export const deleteAsync = async (id: UUID): Promise<boolean> => {
    return await deleteReviewAsync(id);
};

// forceFail — прапорець для демонстрації відкату транзакції.
export const createReviewAndUpdateRatingTx = async (
    input: Omit<Review, 'review_id' | 'created_at'>,
    forceFail: boolean = false
): Promise<Review> => {
    return await sequelize.transaction(async (t) => {
        const created = await ReviewModel.create({
            pub_id: input.pub_id,
            user_id: input.user_id,
            comment: input.comment,
            rating: input.rating,
        }, { transaction: t });

        if (forceFail) {
            throw new Error('Forced failure to demonstrate transaction rollback');
        }

        const reviews = await ReviewModel.findAll({
            where: { pub_id: input.pub_id },
            attributes: ['rating'],
            transaction: t,
        });
        const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

        await FanficModel.update(
            { rating: avgRating },
            { where: { fanfic_id: input.pub_id }, transaction: t }
        );

        return {
            review_id: created.review_id as UUID,
            pub_id: created.pub_id as UUID,
            user_id: (created.user_id || '') as UUID,
            comment: created.comment,
            rating: Number(created.rating),
            created_at: created.created_at?.toISOString(),
        };
    });
};
