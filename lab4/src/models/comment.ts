import { UUID } from "node:crypto";

export interface Comment {
    comment_id: UUID;
    fanfic_id: string;
    user_id: UUID;
    text: string;
    created_at: string;
}
