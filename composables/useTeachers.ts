import { ref, computed, reactive } from 'vue'

interface Subject {
  id: string
  name: string
}

interface Availability {
  id: string
  teacherId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  recurring: boolean
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

interface TeachersResponse {
  teachers: Teacher[]
  totalCount: number
  page: number
  limit: number
}

export const useTeachers = () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  
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
  })
  
  // Sujets disponibles
  const subjects = ref<Subject[]>([])
  
  // Récupérer tous les enseignants avec filtres
  const fetchTeachers = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Construire les paramètres de requête
      const params: any = {};
      
      if (filters.query) {
        params.search = filters.query;
      }
      
      if (filters.subject) {
        params.subject = filters.subject;
      }
      
      params.page = filters.page.toString();
      params.limit = filters.limit.toString();
      
      const data: TeachersResponse = await $fetch('/api/teachers', { query: params })
      
      teachers.value = data.teachers
      totalCount.value = data.totalCount
      
      // Ajouter des propriétés pour la compatibilité avec le code existant
      teachers.value = teachers.value.map(teacher => ({
        ...teacher,
        languages: teacher.languages || ['french', 'english'],
        experience: teacher.experience || Math.floor(Math.random() * 10) + 1
      }))
      
      return data
    } catch (err: any) {
      console.error('Error fetching teachers:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Récupérer un enseignant par ID
  const fetchTeacherById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      
      const data = await $fetch(`/api/teachers/${id}`)
      return data
    } catch (err: any) {
      console.error(`Error fetching teacher ${id}:`, err)
      error.value = err.data?.message || err.message
      return null
    } finally {
      loading.value = false
    }
  }
  
  // Récupérer tous les sujets
  const fetchSubjects = async () => {
    try {
      const data = await $fetch('/api/subjects')
      subjects.value = data.subjects
      return data.subjects
    } catch (err: any) {
      console.error('Error fetching subjects:', err)
      return []
    }
  }
  
  // Appliquer les filtres et récupérer les résultats
  const applyFilters = async () => {
    filters.page = 1
    return fetchTeachers()
  }
  
  // Réinitialiser tous les filtres
  const clearFilters = () => {
    filters.query = ''
    filters.subject = ''
    filters.minRating = 0
    filters.priceRange = ''
    filters.language = ''
    filters.experienceLevel = ''
    filters.availability.weekdays = false
    filters.availability.weekends = false
    filters.availability.evenings = false
    filters.page = 1
    
    return fetchTeachers()
  }
  
  // Filtrer les enseignants côté client pour les filtres non supportés par l'API
  const filteredTeachers = computed(() => {
    let result = [...teachers.value]
    
    // Filtre de notation minimale
    if (filters.minRating > 0) {
      result = result.filter(teacher => (teacher.averageRating || 0) >= filters.minRating)
    }
    
    // Filtre de prix
    if (filters.priceRange) {
      result = result.filter(teacher => {
        const rate = teacher.hourlyRate
        if (filters.priceRange === 'low') return rate >= 25 && rate <= 40
        if (filters.priceRange === 'medium') return rate > 40 && rate <= 60
        if (filters.priceRange === 'high') return rate > 60
        return true
      })
    }
    
    // Filtre de langue
    if (filters.language && filters.language !== '') {
      result = result.filter(teacher => {
        return teacher.languages?.includes(filters.language)
      })
    }
    
    // Filtre d'expérience
    if (filters.experienceLevel) {
      result = result.filter(teacher => {
        const experience = teacher.experience || 0
        if (filters.experienceLevel === 'beginner') return experience >= 1 && experience <= 3
        if (filters.experienceLevel === 'intermediate') return experience >= 4 && experience <= 7
        if (filters.experienceLevel === 'expert') return experience >= 8
        return true
      })
    }
    
    // Filtre de disponibilité
    const hasAvailabilityFilters = 
      filters.availability.weekdays || 
      filters.availability.weekends || 
      filters.availability.evenings
      
    if (hasAvailabilityFilters) {
      result = result.filter(teacher => {
        if (!teacher.availability || teacher.availability.length === 0) return false
        
        if (filters.availability.weekdays) {
          const hasWeekdays = teacher.availability.some(a => a.dayOfWeek >= 1 && a.dayOfWeek <= 5)
          if (!hasWeekdays) return false
        }
        
        if (filters.availability.weekends) {
          const hasWeekends = teacher.availability.some(a => a.dayOfWeek === 0 || a.dayOfWeek === 6)
          if (!hasWeekends) return false
        }
        
        if (filters.availability.evenings) {
          const hasEvenings = teacher.availability.some(a => {
            const endTime = new Date(`2000-01-01T${a.endTime}`)
            const eveningStart = new Date(`2000-01-01T17:00:00`)
            return endTime >= eveningStart
          })
          if (!hasEvenings) return false
        }
        
        return true
      })
    }
    
    return result
  })
  
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
  }
}