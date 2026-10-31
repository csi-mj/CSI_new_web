
export type Blog = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  link: string;
};

// --------------------------------------------
// MEDIUM
// --------------------------------------------

export const MEDIUM_URL =
  "https://medium.com/@your-medium-publication";

// --------------------------------------------
// FEATURED BLOG
// --------------------------------------------

export const FEATURED_BLOG: Blog = {
  id: 0,
  title: "The Future of AI in Higher Education",
  description:
    "Exploring how artificial intelligence is transforming the way we learn, research and build in universities like ours.",
  category: "Technology",
  author: "CSI MJCET",
  date: "2026-03-05",
  readTime: "8 min read",
  image: "/blogs/featured-ai.jpg",
  link: "#",
};

// --------------------------------------------
// CATEGORIES
// --------------------------------------------

export const categories = [
  "All",
  "Technology",
  "Student Life",
  "Event Recap",
  "Research",
  "Design",
  "Innovation",
  "Opportunities",
];

// --------------------------------------------
// PAGINATION
// --------------------------------------------

export const POSTS_PER_PAGE = 6;

// --------------------------------------------
// BLOG DATA
// --------------------------------------------

export const blogs: Blog[] = [
  {
    id: 1,
    title: "Role of Design in Making User-Friendly Apps",
    description:
      "How thoughtful design can transform productivity and create better digital experiences for everyone.",
    category: "Technology",
    author: "Areesha Khan",
    date: "2026-03-03",
    readTime: "6 min read",
    image: "/blogs/design-apps.jpg",
    link: "#",
  },

  {
    id: 2,
    title: "Quantum Computing: What Lies Ahead?",
    description:
      "An introduction to quantum computing and its potential impact on real-world applications.",
    category: "Research",
    author: "Aisha Erum",
    date: "2026-03-02",
    readTime: "7 min read",
    image: "/blogs/quantum.jpg",
    link: "#",
  },

  {
    id: 3,
    title: "Building Scalable Web Apps with Next.js",
    description:
      "A beginner's guide to building fast and scalable web applications using Next.js and modern tools.",
    category: "Technology",
    author: "Affaaf Ahmed",
    date: "2026-02-28",
    readTime: "8 min read",
    image: "/blogs/web-development.jpg",
    link: "#",
  },

  {
    id: 4,
    title: "The Rise of Robotics in Everyday Life",
    description:
      "Exploring how robotics is gradually becoming a part of our daily lives.",
    category: "Innovation",
    author: "Sara Fatima",
    date: "2026-02-25",
    readTime: "5 min read",
    image: "/blogs/robotics.jpg",
    link: "#",
  },

  {
    id: 5,
    title: "Lessons Learned from Hackathons",
    description:
      "Key takeaways, challenges and personal growth from participating in national hackathons.",
    category: "Student Life",
    author: "Zaid Khan",
    date: "2026-02-22",
    readTime: "6 min read",
    image: "/blogs/hackathon.jpg",
    link: "#",
  },

  {
    id: 6,
    title: "Top Tech Opportunities for Students in 2026",
    description:
      "A curated list of internships, fellowships and competitions for tech enthusiasts.",
    category: "Opportunities",
    author: "Nusrah Ahmed",
    date: "2026-02-18",
    readTime: "4 min read",
    image: "/blogs/opportunities.jpg",
    link: "#",
  },

  {
    id: 7,
    title: "The Future of Artificial Intelligence",
    description:
      "Discover how AI is reshaping industries, education and the way we interact with technology.",
    category: "Technology",
    author: "Arisa Laiba",
    date: "2026-02-15",
    readTime: "6 min read",
    image: "/blogs/artificial-intelligence.jpg",
    link: "#",
  },

  {
    id: 8,
    title: "Inside Our Latest Technical Event",
    description:
      "A look back at the ideas, projects and experiences that brought our community together.",
    category: "Event Recap",
    author: "Aisha Erum",
    date: "2026-02-10",
    readTime: "5 min read",
    image: "/blogs/event-recap.jpg",
    link: "#",
  },

  {
    id: 9,
    title: "Creative Thinking in Technology",
    description:
      "Why creativity and problem-solving matter just as much as technical skills.",
    category: "Design",
    author: "Affaaf Ahmed",
    date: "2026-02-05",
    readTime: "4 min read",
    image: "/blogs/creative-tech.jpg",
    link: "#",
  },
];
