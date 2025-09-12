import { ref, computed, reactive } from 'vue'

interface Subject {
  id: string
  name: string
}

interface Availability {
  id?: string
  teacherId?: string
  dayOfWeek: number
  startTime: string
  endTime: string
  recurring?: boolean
  date?: string
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
  email?: string
  bio: string
  avatar: string
  subjects: Subject[]
  availability: Availability[]
  isAvailableNow: boolean
  averageRating: number | null
  reviewCount: number
  sessionsCompleted: number
  hourlyRate: number
  languages?: string[]
  experience?: number
}

export const useMockTeachers = () => {
  const teachers = ref<Teacher[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      bio: 'I am a dedicated mathematics teacher with over 10 years of experience. I specialize in calculus, algebra, and statistics. My approach to teaching is student-centered, focusing on building strong foundations and problem-solving skills.',
      subjects: [
        { id: 'math', name: 'Mathematics' },
        { id: 'calc', name: 'Calculus' },
        { id: 'alg', name: 'Algebra' }
      ],
      averageRating: 4.8,
      reviewCount: 32,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      hourlyRate: 50,
      isAvailableNow: true,
      experience: 10,
      languages: ['english', 'spanish'],
      sessionsCompleted: 124,
      availability: [
        { dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 3, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 5, startTime: '13:00:00', endTime: '18:00:00' }
      ]
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      bio: 'Physics teacher specializing in mechanics and electromagnetism. I have a PhD in Physics and have been teaching for 7 years. I believe in making complex concepts intuitive and relatable through real-world examples.',
      subjects: [
        { id: 'phys', name: 'Physics' },
        { id: 'mech', name: 'Mechanics' },
        { id: 'elec', name: 'Electromagnetism' }
      ],
      averageRating: 4.9,
      reviewCount: 27,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      hourlyRate: 55,
      isAvailableNow: false,
      experience: 7,
      languages: ['english', 'french'],
      sessionsCompleted: 89,
      availability: [
        { dayOfWeek: 2, startTime: '10:00:00', endTime: '18:00:00' },
        { dayOfWeek: 4, startTime: '10:00:00', endTime: '18:00:00' },
        { dayOfWeek: 6, startTime: '12:00:00', endTime: '16:00:00' }
      ]
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      bio: 'Computer Science teacher with expertise in programming, algorithms, and data structures. I have a background in software development and have been teaching for 5 years. I focus on practical skills that prepare students for real-world challenges.',
      subjects: [
        { id: 'cs', name: 'Computer Science' },
        { id: 'prog', name: 'Programming' },
        { id: 'algo', name: 'Algorithms' },
        { id: 'data', name: 'Data Structures' }
      ],
      averageRating: 4.7,
      reviewCount: 19,
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      hourlyRate: 60,
      isAvailableNow: true,
      experience: 5,
      languages: ['english', 'german'],
      sessionsCompleted: 67,
      availability: [
        { dayOfWeek: 1, startTime: '13:00:00', endTime: '20:00:00' },
        { dayOfWeek: 3, startTime: '13:00:00', endTime: '20:00:00' },
        { dayOfWeek: 5, startTime: '13:00:00', endTime: '20:00:00' }
      ]
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      bio: 'Chemistry teacher specializing in organic chemistry and biochemistry. I have a Masters in Chemistry and 8 years of teaching experience. My goal is to make chemistry accessible and interesting for all students.',
      subjects: [
        { id: 'chem', name: 'Chemistry' },
        { id: 'org', name: 'Organic Chemistry' },
        { id: 'bio', name: 'Biochemistry' }
      ],
      averageRating: 4.6,
      reviewCount: 24,
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      hourlyRate: 45,
      isAvailableNow: false,
      experience: 8,
      languages: ['english'],
      sessionsCompleted: 103,
      availability: [
        { dayOfWeek: 2, startTime: '09:00:00', endTime: '15:00:00' },
        { dayOfWeek: 4, startTime: '09:00:00', endTime: '15:00:00' },
        { dayOfWeek: 0, startTime: '10:00:00', endTime: '14:00:00' }
      ]
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@example.com',
      bio: 'English teacher with a focus on literature, writing, and grammar. I have a background in journalism and have been teaching for 12 years. I help students develop their critical thinking and communication skills through analyzing and creating texts.',
      subjects: [
        { id: 'eng', name: 'English' },
        { id: 'lit', name: 'Literature' },
        { id: 'writ', name: 'Writing' }
      ],
      averageRating: 4.5,
      reviewCount: 31,
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      hourlyRate: 40,
      isAvailableNow: true,
      experience: 12,
      languages: ['english', 'spanish'],
      sessionsCompleted: 156,
      availability: [
        { dayOfWeek: 1, startTime: '10:00:00', endTime: '16:00:00' },
        { dayOfWeek: 3, startTime: '10:00:00', endTime: '16:00:00' },
        { dayOfWeek: 5, startTime: '10:00:00', endTime: '16:00:00' }
      ]
    },
    {
      id: '6',
      firstName: 'Jennifer',
      lastName: 'Lee',
      email: 'jennifer.lee@example.com',
      bio: 'Biology teacher specializing in genetics, ecology, and human biology. I have a PhD in Biology and have been teaching for 6 years. I use interactive methods and visual aids to make complex biological concepts easier to understand.',
      subjects: [
        { id: 'bio', name: 'Biology' },
        { id: 'gen', name: 'Genetics' },
        { id: 'eco', name: 'Ecology' }
      ],
      averageRating: 4.9,
      reviewCount: 18,
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      hourlyRate: 55,
      isAvailableNow: false,
      experience: 6,
      languages: ['english', 'mandarin'],
      sessionsCompleted: 72,
      availability: [
        { dayOfWeek: 2, startTime: '13:00:00', endTime: '19:00:00' },
        { dayOfWeek: 4, startTime: '13:00:00', endTime: '19:00:00' },
        { dayOfWeek: 6, startTime: '10:00:00', endTime: '15:00:00' }
      ]
    },
    {
      id: '7',
      firstName: 'David',
      lastName: 'Taylor',
      email: 'david.taylor@example.com',
      bio: 'History teacher with expertise in world history, European history, and historical analysis. I have a Masters in History and have been teaching for 9 years. I help students understand historical contexts and develop critical thinking about historical events.',
      subjects: [
        { id: 'hist', name: 'History' },
        { id: 'world', name: 'World History' },
        { id: 'euro', name: 'European History' }
      ],
      averageRating: 4.7,
      reviewCount: 23,
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      hourlyRate: 45,
      isAvailableNow: true,
      experience: 9,
      languages: ['english', 'french'],
      sessionsCompleted: 112,
      availability: [
        { dayOfWeek: 1, startTime: '09:00:00', endTime: '15:00:00' },
        { dayOfWeek: 3, startTime: '09:00:00', endTime: '15:00:00' },
        { dayOfWeek: 5, startTime: '09:00:00', endTime: '15:00:00' }
      ]
    },
    {
      id: '8',
      firstName: 'Lisa',
      lastName: 'Miller',
      email: 'lisa.miller@example.com',
      bio: 'Economics teacher with a background in finance and business. I have a Masters in Economics and 7 years of teaching experience. I focus on making economic theories relevant through real-world applications and current events.',
      subjects: [
        { id: 'econ', name: 'Economics' },
        { id: 'fin', name: 'Finance' },
        { id: 'bus', name: 'Business Studies' }
      ],
      averageRating: 4.8,
      reviewCount: 21,
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      hourlyRate: 60,
      isAvailableNow: false,
      experience: 7,
      languages: ['english'],
      sessionsCompleted: 85,
      availability: [
        { dayOfWeek: 2, startTime: '10:00:00', endTime: '18:00:00' },
        { dayOfWeek: 4, startTime: '10:00:00', endTime: '18:00:00' },
        { dayOfWeek: 0, startTime: '12:00:00', endTime: '16:00:00' }
      ]
    },
    {
      id: '9',
      firstName: 'James',
      lastName: 'Anderson',
      email: 'james.anderson@example.com',
      bio: 'Geography teacher specializing in physical geography, human geography, and GIS. I have a PhD in Geography and have been teaching for 11 years. I use maps, data visualization, and field studies to bring geographical concepts to life.',
      subjects: [
        { id: 'geog', name: 'Geography' },
        { id: 'phys', name: 'Physical Geography' },
        { id: 'hum', name: 'Human Geography' }
      ],
      averageRating: 4.6,
      reviewCount: 19,
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      hourlyRate: 50,
      isAvailableNow: true,
      experience: 11,
      languages: ['english', 'german'],
      sessionsCompleted: 127,
      availability: [
        { dayOfWeek: 1, startTime: '12:00:00', endTime: '20:00:00' },
        { dayOfWeek: 3, startTime: '12:00:00', endTime: '20:00:00' },
        { dayOfWeek: 6, startTime: '09:00:00', endTime: '15:00:00' }
      ]
    },
    {
      id: '10',
      firstName: 'Michelle',
      lastName: 'Thomas',
      email: 'michelle.thomas@example.com',
      bio: 'Psychology teacher with expertise in cognitive psychology, developmental psychology, and research methods. I have a Masters in Psychology and have been teaching for 8 years. I help students understand human behavior through theory and practical examples.',
      subjects: [
        { id: 'psych', name: 'Psychology' },
        { id: 'cog', name: 'Cognitive Psychology' },
        { id: 'dev', name: 'Developmental Psychology' }
      ],
      averageRating: 4.9,
      reviewCount: 25,
      avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
      hourlyRate: 55,
      isAvailableNow: false,
      experience: 8,
      languages: ['english', 'french'],
      sessionsCompleted: 96,
      availability: [
        { dayOfWeek: 2, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 4, startTime: '09:00:00', endTime: '17:00:00' },
        { dayOfWeek: 0, startTime: '10:00:00', endTime: '14:00:00' }
      ]
    },
    {
      id: '11',
      firstName: 'Richard',
      lastName: 'Clark',
      email: 'richard.clark@example.com',
      bio: 'Art teacher specializing in drawing, painting, and art history. I have a BFA in Fine Arts and have been teaching for a decade. I help students develop their artistic skills and express their creativity while understanding the context and theory behind art.',
      subjects: [
        { id: 'art', name: 'Art' },
        { id: 'draw', name: 'Drawing' },
        { id: 'paint', name: 'Painting' }
      ],
      averageRating: 4.7,
      reviewCount: 22,
      avatar: 'https://randomuser.me/api/portraits/men/91.jpg',
      hourlyRate: 45,
      isAvailableNow: true,
      experience: 10,
      languages: ['english', 'italian'],
      sessionsCompleted: 118,
      availability: [
        { dayOfWeek: 2, startTime: '13:00:00', endTime: '19:00:00' },
        { dayOfWeek: 4, startTime: '13:00:00', endTime: '19:00:00' },
        { dayOfWeek: 6, startTime: '10:00:00', endTime: '16:00:00' }
      ]
    },
    {
      id: '12',
      firstName: 'Patricia',
      lastName: 'Walker',
      email: 'patricia.walker@example.com',
      bio: 'Music teacher with expertise in piano, music theory, and composition. I have a Masters in Music and have been teaching for 15 years. I help students develop their musical skills while fostering a deep appreciation for different musical genres and traditions.',
      subjects: [
        { id: 'music', name: 'Music' },
        { id: 'piano', name: 'Piano' },
        { id: 'theory', name: 'Music Theory' }
      ],
      averageRating: 4.8,
      reviewCount: 30,
      avatar: 'https://randomuser.me/api/portraits/women/76.jpg',
      hourlyRate: 50,
      isAvailableNow: false,
      experience: 15,
      languages: ['english', 'spanish'],
      sessionsCompleted: 172,
      availability: [
        { dayOfWeek: 1, startTime: '14:00:00', endTime: '20:00:00' },
        { dayOfWeek: 3, startTime: '14:00:00', endTime: '20:00:00' },
        { dayOfWeek: 5, startTime: '14:00:00', endTime: '20:00:00' }
      ]
    }
  ]);
  
  const subjects = ref<Subject[]>([
    { id: 'math', name: 'Mathematics' },
    { id: 'phys', name: 'Physics' },
    { id: 'chem', name: 'Chemistry' },
    { id: 'bio', name: 'Biology' },
    { id: 'cs', name: 'Computer Science' },
    { id: 'eng', name: 'English' },
    { id: 'hist', name: 'History' },
    { id: 'geog', name: 'Geography' },
    { id: 'econ', name: 'Economics' },
    { id: 'psych', name: 'Psychology' },
    { id: 'art', name: 'Art' },
    { id: 'music', name: 'Music' }
  ]);
  
  const loading = ref(false);
  const error = ref<string | null>(null);
  const totalCount = ref(teachers.value.length);
  
  // Filtres
  const filters = reactive({
    query: '',
    subject: '',
    minRating: 0,
    priceRange: '',
    language: '',
    experienceLevel: '',
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false
    },
    page: 1,
    limit: 20
  });
  
  // Filtrer les enseignants en fonction des critères
  const filteredTeachers = computed(() => {
    let result = [...teachers.value];
    
    // Recherche textuelle
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(teacher => {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
        const hasNameMatch = fullName.includes(query);
        const hasSubjectMatch = teacher.subjects.some(subject => subject.name.toLowerCase().includes(query));
        const hasBioMatch = teacher.bio && teacher.bio.toLowerCase().includes(query);
        return hasNameMatch || hasSubjectMatch || hasBioMatch;
      });
    }
    
    // Filtre par matière
    if (filters.subject) {
      result = result.filter(teacher => 
        teacher.subjects.some(subject => subject.id === filters.subject)
      );
    }
    
    // Filtre par note minimale
    if (filters.minRating > 0) {
      result = result.filter(teacher => (teacher.averageRating || 0) >= filters.minRating);
    }
    
    // Filtre par prix
    if (filters.priceRange) {
      result = result.filter(teacher => {
        const rate = teacher.hourlyRate;
        if (filters.priceRange === 'low') return rate >= 25 && rate <= 40;
        if (filters.priceRange === 'medium') return rate > 40 && rate <= 60;
        if (filters.priceRange === 'high') return rate > 60;
        return true;
      });
    }
    
    // Filtre par langue
    if (filters.language && filters.language !== '') {
      result = result.filter(teacher => {
        return teacher.languages?.includes(filters.language);
      });
    }
    
    // Filtre par expérience
    if (filters.experienceLevel) {
      result = result.filter(teacher => {
        const experience = teacher.experience || 0;
        if (filters.experienceLevel === 'beginner') return experience >= 1 && experience <= 3;
        if (filters.experienceLevel === 'intermediate') return experience >= 4 && experience <= 7;
        if (filters.experienceLevel === 'expert') return experience >= 8;
        return true;
      });
    }
    
    // Filtre par disponibilité
    const hasAvailabilityFilters = 
      filters.availability.weekdays || 
      filters.availability.weekends || 
      filters.availability.evenings;
      
    if (hasAvailabilityFilters) {
      result = result.filter(teacher => {
        if (!teacher.availability || teacher.availability.length === 0) return false;
        
        if (filters.availability.weekdays) {
          const hasWeekdays = teacher.availability.some(a => a.dayOfWeek >= 1 && a.dayOfWeek <= 5);
          if (!hasWeekdays) return false;
        }
        
        if (filters.availability.weekends) {
          const hasWeekends = teacher.availability.some(a => a.dayOfWeek === 0 || a.dayOfWeek === 6);
          if (!hasWeekends) return false;
        }
        
        if (filters.availability.evenings) {
          const hasEvenings = teacher.availability.some(a => {
            const endTimeParts = a.endTime.split(':').map(Number);
            return endTimeParts[0] >= 17; // 17h00 ou plus tard
          });
          if (!hasEvenings) return false;
        }
        
        return true;
      });
    }
    
    totalCount.value = result.length;
    
    // Pagination
    const start = (filters.page - 1) * filters.limit;
    const end = start + filters.limit;
    
    return result.slice(start, end);
  });
  
  // Simuler le chargement des enseignants
  const fetchTeachers = async () => {
    loading.value = true;
    
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Pas besoin de faire quoi que ce soit, les données sont déjà chargées
      return {
        teachers: filteredTeachers.value,
        totalCount: totalCount.value,
        page: filters.page,
        limit: filters.limit
      };
    } catch (err: any) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // Simuler la récupération d'un enseignant par ID
  const fetchTeacherById = async (id: string) => {
    loading.value = true;
    
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const teacher = teachers.value.find(t => t.id === id);
      
      if (!teacher) {
        throw new Error('Enseignant non trouvé');
      }
      
      return teacher;
    } catch (err: any) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  // Simuler la récupération des matières
  const fetchSubjects = async () => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return subjects.value;
    } catch (err: any) {
      return [];
    }
  };
  
  // Appliquer les filtres
  const applyFilters = async () => {
    filters.page = 1;
    return fetchTeachers();
  };
  
  // Réinitialiser les filtres
  const clearFilters = async () => {
    filters.query = '';
    filters.subject = '';
    filters.minRating = 0;
    filters.priceRange = '';
    filters.language = '';
    filters.experienceLevel = '';
    filters.availability.weekdays = false;
    filters.availability.weekends = false;
    filters.availability.evenings = false;
    filters.page = 1;
    
    return fetchTeachers();
  };
  
  return {
    teachers,
    filteredTeachers,
    loading,
    error,
    totalCount,
    filters,
    subjects,
    fetchTeachers,
    fetchTeacherById,
    fetchSubjects,
    applyFilters,
    clearFilters
  };
}