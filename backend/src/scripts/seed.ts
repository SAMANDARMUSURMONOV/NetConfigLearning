import { db } from '../config/firebase';

const videoLessons = [
    {
        id: 1,
        title: "Enterprise Network Foundations",
        description: "Modern architecture requirements and core connectivity concepts for corporate infrastructures.",
        thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
        duration: "12:45",
        level: "Beginner",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        quiz: {
            questions: [
                {
                    question: "Korxona tarmog'ining asosiy maqsadi nima?",
                    options: ["Faqat e-mail almashish", "Barcha bo'limlarni yagona tarmoqqa birlashtirish", "Faqat Wi-Fi tarqatish", "Internet tezligini oshirish"],
                    correct: 1
                },
                {
                    question: "Zamonaviy korxona tarmog'i qaysi talablarga javob berishi kerak?",
                    options: ["Faqat arzonlik", "Ishonchlilik, xavfsizlik va kengayuvchanlik", "Faqat tezkorlik", "Faqat simsiz ulanish"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 1: Requirement Analysis",
            description: "Defining and documenting network requirements for an enterprise case study.",
            downloadLink: "assignment/assignment1"
        }
    },
    // Adding just a few for demonstration; the rest will be auto-migrated
    {
        id: 2,
        title: "Project Design: Technical Specification",
        description: "Mastering the art of creating professional Technical Specifications (TZ) and requirement analysis.",
        thumbnail: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=600",
        duration: "15:20",
        level: "Beginner",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        quiz: {
            questions: [
                {
                    question: "Texnik Topshiriq (TZ) nima?",
                    options: ["Loyihaning narxini belgilovchi hujjat", "Tizimga qo'yiladigan talablarni o'z ichiga olgan rasmiy hujjat", "Faqat shartnoma nusxasi", "Dasturchilar ro'yxati"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 2: Technical Writing",
            description: "Filling out and standardizing a professional TZ document.",
            downloadLink: "assignment/assignment2"
        }
    }
];

const seedDatabase = async () => {
    try {
        for (const lesson of videoLessons) {
            // Use lesson id as document ID for easy mapping
            await db.collection('lessons').doc(lesson.id.toString()).set(lesson);
            console.log(`Uploaded lesson ${lesson.id}`);
        }
        console.log('Database seeding completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();
