interface Student {
    slug: string;
    fullName: string;
    imagePath: string;
    bio: string;
    socialLink: string;
    favouriteDb: string;
}

export const team: Student[] = [
    {
        slug: "fedorenko",
        fullName: "Ivan Fedorenko",
        imagePath: "/assets/gustavo.jpg",
        bio: "A passionate software developer.",
        socialLink: "https://www.linkedin.com/in/fedorenkoivan/",
        favouriteDb: "PostgreSQL"
    },
    {
        slug: "loban",
        fullName: "Mykhailo Loban",
        imagePath: "/assets/gustavo.jpg",
        bio: "A ruthless businessman.",
        socialLink: "https://www.linkedin.com/in/mykhailo-loban-a6a10a383/",
        favouriteDb: "MongoDB"
    }
];
