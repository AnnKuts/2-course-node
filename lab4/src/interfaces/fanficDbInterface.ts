export interface FanficDbRow {
    fanfic_id: string;
    user_id?: string;
    title: string;
    description?: string;
    reports: number;
    restriction: string;
    rating: number;
    content?: string;
    genres?: string[];
}