import { UUID } from 'node:crypto'
import { Comment } from '../models/comment.ts'
import {
  getCommentsByFanficIdAsync,
  getCommentByIdAsync,
  insertCommentAsync,
  updateCommentAsync,
  deleteCommentAsync,
} from '../repository/commentRepo.ts'

export const getByFanficIdAsync = async (
  fanfic_id: string
): Promise<Comment[]> => {
  return await getCommentsByFanficIdAsync(fanfic_id)
}

export const getByIdAsync = async (
  comment_id: UUID
): Promise<Comment | null> => {
  return await getCommentByIdAsync(comment_id)
}

export const createAsync = async (
  comment: Omit<Comment, 'comment_id' | 'created_at'>
): Promise<Comment> => {
  return await insertCommentAsync(comment)
}

export const updateAsync = async (comment: Comment): Promise<void> => {
  await updateCommentAsync(comment)
}

export const deleteAsync = async (comment_id: UUID): Promise<boolean> => {
  return await deleteCommentAsync(comment_id)
}
