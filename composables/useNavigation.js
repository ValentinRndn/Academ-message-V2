// Composable for role-based navigation management
export const useNavigation = () => {
  const { user } = useAuth();

  // Navigation for administrators
  const adminNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Overview'
    },
    {
      name: 'Users',
      to: '/admin/users',
      icon: 'users',
      description: 'Account management'
    },
    // {
    //   name: 'Messages',
    //   to: '/admin/messages',
    //   icon: 'chat',
    //   description: 'Modération'
    // },
    {
      name: 'Subjects',
      to: '/admin/subjects',
      icon: 'book',
      description: 'Configuration'
    },
    // {
    //   name: 'Rapports',
    //   to: '/admin/reports',
    //   icon: 'chart',
    //   description: 'Analytics'
    // },
    {
      name: 'Settings',
      to: '/admin/settings',
      icon: 'settings',
      description: 'Configuration'
    }
  ];

  // Navigation for teachers
  const teacherNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Dashboard'
    },
    {
      name: 'Messages',
      to: '/messages',
      icon: 'chat',
      description: 'Conversations'
    },
         {
       name: 'Schedule',
       to: '/teacher/schedule',
       icon: 'calendar',
       description: 'My schedule'
     },
     
    {
      name: 'Availability',
      to: '/teacher/availability',
      icon: 'clock',
      description: 'Free hours'
    },
    {
      name: 'My Students',
      to: '/teacher/students',
      icon: 'users',
      description: 'Students'
    },
    {
      name: 'Reviews',
      to: '/teacher/reviews',
      icon: 'star',
      description: 'Evaluations'
    },
    {
      name: 'Profile',
      to: '/teacher/profile',
      icon: 'user',
      description: 'My account'
    }
  ];

  // Navigation for students
  const studentNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Dashboard'
    },
    {
      name: 'Teachers',
      to: '/teachers',
      icon: 'users',
      description: 'Find a teacher'
    },
    {
      name: 'Messages',
      to: '/messages',
      icon: 'chat',
      description: 'Conversations'
    },
    {
      name: 'My Courses',
      to: '/student/bookings',
      icon: 'calendar',
      description: 'Bookings'
    },
    {
      name: 'Profile',
      to: '/student/profile',
      icon: 'user',
      description: 'My account'
    }
  ];

  // Navigation mobile simplifiée
  const mobileNavigation = computed(() => {
    if (!user.value) return [];
    
    switch (user.value.role) {
      case 'admin':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Users', to: '/admin/users', icon: 'users' },
          { name: 'Subjects', to: '/admin/subjects', icon: 'book' },
          { name: 'Settings', to: '/admin/settings', icon: 'settings' }
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Messages', to: '/messages', icon: 'chat' },
          { name: 'Schedule', to: '/teacher/schedule', icon: 'calendar' },
          { name: 'Profile', to: '/teacher/profile', icon: 'user' }
        ];
      case 'student':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Teachers', to: '/teachers', icon: 'users' },
          { name: 'Messages', to: '/messages', icon: 'chat' },
          { name: 'Profile', to: '/student/profile', icon: 'user' }
        ];
      default:
        return [];
    }
  });

  // Navigation complète selon le rôle
  const navigation = computed(() => {
    if (!user.value) return [];
    
    switch (user.value.role) {
      case 'admin':
        return adminNavigation;
      case 'teacher':
        return teacherNavigation;
      case 'student':
        return studentNavigation;
      default:
        return [];
    }
  });

  // Check if a route is accessible according to role
  const canAccessRoute = (route) => {
    if (!user.value) return false;
    
    const publicRoutes = ['/', '/login', '/register', '/test-auth', '/test-session'];
    if (publicRoutes.includes(route)) return true;
    
    const role = user.value.role;
    
    // Admin routes
    if (route.startsWith('/admin')) {
      return role === 'admin';
    }
    
    // Teacher routes
    if (route.startsWith('/teacher')) {
      return role === 'teacher';
    }
    
    // Student routes
    if (route.startsWith('/student')) {
      return role === 'student';
    }
    
    // Common routes (dashboard, messages, profile)
    const commonRoutes = ['/dashboard', '/messages', '/profile'];
    if (commonRoutes.some(commonRoute => route.startsWith(commonRoute))) {
      return ['admin', 'teacher', 'student'].includes(role);
    }
    
    // Teacher routes for students (viewing)
    if (route.startsWith('/teachers') || route.startsWith('/subjects')) {
      return ['student', 'admin'].includes(role);
    }
    
    return false;
  };

  // Get navigation breadcrumb
  const getBreadcrumb = (currentPath) => {
    const segments = currentPath.split('/').filter(Boolean);
    const breadcrumb = [{ name: 'Home', to: '/dashboard' }];
    
    let currentRoute = '';
    for (const segment of segments) {
      currentRoute += `/${segment}`;
      const navItem = navigation.value.find(item => item.to === currentRoute);
      if (navItem) {
        breadcrumb.push({ name: navItem.name, to: currentRoute });
      }
    }
    
    return breadcrumb;
  };

  return {
    navigation,
    mobileNavigation,
    canAccessRoute,
    getBreadcrumb
  };
};
