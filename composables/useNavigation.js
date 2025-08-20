// Composable pour la gestion de la navigation selon les rôles
export const useNavigation = () => {
  const { user } = useAuth();

  // Navigation pour les administrateurs
  const adminNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Vue d\'ensemble'
    },
    {
      name: 'Utilisateurs',
      to: '/admin/users',
      icon: 'users',
      description: 'Gestion des comptes'
    },
    {
      name: 'Messages',
      to: '/admin/messages',
      icon: 'chat',
      description: 'Modération'
    },
    {
      name: 'Matières',
      to: '/admin/subjects',
      icon: 'book',
      description: 'Configuration'
    },
    {
      name: 'Rapports',
      to: '/admin/reports',
      icon: 'chart',
      description: 'Analytics'
    },
    {
      name: 'Paramètres',
      to: '/admin/settings',
      icon: 'settings',
      description: 'Configuration'
    }
  ];

  // Navigation pour les enseignants
  const teacherNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Tableau de bord'
    },
    {
      name: 'Messages',
      to: '/messages',
      icon: 'chat',
      description: 'Conversations'
    },
    {
      name: 'Planning',
      to: '/teacher/schedule',
      icon: 'calendar',
      description: 'Mes cours'
    },
    {
      name: 'Disponibilités',
      to: '/teacher/availability',
      icon: 'clock',
      description: 'Horaires libres'
    },
    {
      name: 'Mes étudiants',
      to: '/teacher/students',
      icon: 'users',
      description: 'Élèves'
    },
    {
      name: 'Avis',
      to: '/teacher/reviews',
      icon: 'star',
      description: 'Évaluations'
    },
    {
      name: 'Profil',
      to: '/teacher/profile',
      icon: 'user',
      description: 'Mon compte'
    }
  ];

  // Navigation pour les étudiants
  const studentNavigation = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: 'home',
      description: 'Tableau de bord'
    },
    {
      name: 'Enseignants',
      to: '/teachers',
      icon: 'users',
      description: 'Trouver un prof'
    },
    {
      name: 'Messages',
      to: '/messages',
      icon: 'chat',
      description: 'Conversations'
    },
    {
      name: 'Mes cours',
      to: '/student/bookings',
      icon: 'calendar',
      description: 'Réservations'
    },
    {
      name: 'Matières',
      to: '/subjects',
      icon: 'book',
      description: 'Parcourir'
    },
    {
      name: 'Profil',
      to: '/profile',
      icon: 'user',
      description: 'Mon compte'
    }
  ];

  // Navigation mobile simplifiée
  const mobileNavigation = computed(() => {
    if (!user.value) return [];
    
    switch (user.value.role) {
      case 'admin':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Utilisateurs', to: '/admin/users', icon: 'users' },
          { name: 'Messages', to: '/admin/messages', icon: 'chat' },
          { name: 'Paramètres', to: '/admin/settings', icon: 'settings' }
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Messages', to: '/messages', icon: 'chat' },
          { name: 'Planning', to: '/teacher/schedule', icon: 'calendar' },
          { name: 'Profil', to: '/teacher/profile', icon: 'user' }
        ];
      case 'student':
        return [
          { name: 'Dashboard', to: '/dashboard', icon: 'home' },
          { name: 'Enseignants', to: '/teachers', icon: 'users' },
          { name: 'Messages', to: '/messages', icon: 'chat' },
          { name: 'Profil', to: '/profile', icon: 'user' }
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

  // Vérifier si une route est accessible selon le rôle
  const canAccessRoute = (route) => {
    if (!user.value) return false;
    
    const publicRoutes = ['/', '/login', '/register', '/test-auth', '/test-session'];
    if (publicRoutes.includes(route)) return true;
    
    const role = user.value.role;
    
    // Routes admin
    if (route.startsWith('/admin')) {
      return role === 'admin';
    }
    
    // Routes enseignant
    if (route.startsWith('/teacher')) {
      return role === 'teacher';
    }
    
    // Routes étudiant
    if (route.startsWith('/student')) {
      return role === 'student';
    }
    
    // Routes communes (dashboard, messages, profile)
    const commonRoutes = ['/dashboard', '/messages', '/profile'];
    if (commonRoutes.some(commonRoute => route.startsWith(commonRoute))) {
      return ['admin', 'teacher', 'student'].includes(role);
    }
    
    // Routes enseignants pour étudiants (consultation)
    if (route.startsWith('/teachers') || route.startsWith('/subjects')) {
      return ['student', 'admin'].includes(role);
    }
    
    return false;
  };

  // Obtenir la navigation breadcrumb
  const getBreadcrumb = (currentPath) => {
    const segments = currentPath.split('/').filter(Boolean);
    const breadcrumb = [{ name: 'Accueil', to: '/dashboard' }];
    
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
