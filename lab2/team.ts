interface Student {
    slug: string;
    fullName: string;
    imagePath: string;
    bio: string;
    favouriteDb: string;
    technologies: string[];
    hobbies: string[];
    favoriteQuote: string;
    favoriteMovie: string;
    socialLink: string;
}

export const team: Student[] = [
    {
        slug: "fedorenko",
        fullName: "Ivan Fedorenko",
        imagePath: "/assets/gustavo.jpg",
        bio: "A passionate software developer.",
        favouriteDb: "PostgreSQL",
        technologies: [],
        hobbies: [],
        favoriteQuote: "",
        favoriteMovie: "",
        socialLink: "https://www.linkedin.com/in/fedorenkoivan/"
    },
    {
        slug: "loban",
        fullName: "Mykhailo Loban",
        imagePath: "/assets/gustavo.jpg",
        bio: "A ruthless businessman.",
        favouriteDb: "MongoDB",
        technologies: [],
        hobbies: [],
        favoriteQuote: "",
        favoriteMovie: "",
        socialLink: "https://www.linkedin.com/in/mykhailo-loban-a6a10a383/"
    },
        {
        slug: "khorunzha",
        fullName: "Mariia Khorunzha",
        imagePath: "/assets/clem.png",
        bio: "An outstanding FIOT student.",
        favouriteDb: "MongoDB",
        technologies: ["React", "Node.js", "Fastify", "PostgreSQL", "Jest", "Docker", "Postman", "Figma"],
        hobbies: ["Reading", "Videogames", "Sports"],
        favoriteQuote: "not every wrapper is a decorator, but every decorator is a wrapper",
        favoriteMovie: "Before i fall",
        socialLink: "https://www.linkedin.com/in/mariia-khorunzha-93072b336/"
    }
];
