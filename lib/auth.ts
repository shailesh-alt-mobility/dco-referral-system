export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'CUSTOMER';
  lastLogin: string;
}

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string } | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://34.47.217.149:3000'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier:email,otp: password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Return both user data and token from the response
    return {
      user: data.user,
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
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

export const storeUser = (user: User, token?: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('user', JSON.stringify(user));
  if (token) {
    localStorage.setItem('token', token);
  }
  localStorage.setItem('isAuthenticated', 'true');
  
  // Also set cookies for middleware
  document.cookie = `isAuthenticated=true; path=/`;
  document.cookie = `userRole=${user.role}; path=/`;
}; 