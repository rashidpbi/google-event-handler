import { createContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const valueToShare = {
    updateCookies: function (allCookies) {
      document.cookie = allCookies;
    },
    // logOut:function(){
    //     window.location.href = "http://localhost:3000/login"
    // }
  };
  return (
    <AuthContext.Provider value={valueToShare}>{children}</AuthContext.Provider>
  );
};
