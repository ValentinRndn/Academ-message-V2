import { ref } from 'vue'

interface TeacherProfile {
  _id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  bio: string
  avatar: string
  subjects: any[]
  availability: any[]
  hourlyRate: number
  languages: string[]
  experience: number
  averageRating: number
  reviewCount: number
  status: string
  isAvailableNow?: boolean
  createdAt: string
  updatedAt: string
}

export const useTeacherProfile = () => {
  const profile = ref<TeacherProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer le profil du professeur connecté
  const fetchMyProfile = async () => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/teachers/my-profile', {
        credentials: 'include'
      })

      if (response && response.teacher) {
        profile.value = response.teacher
        return response.teacher
      }

      throw new Error('Profil non trouvé')
    } catch (err: any) {
      console.error('Error fetching teacher profile:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de la récupération du profil'
      return null
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour le profil du professeur
  const updateMyProfile = async (updateData: Partial<TeacherProfile>) => {
    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/teachers/my-profile', {
        method: 'PUT',
        body: updateData,
        credentials: 'include'
      })

      if (response && response.teacher) {
        profile.value = response.teacher
        return response.teacher
      }

      throw new Error('Erreur lors de la mise à jour')
    } catch (err: any) {
      console.error('Error updating teacher profile:', err)
      error.value = err.data?.message || err.message || 'Erreur lors de la mise à jour du profil'
      return null
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour la disponibilité
  const updateAvailability = async (availability: any[]) => {
    return updateMyProfile({ availability })
  }

  // Mettre à jour les matières enseignées
  const updateSubjects = async (subjects: string[]) => {
    return updateMyProfile({ subjects })
  }

  // Mettre à jour le tarif horaire
  const updateHourlyRate = async (hourlyRate: number) => {
    return updateMyProfile({ hourlyRate })
  }

  // Mettre à jour la biographie
  const updateBio = async (bio: string) => {
    return updateMyProfile({ bio })
  }

  // Mettre à jour l'avatar
  const updateAvatar = async (avatar: string) => {
    return updateMyProfile({ avatar })
  }

  // Réinitialiser l'état
  const resetState = () => {
    profile.value = null
    loading.value = false
    error.value = null
  }

  return {
    // État
    profile,
    loading,
    error,

    // Actions
    fetchMyProfile,
    updateMyProfile,
    updateAvailability,
    updateSubjects,
    updateHourlyRate,
    updateBio,
    updateAvatar,
    resetState
  }
}
