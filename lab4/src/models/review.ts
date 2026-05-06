import { UUID } from "node:crypto";

export interface Review {
    review_id: UUID;
    pub_id: UUID;
    user_id: UUID;
    comment: string;
    rating: number;
    created_at?: string;
}
