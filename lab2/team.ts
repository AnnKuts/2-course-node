interface Student {
    slug: string;
    fullName: string;
    lovesMom: boolean;
    bio: string;
    favouriteDb: string;
}

export const team: Student[] = [
    {
        slug: "fedorenko",
        fullName: "Ivan Fedorenko",
        lovesMom: true,
        bio: "A passionate software developer.",
        favouriteDb: "PostgreSQL"
    },
    {
        slug: "fring",
        fullName: "Gustavo Fring",
        lovesMom: false,
        bio: "A ruthless businessman.",
        favouriteDb: "MongoDB"
    }
];
