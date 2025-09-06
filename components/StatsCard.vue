<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center"
          :class="getIconBackgroundClass(color)">
          <!-- Icône dynamique -->
          <component :is="getIconComponent(icon)" class="w-6 h-6" :class="getIconTextClass(color)" />
        </div>
      </div>
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="text-2xl font-semibold text-gray-900">
            <span v-if="isRating">{{ value }}/5</span>
            <span v-else>{{ formatValue(value) }}</span>
          </p>
          <p v-if="subtitle" class="ml-2 text-sm text-gray-500">{{ subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'purple'
  },
  subtitle: {
    type: String,
    default: ''
  },
  isRating: {
    type: Boolean,
    default: false
  }
});

// Icônes SVG
const icons = {
  users: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
  ]),
  'academic-cap': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M12 14l9-5-9-5-9 5 9 5z' }),
    h('path', { d: 'M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' })
  ]),
  'user-group': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
  ]),
  chat: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-5 5v-5z' })
  ]),
  calendar: h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ]),
  star: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' })
  ]),
  heart: h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' })
  ])
};

// Méthodes utilitaires
const getIconComponent = (iconName) => {
  return icons[iconName] || icons.users;
};

const getIconBackgroundClass = (color) => {
  const classes = {
    purple: 'bg-purple-100',
    gray: 'bg-gray-100',
    light: 'bg-purple-50'
  };
  return classes[color] || classes.purple;
};

const getIconTextClass = (color) => {
  const classes = {
    purple: 'text-purple-600',
    gray: 'text-gray-600',
    light: 'text-purple-500'
  };
  return classes[color] || classes.purple;
};

const formatValue = (value) => {
  if (typeof value === 'number' && value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value;
};
</script>
