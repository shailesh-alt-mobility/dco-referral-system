export interface User {
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if it's admin login
  if (email === 'admin@alt-mobility.com' && password === 'admin') {
    return {
      email: 'admin@alt-mobility.com',
      name: 'Admin User',
      role: 'admin'
    };
  }
  
  // Check if it's a customer login (any email that's not admin)
  if (email !== 'admin@alt-mobility.com' && password) {
    return {
      email: email,
      name: email.split('@')[0], // Use email prefix as name
      role: 'customer'
    };
  }
  
  return null;
};

export const logoutUser = (): void => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  
  // Also clear cookies for middleware
  document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const storeUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
  
  // Also set cookies for middleware
  document.cookie = `isAuthenticated=true; path=/`;
  document.cookie = `userRole=${user.role}; path=/`;
}; 