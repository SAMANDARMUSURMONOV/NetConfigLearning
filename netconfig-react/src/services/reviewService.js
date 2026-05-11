const REVIEWS_KEY = 'bmi_reviews';

const defaultReviews = [
    {
        name: "Jahongir Turaev",
        rating: 5,
        comment: "The best networking course I've taken! The hands-on labs with Packet Tracer perfectly bridge the gap between theory and real-world configuration.",
        date: "2026-03-25T10:00:00Z"
    },
    {
        name: "Malika Karimova",
        rating: 5,
        comment: "Outstanding structure. The explanation of OSPF and VLAN routing was incredibly clear. Now I feel fully prepared for my CCNA exam.",
        date: "2026-03-20T14:30:00Z"
    },
    {
        name: "Aziz Shavkatov",
        rating: 5,
        comment: "Premium quality content. The modules on Network Security and ACLs were exactly what I needed for my job as a junior sysadmin.",
        date: "2026-03-10T09:15:00Z"
    }
];

const reviewService = {
    getReviews: () => {
        try {
            const raw = localStorage.getItem(REVIEWS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to parse reviews from localStorage", e);
        }
        return [...defaultReviews];
    },

    addReview: (review) => {
        const currentReviews = reviewService.getReviews();
        // Insert new review at the beginning
        const updatedReviews = [review, ...currentReviews];
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));
        return updatedReviews;
    },

    hasUserReviewed: (userName) => {
        if (!userName) return false;
        const currentReviews = reviewService.getReviews();
        return currentReviews.some(r => r.name.toLowerCase() === userName.toLowerCase());
    }
};

export default reviewService;
