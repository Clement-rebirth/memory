import '../services/firebase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
  user: 'loading', // false if user isn't sign in, object if sign in, loading if loading
  setUser: () => {}
});

const UserProvider = ({ children }) => {

  const [user, setUser] = useState('loading');

  useEffect(() => {
    const auth = getAuth();

    let unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user ? user : false);
    });

    return unsubscribe;
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  );
};

export default UserProvider;
