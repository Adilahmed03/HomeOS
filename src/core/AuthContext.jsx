import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User management utilities
const getUsersFromStorage = () => {
  const users = localStorage.getItem('homeos_users');
  return users ? JSON.parse(users) : {};
};

const saveUsersToStorage = (users) => {
  localStorage.setItem('homeos_users', JSON.stringify(users));
};

const createUserData = (username) => {
  return {
    username,
    settings: {
      theme: 'dark',
      wallpaper: 'gradient-blue',
      showClock: true,
      taskbarPosition: 'bottom',
      clockFormat: '12h',
      animations: true,
    },
    fileSystem: {
      '/': {
        folders: [
          { name: 'Documents', type: 'folder' },
          { name: 'Downloads', type: 'folder' },
          { name: 'Pictures', type: 'folder' },
          { name: 'Desktop', type: 'folder' },
        ],
        files: [
          { name: 'welcome.txt', type: 'file', content: 'Welcome to HomeOS!' },
        ]
      },
      '/Documents': { folders: [], files: [] },
      '/Downloads': { folders: [], files: [] },
      '/Pictures': { folders: [], files: [] },
      '/Desktop': { folders: [], files: [] },
    },
    notepadContent: 'Welcome to your personal notepad!',
    trash: [],
    createdAt: new Date().toISOString(),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const storedSession = sessionStorage.getItem('homeos_session');
    if (storedSession) {
      const session = JSON.parse(storedSession);
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const register = (username, password) => {
    const users = getUsersFromStorage();
    
    if (users[username]) {
      throw new Error('Username already exists');
    }
    
    users[username] = {
      password: btoa(password), // Simple encoding (not secure for production)
      userData: createUserData(username),
    };
    
    saveUsersToStorage(users);
    return true;
  };

  const login = (username, password) => {
    const users = getUsersFromStorage();
    const user = users[username];
    
    if (!user || btoa(password) !== user.password) {
      throw new Error('Invalid username or password');
    }
    
    const sessionData = {
      username,
      loginTime: new Date().toISOString(),
      userData: user.userData,
    };
    
    sessionStorage.setItem('homeos_session', JSON.stringify(sessionData));
    setUser(sessionData);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem('homeos_session');
    setUser(null);
  };

  const updateUserData = (updates) => {
    if (!user) return;
    
    const users = getUsersFromStorage();
    users[user.username].userData = {
      ...users[user.username].userData,
      ...updates,
    };
    saveUsersToStorage(users);
    
    const updatedUser = {
      ...user,
      userData: users[user.username].userData,
    };
    setUser(updatedUser);
    sessionStorage.setItem('homeos_session', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUserData,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
