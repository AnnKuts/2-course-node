export interface Fanfic {
    fanfic_id: string;
    user_id?: string;
    title: string;
    description?: string;
    genres: string[];
    restriction?: string;
    rating?: number;
    reports?: number;
    content?: string;
}