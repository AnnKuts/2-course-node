interface Student {
    slug: string;
    fullName: string;
    lovesMom: boolean;
    favouriteDb?: string;
}

export const team: Student[] = [
    {
        slug: "fedorenko",
        fullName: "Ivan Fedorenko",
        lovesMom: true,
        favouriteDb: "PostgreSQL"
    },
    {
        slug: "fring",
        fullName: "Gustavo Fring",
        lovesMom: false
    }
];
