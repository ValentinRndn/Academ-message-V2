<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Reviews</h1>
        <p class="mt-2 text-gray-600">
          View and manage reviews from your students.
        </p>
      </div>

      <!-- Review statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Average Rating</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.averageRating }}/5</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Reviews</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalReviews }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-300 rounded-lg flex items-center justify-center"
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">5 stars</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.fiveStars }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avec commentaires</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.withComments }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Rating distribution -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div class="space-y-3">
          <div v-for="rating in ratingDistribution" :key="rating.stars" class="flex items-center">
            <div class="flex items-center w-16">
              <span class="text-sm font-medium text-gray-700">{{ rating.stars }} stars</span>
            </div>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-purple-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${rating.percentage}%` }"
                ></div>
              </div>
            </div>
            <div class="w-12 text-right">
              <span class="text-sm text-gray-600">{{ rating.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search reviews..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          <select v-model="ratingFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="all">Toutes les notes</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
          
          <select v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="date">Most recent</option>
            <option value="rating">Rating</option>
            <option value="student">Étudiant</option>
          </select>
          
          <!-- <button 
            @click="exportReviews"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Exporter
          </button> -->
        </div>
      </div>

      <!-- Reviews list -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">All Reviews</h2>
        </div>

        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading reviews...</p>
        </div>

        <div v-else-if="filteredReviews.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p class="mt-2 text-gray-500">No reviews found</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div 
            v-for="review in filteredReviews" 
            :key="review._id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start space-x-4">
              <!-- Avatar de l'étudiant -->
              <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span class="text-purple-600 font-semibold text-lg">
                  {{ review.studentName.charAt(0) }}
                </span>
              </div>

              <!-- Review content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-medium text-gray-900">{{ review.studentName }}</h3>
                    <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  
                  <!-- Rating -->
                  <div class="flex items-center space-x-1">
                    <div class="flex">
                      <svg 
                        v-for="star in 5" 
                        :key="star"
                        :class="[
                          'w-5 h-5',
                          star <= review.rating ? 'text-purple-400' : 'text-gray-300'
                        ]"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span class="text-sm font-medium text-gray-900 ml-1">{{ review.rating }}/5</span>
                  </div>
                </div>

                <!-- Informations du cours -->
                <div class="text-sm text-gray-500 mb-3">
                  <span class="font-medium">{{ review.subject }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ formatDate(review.courseDate) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ review.duration }}h</span>
                </div>

                <!-- Commentaire -->
                <div v-if="review.comment" class="text-gray-700 mb-3">
                  <p class="text-sm leading-relaxed">{{ review.comment }}</p>
                </div>

                <!-- Tags -->
                <div v-if="review.tags && review.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
                  <span 
                    v-for="tag in review.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="flex items-center space-x-4">
                  <button 
                    @click="replyToReview(review)"
                    class="text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Reply
                  </button>
                  <button 
                    @click="viewStudentProfile(review.studentId)"
                    class="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Voir le profil
                  </button>
                  <button 
                    v-if="review.reply"
                    @click="viewReply(review)"
                    class="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Voir ma réponse
                  </button>
                </div>

                <!-- Réponse du professeur -->
                <div v-if="review.reply" class="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div class="flex items-start space-x-2">
                    <svg class="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-sm text-purple-800 font-medium mb-1">Your response:</p>
                      <p class="text-sm text-purple-700">{{ review.reply }}</p>
                      <p class="text-xs text-purple-600 mt-2">{{ formatDate(review.replyDate) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalReviews) }} of {{ totalReviews }} reviews
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            @click="previousPage"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Previous
          </button>
          
          <div class="flex items-center space-x-1">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                page === currentPage 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Récupérer l'utilisateur
const { user } = useAuth();

// État réactif
const loading = ref(false);
const reviews = ref([]);
const searchQuery = ref('');
const ratingFilter = ref('all');
const sortBy = ref('date');
const currentPage = ref(1);
const pageSize = ref(10);
const totalReviews = ref(0);

// Statistiques
const stats = ref({
  averageRating: 0,
  totalReviews: 0,
  fiveStars: 0,
  withComments: 0
});

// Rating distribution
const ratingDistribution = ref([
  { stars: 5, count: 0, percentage: 0 },
  { stars: 4, count: 0, percentage: 0 },
  { stars: 3, count: 0, percentage: 0 },
  { stars: 2, count: 0, percentage: 0 },
  { stars: 1, count: 0, percentage: 0 }
]);

// Computed properties
const filteredReviews = computed(() => {
  return reviews.value;
});

const totalPages = computed(() => {
  return Math.ceil(totalReviews.value / pageSize.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Méthodes
const loadReviews = async () => {
  try {
    loading.value = true;
    
    // Construire les paramètres de requête
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString(),
      sort: sortBy.value
    });
    
    if (ratingFilter.value !== 'all') params.append('rating', ratingFilter.value);
    if (searchQuery.value) params.append('search', searchQuery.value);
    
    const response = await $fetch(`/api/teachers/reviews?${params.toString()}`, {
      credentials: 'include'
    });
    
    reviews.value = response.reviews || [];
    totalReviews.value = response.total || 0;
    stats.value = response.stats || {
      averageRating: 0,
      totalReviews: 0,
      fiveStars: 0,
      withComments: 0
    };
    ratingDistribution.value = response.ratingDistribution || [];

  } catch (error) {
    console.error('Error loading reviews:', error);
    reviews.value = [];
    totalReviews.value = 0;
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const replyToReview = (review) => {
  // TODO: Implement review response
  console.log('Reply to review:', review);
};

const viewStudentProfile = (studentId) => {
  navigateTo(`/teacher/students/${studentId}`);
};

const viewReply = (review) => {
  // TODO: Afficher la réponse en modal
  console.log('Voir la réponse:', review.reply);
};

const exportReviews = () => {
  // TODO: Export reviews
  console.log('Export reviews');
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadReviews();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadReviews();
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  loadReviews();
};

// Recharger les données quand les filtres changent
watch([searchQuery, ratingFilter, sortBy], () => {
  currentPage.value = 1;
  loadReviews();
}, { debounce: 300 });

// Lifecycle
onMounted(() => {
  loadReviews();
});
</script>
