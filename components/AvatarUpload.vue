<template>
  <div class="relative">
    <!-- Avatar actuel -->
    <div class="relative group">
      <img 
        :src="avatarUrl || defaultAvatar" 
        :alt="alt || 'Avatar'"
        class="w-full h-full object-cover rounded-full border-2 border-gray-200"
        :class="sizeClasses"
      />
      
      <!-- Overlay pour l'upload -->
      <div 
        v-if="!disabled"
        class="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        @click="openFileInput"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <!-- Indicateur de chargement -->
      <div 
        v-if="uploading"
        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
      >
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    </div>

    <!-- Input file caché -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Modal de prévisualisation -->
    <div 
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closePreview"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold mb-4">Prévisualisation de l'avatar</h3>
        
        <div class="flex justify-center mb-4">
          <img 
            :src="previewUrl" 
            alt="Prévisualisation"
            class="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
          />
        </div>
        
        <div class="text-sm text-gray-600 mb-4">
          <p><strong>Nom:</strong> {{ selectedFile?.name }}</p>
          <p><strong>Taille:</strong> {{ formatFileSize(selectedFile?.size) }}</p>
          <p><strong>Type:</strong> {{ selectedFile?.type }}</p>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="closePreview"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="uploadAvatar"
            :disabled="uploading"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="uploading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Upload...
            </span>
            <span v-else>Confirmer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast d'erreur -->
    <div 
      v-if="error"
      class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm"
    >
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
        <button 
          @click="error = null"
          class="ml-2 hover:text-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  avatarUrl: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  alt: {
    type: String,
    default: 'Avatar'
  }
});

// Emits
const emit = defineEmits(['update:avatarUrl', 'upload-success', 'upload-error']);

// Réfs
const fileInput = ref(null);
const uploading = ref(false);
const error = ref(null);
const showPreview = ref(false);
const selectedFile = ref(null);
const previewUrl = ref('');

// Computed
const sizeClasses = computed(() => {
  const classes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  return classes[props.size];
});

const defaultAvatar = computed(() => {
  // Générer un avatar par défaut avec les initiales
  const initials = props.alt.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  return `https://via.placeholder.com/150/3b82f6/ffffff?text=${initials}`;
});

// Méthodes
const openFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validation du type de fichier
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    showError('Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP.');
    return;
  }

  // Validation de la taille (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showError('Fichier trop volumineux. Taille maximum : 5MB.');
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  showPreview.value = true;
};

const uploadAvatar = async () => {
  if (!selectedFile.value) return;

  try {
    uploading.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append('avatar', selectedFile.value);

    const response = await $fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData
    });

    if (response.success) {
      emit('update:avatarUrl', response.avatarUrl);
      emit('upload-success', response.avatarUrl);
      closePreview();
    } else {
      throw new Error(response.message || 'Erreur lors de l\'upload');
    }
  } catch (err) {
    console.error('Erreur upload avatar:', err);
    const errorMessage = err.data?.message || err.message || 'Erreur lors de l\'upload de l\'avatar';
    showError(errorMessage);
    emit('upload-error', errorMessage);
  } finally {
    uploading.value = false;
  }
};

const closePreview = () => {
  showPreview.value = false;
  selectedFile.value = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  // Réinitialiser l'input file
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const showError = (message) => {
  error.value = message;
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Cleanup
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
