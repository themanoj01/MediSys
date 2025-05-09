export const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    ahpraNumber: "MED00012345",
    experience: 12,
    imageUrl: "https://randomuser.me/api/portraits/women/75.jpg",
    description: "Dr. Sarah Johnson is a highly experienced cardiologist with over 12 years of practice. She specializes in interventional cardiology and has performed over 1,000 successful cardiac procedures. Dr. Johnson is dedicated to providing compassionate care and is known for her excellent bedside manner.",
    availability: [
      { day: "Monday", slots: ["09:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    ahpraNumber: "MED00023456",
    experience: 15,
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    description: "Dr. Michael Chen is a board-certified neurologist with 15 years of experience in treating complex neurological disorders. He specializes in movement disorders and neurodegenerative diseases. Dr. Chen is committed to staying at the forefront of neurological research and treatments.",
    availability: [
      { day: "Tuesday", slots: ["09:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Saturday", slots: ["09:00 AM", "11:00 AM"] }
    ]
  },
  {
    id: "3",
    name: "Dr. Emily Williams",
    specialization: "Pediatrics",
    ahpraNumber: "MED00034567",
    experience: 8,
    imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    description: "Dr. Emily Williams is a dedicated pediatrician with 8 years of experience in providing comprehensive care for children from birth through adolescence. She is known for her gentle approach and ability to connect with young patients, making their healthcare experience positive and stress-free.",
    availability: [
      { day: "Monday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
      { day: "Wednesday", slots: ["09:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Friday", slots: ["10:00 AM", "1:00 PM", "3:00 PM"] }
    ]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    ahpraNumber: "MED00045678",
    experience: 20,
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    description: "Dr. James Wilson is a highly skilled orthopedic surgeon with 20 years of experience. He specializes in sports medicine and joint replacement surgeries. Dr. Wilson has helped numerous athletes recover from injuries and return to their peak performance levels.",
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Thursday", slots: ["09:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM", "12:00 PM"] }
    ]
  },
  {
    id: "5",
    name: "Dr. Lisa Rodriguez",
    specialization: "Dermatology",
    ahpraNumber: "MED00056789",
    experience: 10,
    imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    description: "Dr. Lisa Rodriguez is a board-certified dermatologist with 10 years of experience in medical, surgical, and cosmetic dermatology. She is passionate about skin health and provides personalized treatments for various skin conditions, helping patients feel confident in their appearance.",
    availability: [
      { day: "Monday", slots: ["09:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "12:00 PM", "3:00 PM"] }
    ]
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    specialization: "General Surgery",
    ahpraNumber: "MED00067890",
    experience: 18,
    imageUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    description: "Dr. Robert Kim is an experienced general surgeon with 18 years of practice. He specializes in minimally invasive surgical techniques and has performed thousands of successful surgeries. Dr. Kim is known for his precision, attention to detail, and excellent patient outcomes.",
    availability: [
      { day: "Tuesday", slots: ["08:00 AM", "11:00 AM", "2:00 PM"] },
      { day: "Wednesday", slots: ["09:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Friday", slots: ["08:00 AM", "11:00 AM", "2:00 PM"] }
    ]
  },
  {
    id: "7",
    name: "Dr. Amanda Mitchell",
    specialization: "Obstetrics & Gynecology",
    ahpraNumber: "MED00078901",
    experience: 14,
    imageUrl: "https://randomuser.me/api/portraits/women/67.jpg",
    description: "Dr. Amanda Mitchell is a compassionate OB/GYN with 14 years of experience providing comprehensive women's healthcare. She specializes in high-risk pregnancies and minimally invasive gynecological surgeries. Dr. Mitchell is committed to empowering women through education about their health.",
    availability: [
      { day: "Monday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] },
      { day: "Wednesday", slots: ["09:00 AM", "12:00 PM", "3:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:00 PM", "4:00 PM"] }
    ]
  },
  {
    id: "8",
    name: "Dr. David Lee",
    specialization: "Psychiatry",
    ahpraNumber: "MED00089012",
    experience: 16,
    imageUrl: "https://randomuser.me/api/portraits/men/76.jpg",
    description: "Dr. David Lee is a board-certified psychiatrist with 16 years of experience in treating various mental health conditions. He specializes in mood disorders and anxiety. Dr. Lee takes a holistic approach to mental health, considering biological, psychological, and social factors in his treatment plans.",
    availability: [
      { day: "Tuesday", slots: ["09:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Thursday", slots: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"] },
      { day: "Friday", slots: ["09:00 AM", "12:00 PM", "3:00 PM"] }
    ]
  }
];

export const services = [
  {
    id: "1",
    title: "Emergency Care",
    description: "24/7 emergency services with state-of-the-art equipment and experienced medical professionals to handle critical situations promptly and effectively.",
    icon: "Siren",
    features: [
      "24/7 availability",
      "Advanced life support equipment",
      "Specialized trauma care",
      "Immediate response protocol"
    ]
  },
  {
    id: "2",
    title: "Cardiology",
    description: "Comprehensive cardiac care including diagnosis, treatment, and management of heart conditions by our team of expert cardiologists using the latest technologies.",
    icon: "Heart",
    features: [
      "Advanced cardiac imaging",
      "Interventional procedures",
      "Cardiac rehabilitation",
      "Heart disease management"
    ]
  },
  {
    id: "3",
    title: "Neurology",
    description: "Specialized care for neurological disorders and conditions affecting the brain, spinal cord, and nerves, provided by our experienced neurologists.",
    icon: "Brain",
    features: [
      "Comprehensive neurological exams",
      "Advanced neurodiagnostic testing",
      "Specialized treatment plans",
      "Neurological rehabilitation"
    ]
  },
  {
    id: "4",
    title: "Pediatrics",
    description: "Child-friendly healthcare services covering preventive care, treatments, and managing various childhood diseases and conditions in a comfortable environment.",
    icon: "Baby",
    features: [
      "Child-friendly environment",
      "Preventive healthcare",
      "Developmental assessments",
      "Pediatric specialists"
    ]
  },
  {
    id: "5",
    title: "Orthopedics",
    description: "Expert care for musculoskeletal issues including fractures, joint problems, and sports injuries, with both surgical and non-surgical treatment options.",
    icon: "Bone",
    features: [
      "Sports injury treatment",
      "Joint replacement surgery",
      "Fracture management",
      "Physical therapy programs"
    ]
  },
  {
    id: "6",
    title: "Dermatology",
    description: "Comprehensive skin care services addressing various skin conditions, disorders, and cosmetic concerns using advanced dermatological treatments.",
    icon: "Shield",
    features: [
      "Skin condition diagnosis",
      "Medical dermatology",
      "Cosmetic procedures",
      "Skin cancer screenings"
    ]
  },
  {
    id: "7",
    title: "Obstetrics & Gynecology",
    description: "Complete women's healthcare services covering reproductive health, pregnancy care, and treating conditions affecting the female reproductive system.",
    icon: "Baby",
    features: [
      "Prenatal and postnatal care",
      "High-risk pregnancy management",
      "Gynecological surgeries",
      "Women's wellness exams"
    ]
  },
  {
    id: "8",
    title: "Mental Health Services",
    description: "Supportive and confidential mental health services including assessments, therapy, and treatment for various psychological and psychiatric conditions.",
    icon: "Brain",
    features: [
      "Psychological assessments",
      "Individual and group therapy",
      "Medication management",
      "Crisis intervention"
    ]
  },
  {
    id: "9",
    title: "Diagnostic Imaging",
    description: "Advanced imaging services including X-rays, MRI, CT scans, and ultrasounds to diagnose and guide treatment for various medical conditions.",
    icon: "Scan",
    features: [
      "X-ray and fluoroscopy",
      "MRI and CT scanning",
      "Ultrasound services",
      "Nuclear medicine"
    ]
  }
];

export const bookings = [
  {
    id: "1",
    date: "2023-11-15",
    time: "10:00 AM",
    doctorName: "Dr. Sarah Johnson",
    department: "Cardiology",
    status: "Confirmed"
  },
  {
    id: "2",
    date: "2023-11-16",
    time: "2:30 PM",
    doctorName: "Dr. Michael Chen",
    department: "Neurology",
    status: "Pending"
  },
  {
    id: "3",
    date: "2023-11-17",
    time: "9:15 AM",
    doctorName: "Dr. Emily Williams",
    department: "Pediatrics",
    status: "Confirmed"
  },
  {
    id: "4",
    date: "2023-11-18",
    time: "11:45 AM",
    doctorName: "Dr. James Wilson",
    department: "Orthopedics",
    status: "Scheduled"
  },
  {
    id: "5",
    date: "2023-11-19",
    time: "3:00 PM",
    doctorName: "Dr. Lisa Rodriguez",
    department: "Dermatology",
    status: "Confirmed"
  },
  {
    id: "6",
    date: "2023-11-20",
    time: "10:30 AM",
    doctorName: "Dr. Robert Kim",
    department: "General Surgery",
    status: "Pending"
  },
  {
    id: "7",
    date: "2023-11-21",
    time: "1:15 PM",
    doctorName: "Dr. Amanda Mitchell",
    department: "Obstetrics & Gynecology",
    status: "Confirmed"
  },
  {
    id: "8",
    date: "2023-11-22",
    time: "4:00 PM",
    doctorName: "Dr. David Lee",
    department: "Psychiatry",
    status: "Scheduled"
  }
];

export const faqs = [
  {
    question: "What are your hospital's visiting hours?",
    answer: "Our general visiting hours are from 10:00 AM to 8:00 PM daily. However, specific departments such as ICU, maternity ward, and pediatric units may have different visiting policies. We recommend checking with the specific department or calling our information desk for the most accurate information."
  },
  {
    question: "How do I schedule an appointment with a doctor?",
    answer: "You can schedule an appointment in several ways: through our online patient portal, by calling our appointment line at (02) 5555-1234, or in person at our reception desk. For new patients, we recommend calling ahead as you may need to complete registration forms before your first visit."
  },
  {
    question: "What insurance plans do you accept?",
    answer: "MediSys Hospital accepts most major insurance plans and Medicare. We recommend contacting your insurance provider to verify coverage details and your out-of-pocket expenses. Our billing department can also assist you with insurance questions and payment options."
  },
  {
    question: "How can I access my medical records?",
    answer: "You can access your medical records through our secure online patient portal. If you haven't registered for portal access, you'll need to complete a registration form either online or in person. For printed copies, you can submit a medical records request form to our Health Information Management department."
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "For your first appointment, please bring: a government-issued photo ID, your insurance card, a list of current medications and dosages, any relevant medical records or test results from other healthcare providers, and a list of questions or concerns you want to discuss with your doctor."
  },
  {
    question: "Do you offer telehealth services?",
    answer: "Yes, we offer telehealth services for many specialty areas. Telehealth appointments allow you to consult with our healthcare providers from the comfort of your home. To determine if your healthcare need is appropriate for telehealth, please contact your provider's office or call our general appointment line."
  },
  {
    question: "What emergency services are available at your hospital?",
    answer: "Our emergency department is open 24/7 and equipped to handle all medical emergencies. We have specialized trauma teams, advanced imaging capabilities, and critical care specialists available at all times. For life-threatening emergencies, always call 000 immediately."
  },
  {
    question: "How do I prepare for a surgical procedure?",
    answer: "Preparation varies depending on the type of surgery. Your surgeon will provide specific instructions, which may include: fasting for a certain period before surgery, adjusting medications, arranging for someone to drive you home, and following specific pre-operative hygiene protocols. Always follow your surgeon's instructions closely."
  },
  {
    question: "Do you offer payment plans for medical bills?",
    answer: "Yes, we offer flexible payment plans for patients who need assistance managing their medical expenses. Our financial counselors can work with you to develop a payment plan that fits your budget. We also provide information about financial assistance programs for qualifying patients."
  },
  {
    question: "Where can I find parking at the hospital?",
    answer: "We offer several parking options: a multi-level parking garage connected to the main hospital building, surface lots near specialty clinics, and valet parking at the main entrance. Parking rates are posted at each location, and we offer discounted weekly passes for patients receiving extended treatment."
  }
];