import { UUID } from 'node:crypto'
import { Comment } from '../models/comment.ts'
import { CommentModel } from '../models/associations.ts'
import sequelize from '../sequelize.ts'

const toComment = (m: CommentModel): Comment => ({
  comment_id: m.comment_id as UUID,
  fanfic_id: m.fanfic_id,
  user_id: (m.user_id || '') as UUID,
  text: m.text,
  created_at: m.created_at?.toISOString() ?? '',
})

export const getCommentsByFanficIdAsync = async (
  fanfic_id: string
): Promise<Comment[]> => {
  const comments = await CommentModel.findAll({
    where: { fanfic_id },
    order: [['created_at', 'ASC']],
  })
  return comments.map(toComment)
}

export const getCommentByIdAsync = async (
  comment_id: UUID
): Promise<Comment | null> => {
  const comment = await CommentModel.findByPk(comment_id)
  return comment ? toComment(comment) : null
}

export const insertCommentAsync = async (
  comment: Omit<Comment, 'comment_id' | 'created_at'>
): Promise<Comment> => {
  return await sequelize.transaction(async (t) => {
    const created = await CommentModel.create(
      {
        fanfic_id: comment.fanfic_id,
        user_id: comment.user_id,
        text: comment.text,
      },
      { transaction: t }
    )
    return toComment(created)
  })
}

export const updateCommentAsync = async (comment: Comment): Promise<void> => {
  await sequelize.transaction(async (t) => {
    await CommentModel.update(
      { text: comment.text },
      { where: { comment_id: comment.comment_id }, transaction: t }
    )
  })
}

export const deleteCommentAsync = async (
  comment_id: UUID
): Promise<boolean> => {
  return await sequelize.transaction(async (t) => {
    const count = await CommentModel.destroy({
      where: { comment_id },
      transaction: t,
    })
    return count > 0
  })
}
