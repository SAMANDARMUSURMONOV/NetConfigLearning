export const defaultVideoLessons = [
    {
        id: 1,
        title: "Enterprise Network Foundations",
        description: "Modern architecture requirements and core connectivity concepts for corporate infrastructures.",
        thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
        duration: "12:45",
        level: "Beginner",
        videoUrl: "video/video_dars1.mp4",
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
    {
        id: 2,
        title: "Project Design: Technical Specification",
        description: "Mastering the art of creating professional Technical Specifications (TZ) and requirement analysis.",
        thumbnail: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=600",
        duration: "15:20",
        level: "Beginner",
        videoUrl: "video/video_dars2.mp4",
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
    },
    {
        id: 3,
        title: "Hierarchical Topology Models",
        description: "Deep dive into the Cisco 3-layer model: Core, Distribution, and Access layers.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600",
        duration: "18:10",
        level: "Intermediate",
        videoUrl: "video/video_dars3.mp4",
        quiz: {
            questions: [
                {
                    question: "Cisco Ierarxik modeli nechta qatlamdan iborat?",
                    options: ["2 qatlam", "3 qatlam (Core, Distribution, Access)", "4 qatlam", "5 qatlam"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 3: Topology Visualization",
            description: "Designing a 3-layer network hierarchy using Visio or Draw.io.",
            downloadLink: "assignment/assignment3"
        }
    },
    {
        id: 4,
        title: "Hardware Selection Protocols",
        description: "Advanced criteria for selecting enterprise-grade Routers, Switches, and Access Points.",
        thumbnail: "https://images.unsplash.com/photo-1544890225-2f3faec4cd60?auto=format&fit=crop&q=80&w=600",
        duration: "14:35",
        level: "Beginner",
        videoUrl: "video/video_dars4.mp4",
        quiz: {
            questions: [
                {
                    question: "Router (Marshrutizator) ning asosiy vazifasi nima?",
                    options: ["Tarmoq ichidagi qurilmalarni ulash", "Turli tarmoqlarni o'zaro bog'lash va paketlarni yo'naltirish", "Signalni kuchaytirish", "Faqat Wi-Fi tarqatish"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 4: Hardware Specification",
            description: "Selecting optimal router/switch models for a corporate campus.",
            downloadLink: "assignment/assignment4"
        }
    },
    {
        id: 5,
        title: "IP Addressing Strategy",
        description: "Professional IP planning using VLSM and advanced subnetting strategies.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600",
        duration: "22:15",
        level: "Intermediate",
        videoUrl: "video/video_dars5.mp4",
        quiz: {
            questions: [
                {
                    question: "IPv4 manzili necha bitdan iborat?",
                    options: ["16 bit", "32 bit", "64 bit", "128 bit"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 5: Advanced Subnetting",
            description: "Designing a corporate IP plan using VLSM templates.",
            downloadLink: "assignment/assignment5"
        }
    },
    {
        id: 6,
        title: "Physical Layer Implementation",
        description: "Standards for structured cabling and professional server rack optimization.",
        thumbnail: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?auto=format&fit=crop&q=80&w=600",
        duration: "16:40",
        level: "Beginner",
        videoUrl: "video/video_dars6.mp4",
        quiz: {
            questions: [
                {
                    question: "T568B standarti bo'yicha kabel ranglar ketma-ketligi qanday?",
                    options: ["Yashil-Oq", "Oq-Sabzi, Sabzi...", "Ko'k-Oq", "Jigarrang"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 6: Cabling & Patch Panels",
            description: "Cabling schema design and krossirovka standards.",
            downloadLink: "assignment/assignment6"
        }
    },
    {
        id: 7,
        title: "L2 Switching: VLAN Segmentation",
        description: "Segmenting departments using Virtual LANs for improved security and performance.",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
        duration: "19:50",
        level: "Intermediate",
        videoUrl: "video/video_dars7.mp4",
        quiz: {
            questions: [
                {
                    question: "VLAN (Virtual LAN) nima?",
                    options: ["Jismoniy tarmoqni mantiqiy segmentlarga bo'lish", "Internet tezlatgich", "Virus dasturi", "Wi-Fi nomi"],
                    correct: 0
                }
            ]
        },
        labWork: {
            title: "Lab 7: VLAN Configuration",
            description: "Creating VLANs and assigned ports on Cisco Catalyst switches.",
            downloadLink: "assignment/assignment7"
        }
    },
    {
        id: 8,
        title: "L2 Switching: Trunking & VTP",
        description: "Mastering Trunk ports and VTP protocols for automated VLAN management.",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
        duration: "21:10",
        level: "Intermediate",
        videoUrl: "video/video_dars8.mp4",
        quiz: {
            questions: [
                {
                    question: "Trunk port nima uchun ishlatiladi?",
                    options: ["Faqat bitta VLAN", "Bir nechta VLAN trafigini o'tkazish", "Internet", "Printer"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 8: Inter-VLAN Routing",
            description: "Router-on-a-Stick configuration and Trunk optimization.",
            downloadLink: "assignment/assignment8"
        }
    },
    {
        id: 9,
        title: "Static & Dynamic Routing Protocols",
        description: "Configuring OSPF and Static routing for robust multi-branch connectivity.",
        thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
        duration: "25:30",
        level: "Professional",
        videoUrl: "video/video_dars9.mp4",
        quiz: {
            questions: [
                {
                    question: "OSPF qanday turdagi protokol?",
                    options: ["Distance Vector", "Link-State", "Hybrid", "Static"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 9: OSPF Large Scale Implementation",
            description: "Configuring multi-area OSPF for a regional network.",
            downloadLink: "assignment/assignment9"
        }
    },
    {
        id: 10,
        title: "Network Services: DHCP & DNS",
        description: "Deploying enterprise-grade DHCP and DNS services for automated node management.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600",
        duration: "17:45",
        level: "Intermediate",
        videoUrl: "video/video_dars10.mp4",
        quiz: {
            questions: [
                {
                    question: "DHCP protokoli nima qiladi?",
                    options: ["IP manzillarni avtomatik tarqatadi", "Nomlarni o'zgartiradi", "Fayl yuboradi", "Xavfsizlik"],
                    correct: 0
                }
            ]
        },
        labWork: {
            title: "Lab 10: Server Side Services",
            description: "Setting up DHCP scopes and DNS authoritative zones.",
            downloadLink: "assignment/assignment10"
        }
    },
    {
        id: 11,
        title: "Corporate Wireless Infrastructure",
        description: "Building secure, roaming-capable WPA3 Wi-Fi zones for enterprise users.",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
        duration: "20:15",
        level: "Intermediate",
        videoUrl: "video/video_dars11.mp4",
        quiz: {
            questions: [
                {
                    question: "SSID nima?",
                    options: ["Router", "Wi-Fi nomi", "Parol", "Shifrlash"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 11: Enterprise WLAN Security",
            description: "Configuring RADIUS authentication for Corporate Wi-Fi.",
            downloadLink: "assignment/assignment11"
        }
    },
    {
        id: 12,
        title: "Perimeter Security: Firewalls & ACLs",
        description: "Implementing Access Control Lists and Firewall policies for threat mitigation.",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
        duration: "23:50",
        level: "Expert",
        videoUrl: "video/video_dars12.mp4",
        quiz: {
            questions: [
                {
                    question: "ACL (Access Control List) nima?",
                    options: ["Ruxsat berilgan va taqiqlangan qoidalar", "Userlar ro'yxati", "IP ro'yxati", "Parol"],
                    correct: 0
                }
            ]
        },
        labWork: {
            title: "Lab 12: Firewall Rule Management",
            description: "Writing complex Extended ACLs on Perimeter routers.",
            downloadLink: "assignment/assignment12"
        }
    },
    {
        id: 13,
        title: "Network Monitoring: Zabbix & PRTG",
        description: "Proactive monitoring and health reporting using SNMP and custom dashboards.",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
        duration: "18:20",
        level: "Professional",
        videoUrl: "video/video_dars13.mp4",
        quiz: {
            questions: [
                {
                    question: "SNMP (Simple Network Management Protocol) nima?",
                    options: ["Monitoring protokoli", "Pochta", "Fayl", "Routing"],
                    correct: 0
                }
            ]
        },
        labWork: {
            title: "Lab 13: Zabbix Node Configuration",
            description: "Setting up custom triggers and maps in Zabbix.",
            downloadLink: "assignment/assignment13"
        }
    },
    {
        id: 14,
        title: "Advanced Simulation: Packet Tracer GNS3",
        description: "Final full-scale simulation of the entire corporate project architecture.",
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=600",
        duration: "30:00",
        level: "Professional",
        videoUrl: "video/video_dars14.mp4",
        quiz: {
            questions: [
                {
                    question: "Cisco Packet Tracer nima?",
                    options: ["Tarmoq simulyatsiyasi", "Haqiqiy router", "Kabel tester", "Antivirus"],
                    correct: 0
                }
            ]
        },
        labWork: {
            title: "Lab 14: Final Topology Build",
            description: "Integrating all L2/L3 and service features into one master file.",
            downloadLink: "assignment/assignment14"
        }
    },
    {
        id: 15,
        title: "Technical Documentation & Deployment",
        description: "Finalizing Visio schemas and handover documentation (Net Passport).",
        thumbnail: "https://images.unsplash.com/photo-1551703599-6b3e8379aa8b?auto=format&fit=crop&q=80&w=600",
        duration: "15:10",
        level: "Professional",
        videoUrl: "video/video_dars15.mp4",
        quiz: {
            questions: [
                {
                    question: "Loyihani topshirishda nimalar bo'lishi kerak?",
                    options: ["Faqat kabel", "Hujjatlar, sxemalar, parollar", "Router", "Kalit"],
                    correct: 1
                }
            ]
        },
        labWork: {
            title: "Lab 15: Network Passport Finalization",
            description: "Preparing a professional deployment guide.",
            downloadLink: "assignment/assignment15"
        }
    }
];
