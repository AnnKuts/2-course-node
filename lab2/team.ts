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
        technologies: ["React", "Angular", "Node.js", "PostgreSQL", "Python", "Gitlab"],
        hobbies: ["Bicycles", "Fantasy", "Cooking"],
        favoriteQuote: "The band members might change, but the song remains the same.",
        favoriteMovie: "The Hobbit: The Desolation of Smaug",
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
    },
    {
        slug: "makarevych",
        fullName: "Bogdan Makarevych",
        imagePath: "/assets/hedgehog.png",
        bio: "An FIOT student.",
        favouriteDb: "MariaDB",
        technologies: ["React", "Node.js", "Go", "Dart", "Flutter", "MariaDB", "Jest", "Docker", "Postman", "Figma"],
        hobbies: ["Videogames", "Coding", "Flaneur"],
        favoriteQuote: "viva la vida",
        favoriteMovie: "The Shawshank Redemption",
        socialLink: "https://www.linkedin.com/in/bogdan-makarevych-ab43ab321/"
    },
  {
    slug: "kuts",
    fullName: "Anna Kuts",
    imagePath: "/assets/fluttershy.png",
    bio: "FICE student and passionate product oriented developer",
    favouriteDb: "PostgreSQL",
    technologies: ["JS/TS", "React", "Git", "CSS/HTML", "Node.js", "SvelteKit", "SQL", "NoSQL", "Bash", "Linux", "Docker", "Postman", "Figma", "Canva", "ClickUp", "Notion", "Agile"],
    hobbies: ["Design", "Volunteering", "Travelling"],
    favoriteQuote: "Never lose. Only win or learn",
    favoriteMovie: "The Secretary",
    socialLink: "https://www.linkedin.com/in/anna-kuts-b0ab1a2b7"
  }
];
