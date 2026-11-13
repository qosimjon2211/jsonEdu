
export const INITIAL_DATA = {
  students: [
    {
      id: 1,
      fullName: "Ali Valiyev",
      email: "ali@gmail.com",
      phone: "+998901112233",
      age: 19,
      groupId: 1,
      status: "active"
    },
    {
      id: 2,
      fullName: "Vali Karimov",
      email: "vali@gmail.com",
      phone: "+998902223344",
      age: 21,
      groupId: 2,
      status: "active"
    },
    {
      id: 3,
      fullName: "Sardor Aliyev",
      email: "sardor@gmail.com",
      phone: "+998903334455",
      age: 20,
      groupId: 1,
      status: "inactive"
    },
    {
      id: 4,
      fullName: "Madina Xasanova",
      email: "madina@gmail.com",
      phone: "+998904445566",
      age: 18,
      groupId: 3,
      status: "active"
    },
    {
      id: 5,
      fullName: "Jasur Rahimov",
      email: "jasur@gmail.com",
      phone: "+998905556677",
      age: 22,
      groupId: 2,
      status: "active"
    }
  ],
  mentors: [
    {
      id: 1,
      fullName: "Akmal Mordayev",
      email: "akmal@gmail.com",
      specialty: "Frontend Developer",
      experience: 4,
      phone: "+998901234567"
    },
    {
      id: 2,
      fullName: "Sardor Ergashev",
      email: "sardor.mentor@gmail.com",
      specialty: "Backend Developer",
      experience: 5,
      phone: "+998902345678"
    },
    {
      id: 3,
      fullName: "Madina Karimova",
      email: "madina.mentor@gmail.com",
      specialty: "UI/UX Designer",
      experience: 3,
      phone: "+998903456789"
    }
  ],
  courses: [
    {
      id: 1,
      title: "Frontend Development",
      description: "HTML, CSS, JavaScript va React",
      duration: "6 months",
      price: 800000,
      level: "beginner",
      mentorId: 1
    },
    {
      id: 2,
      title: "Backend Development",
      description: "Node.js, Express.js va MongoDB",
      duration: "5 months",
      price: 1000000,
      level: "intermediate",
      mentorId: 2
    },
    {
      id: 3,
      title: "UI/UX Design",
      description: "Figma va User Experience",
      duration: "4 months",
      price: 700000,
      level: "beginner",
      mentorId: 3
    }
  ],
  groups: [
    {
      id: 1,
      name: "Frontend-101",
      courseId: 1,
      mentorId: 1,
      studentCount: 2,
      schedule: "Monday-Wednesday-Friday",
      time: "14:00",
      startDate: "2026-10-01",
      status: "active"
    },
    {
      id: 2,
      name: "Backend-201",
      courseId: 2,
      mentorId: 2,
      studentCount: 2,
      schedule: "Tuesday-Thursday-Saturday",
      time: "16:00",
      startDate: "2026-10-05",
      status: "active"
    },
    {
      id: 3,
      name: "Design-101",
      courseId: 3,
      mentorId: 3,
      studentCount: 1,
      schedule: "Monday-Wednesday-Friday",
      time: "10:00",
      startDate: "2026-10-10",
      status: "active"
    }
  ]
}

export const ADMIN_CREDENTIALS = {
  login: 'qosimnematjonov',
  password: '123qosim123',
  fallbackLogin: 'qosimnematjonov',
  fallbackPassword: '123qosim123',
  name: 'Qosim Nematjonov',
  role: 'Bosh Administrator',
  avatar: 'QN'
}
