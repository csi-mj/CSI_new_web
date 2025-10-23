import { Event } from "../types/event";
import aiSummitImg from "../assets/events/event-ai-summit.jpg";
import cybersecurityImg from "../assets/events/event-cybersecurity.jpg";
import webBootcampImg from "../assets/events/event-web-bootcamp.jpg";
import hackathonImg from "../assets/events/event-hackathon.jpg";
import cloudSeminarImg from "../assets/events/event-cloud-seminar.jpg";
import mobileDevImg from "../assets/events/event-mobile-dev.jpg";

export const eventsData: Event[] = [
  {
    id: "1",
    title: "TechFest 2024: AI & Machine Learning Summit",
    date: "2024-09-15",
    category: "Conference",
    description: "A comprehensive summit exploring the latest trends in AI and Machine Learning, featuring industry experts and hands-on workshops.",
    fullDescription: "Our flagship TechFest 2024 brought together over 300 students and professionals for an immersive experience in Artificial Intelligence and Machine Learning. The event featured keynote speeches from industry leaders, interactive workshops on neural networks, deep learning, and practical AI applications. Participants engaged in hackathons, networking sessions, and live demonstrations of cutting-edge AI technologies.",
    image: aiSummitImg,
    attendees: 320,
    speakers: ["Dr. Rajesh Kumar - AI Research Lead, Google", "Prof. Anita Sharma - ML Expert, IIT Delhi", "Arjun Patel - Data Scientist, Microsoft"],
    highlights: [
      "Hands-on workshop on TensorFlow and PyTorch",
      "24-hour AI Hackathon with prizes worth ₹2 lakhs",
      "Live demonstration of GPT models and LLMs",
      "Career guidance session for aspiring data scientists",
      "Networking dinner with industry professionals"
    ]
  },
  {
    id: "2",
    title: "Cybersecurity Workshop: Ethical Hacking 101",
    date: "2024-08-22",
    category: "Workshop",
    description: "An intensive workshop covering fundamental concepts of cybersecurity, ethical hacking techniques, and network security practices.",
    fullDescription: "This hands-on cybersecurity workshop provided students with practical knowledge of ethical hacking, penetration testing, and network security. Participants learned about various attack vectors, defensive strategies, and the ethical considerations of security research. The workshop included live demonstrations of common vulnerabilities and how to protect against them.",
    image: cybersecurityImg,
    attendees: 150,
    speakers: ["Vikram Singh - Cybersecurity Consultant", "Priya Menon - Security Researcher"],
    highlights: [
      "Introduction to Kali Linux and security tools",
      "Web application penetration testing",
      "Network scanning and vulnerability assessment",
      "Certified Ethical Hacker (CEH) exam preparation tips",
      "Real-world case studies of security breaches"
    ]
  },
  {
    id: "3",
    title: "Web Dev Bootcamp: MERN Stack Mastery",
    date: "2024-07-10",
    category: "Bootcamp",
    description: "A 5-day intensive bootcamp focused on full-stack web development using MongoDB, Express.js, React, and Node.js.",
    fullDescription: "Our popular MERN Stack Bootcamp equipped students with the skills to build modern, scalable web applications. Over five days, participants progressed from basic concepts to deploying production-ready applications. The bootcamp covered frontend development with React, backend APIs with Node.js and Express, database design with MongoDB, and deployment strategies.",
    image: webBootcampImg,
    attendees: 200,
    speakers: ["Rahul Verma - Senior Full Stack Developer, Amazon", "Sneha Reddy - Frontend Architect"],
    highlights: [
      "Built and deployed 3 full-stack projects",
      "RESTful API design and authentication",
      "State management with Redux and Context API",
      "MongoDB database design and optimization",
      "CI/CD pipelines and cloud deployment"
    ]
  },
  {
    id: "4",
    title: "CodeSprint 2024: 48-Hour Hackathon",
    date: "2024-06-05",
    category: "Hackathon",
    description: "A competitive 48-hour hackathon challenging teams to build innovative solutions for real-world problems.",
    fullDescription: "CodeSprint 2024 was our most successful hackathon yet, with 50 teams competing to build innovative tech solutions. Participants worked around the clock to develop applications addressing challenges in education, healthcare, and sustainability. The event featured mentorship sessions, technical workshops, and judging by a panel of industry experts and venture capitalists.",
    image: hackathonImg,
    attendees: 250,
    speakers: ["Judging Panel: Industry Leaders from Tech Startups"],
    highlights: [
      "50 teams, 200+ participants",
      "Prizes worth ₹5 lakhs including cash and internship offers",
      "Mentorship from startup founders and CTOs",
      "Sponsor booths from leading tech companies",
      "Pitch presentations to potential investors"
    ]
  },
  {
    id: "5",
    title: "Cloud Computing Seminar: AWS & Azure Deep Dive",
    date: "2024-05-18",
    category: "Seminar",
    description: "An expert-led seminar exploring cloud architecture, services, and best practices on AWS and Azure platforms.",
    fullDescription: "This comprehensive cloud computing seminar provided in-depth knowledge of leading cloud platforms. Attendees learned about cloud architecture patterns, serverless computing, containerization, and how to design scalable, cost-effective cloud solutions. The session included live demonstrations of deploying applications on AWS and Azure.",
    image: cloudSeminarImg,
    attendees: 180,
    speakers: ["Karthik Iyer - Cloud Solutions Architect, AWS", "Meera Joshi - Azure Consultant"],
    highlights: [
      "AWS Lambda and Azure Functions serverless development",
      "Docker and Kubernetes container orchestration",
      "Cloud cost optimization strategies",
      "CI/CD pipelines in cloud environments",
      "Hands-on labs with AWS and Azure free tier"
    ]
  },
  {
    id: "6",
    title: "Mobile App Development Workshop: Flutter & React Native",
    date: "2024-04-12",
    category: "Workshop",
    description: "A practical workshop on cross-platform mobile development using Flutter and React Native frameworks.",
    fullDescription: "Students explored the world of mobile app development through hands-on experience with Flutter and React Native. The workshop covered UI design principles, state management, API integration, and publishing apps to app stores. Participants built complete mobile applications from scratch during the session.",
    image: mobileDevImg,
    attendees: 170,
    speakers: ["Amit Shah - Lead Mobile Developer", "Divya Kumar - UI/UX Designer"],
    highlights: [
      "Built native-like apps for iOS and Android",
      "Firebase integration for real-time features",
      "State management with Provider and Redux",
      "App store submission process and guidelines",
      "Performance optimization techniques"
    ]
  }
];
