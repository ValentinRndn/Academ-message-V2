<template>
  <div class="relative">
    <img 
      :src="avatarUrl || defaultAvatar" 
      :alt="alt || 'Avatar'"
      class="object-cover rounded-full border-2 border-gray-200"
      :class="sizeClasses"
      @error="handleImageError"
    />
    
    <!-- Badge en ligne si fourni -->
    <div 
      v-if="online !== undefined"
      class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
      :class="online ? 'bg-green-500' : 'bg-gray-400'"
    ></div>
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
    default: 'md', // sm, md, lg, xl, 2xl
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  online: {
    type: Boolean,
    default: undefined
  }
});

// État
const imageError = ref(false);

// Computed
const sizeClasses = computed(() => {
  const classes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };
  return classes[props.size];
});

const defaultAvatar = computed(() => {
  if (imageError.value || !props.avatarUrl) {
    // Générer un avatar par défaut avec les initiales
    const initials = props.alt.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
    // Générer un avatar SVG en data URL au lieu d'utiliser via.placeholder.com
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="%233b82f6"/>
      <text x="75" y="85" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">${initials}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
  return props.avatarUrl;
});

// Méthodes
const handleImageError = () => {
  imageError.value = true;
};
</script>
