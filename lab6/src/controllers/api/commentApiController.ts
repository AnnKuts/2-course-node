import { Response } from 'express'
import { UUID } from 'node:crypto'
import {
  getByFanficIdAsync,
  getByIdAsync,
  createAsync,
  updateAsync,
  deleteAsync,
} from '../../services/commentService.ts'
import { AuthenticatedRequest } from '../../middleware/authMiddleware.ts'

/** GET /api/v1/fanfics/:id/comments */
export const listCommentsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const comments = await getByFanficIdAsync(String(req.params.id))
    res.status(200).json({ data: comments })
  } catch {
    res.status(500).json({ error: 'Failed to retrieve comments' })
  }
}

/** POST /api/v1/comments */
export const createCommentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { fanfic_id, text } = req.body
  const user_id = req.user?.user_id as UUID | undefined

  if (!fanfic_id || !text || !user_id) {
    res
      .status(400)
      .json({ error: 'fanfic_id, text and auth token are required' })
    return
  }
  if (typeof text !== 'string' || text.trim().length === 0) {
    res.status(422).json({ error: 'text must be a non-empty string' })
    return
  }

  try {
    const comment = await createAsync({
      fanfic_id,
      user_id,
      text: text.trim(),
    })
    res.status(201).json({ data: comment, message: 'Comment created' })
  } catch {
    res.status(500).json({ error: 'Failed to create comment' })
  }
}

/** PUT /api/v1/comments/:id */
export const updateCommentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const comment_id = String(req.params.id) as UUID
  const { text } = req.body
  const user_id = req.user?.user_id

  try {
    const existing = await getByIdAsync(comment_id)
    if (!existing) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }
    if (existing.user_id !== user_id) {
      res.status(403).json({ error: 'Only the author can edit this comment' })
      return
    }
    if (typeof text !== 'string' || text.trim().length === 0) {
      res.status(422).json({ error: 'text must be a non-empty string' })
      return
    }
    const updated = { ...existing, text: text.trim() }
    await updateAsync(updated)
    res.status(200).json({ data: updated, message: 'Comment updated' })
  } catch {
    res.status(500).json({ error: 'Failed to update comment' })
  }
}

/** DELETE /api/v1/comments/:id */
export const deleteCommentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const comment_id = String(req.params.id) as UUID
  const user_id = req.user?.user_id

  try {
    const existing = await getByIdAsync(comment_id)
    if (!existing) {
      res.status(404).json({ error: 'Comment not found' })
      return
    }
    if (existing.user_id !== user_id) {
      res.status(403).json({ error: 'Only the author can delete this comment' })
      return
    }
    await deleteAsync(comment_id)
    res.status(200).json({ message: 'Comment deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete comment' })
  }
}
