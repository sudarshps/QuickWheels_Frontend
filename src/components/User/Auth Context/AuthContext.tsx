import React,{createContext,useContext,useEffect,useState,useCallback} from 'react'


interface AuthContextProps {
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth:()=>void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {


  const[isAuthenticated,setIsAuthenticated] = useState(false)
  
  const refreshAuth = useCallback(()=> {
      
      const token = localStorage.getItem('token')

      if(token){
        setIsAuthenticated(true)
      }else{
        setIsAuthenticated(false)
      }
  },[])

  useEffect(()=>{
      refreshAuth()
  },[refreshAuth])

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{isAuthenticated,refreshAuth,logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
