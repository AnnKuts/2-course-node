import { UUID } from 'node:crypto'
import { Review } from '../models/review.ts'
import { ReviewModel } from '../models/associations.ts'
import sequelize from '../sequelize.ts'

const toReview = (m: ReviewModel): Review => ({
  review_id: m.review_id as UUID,
  pub_id: m.pub_id as UUID,
  user_id: (m.user_id || '') as UUID,
  comment: m.comment,
  rating: Number(m.rating),
  created_at: m.created_at?.toISOString(),
})

export const getReviewsByPubIdAsync = async (
  pub_id: UUID
): Promise<Review[]> => {
  const reviews = await ReviewModel.findAll({ where: { pub_id } })
  return reviews.map(toReview)
}

export const getReviewByIdAsync = async (id: UUID): Promise<Review | null> => {
  const review = await ReviewModel.findByPk(id)
  return review ? toReview(review) : null
}

export const updateReviewAsync = async (review: Review): Promise<void> => {
  await sequelize.transaction(async (t) => {
    await ReviewModel.update(
      { comment: review.comment, rating: review.rating },
      { where: { review_id: review.review_id }, transaction: t }
    )
  })
}

export const deleteReviewAsync = async (id: UUID): Promise<boolean> => {
  return await sequelize.transaction(async (t) => {
    const count = await ReviewModel.destroy({
      where: { review_id: id },
      transaction: t,
    })
    return count > 0
  })
}
