'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {decode} from 'jsonwebtoken';
import Cookies from 'js-cookie';
import {IUser} from '../app/models/user';
interface AuthContextType {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser| null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const decoded = decode(token) as IUser;
      setUser({
        firstName: decoded["firstName"],
        lastName: decoded.lastName,
        userName: decoded.userName,
        _id: decoded._id,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
