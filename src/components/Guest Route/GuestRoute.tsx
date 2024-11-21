import React, { useEffect } from "react";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface GuestRouteProps {
    children: React.ReactNode
}

const GuestRoute: React.FC<GuestRouteProps> = ({children}) => {
    const isAuthenticated = useSelector((state:RootState) => state.auth.user)
    const navigate = useNavigate()
    
    useEffect(()=> {
        if(isAuthenticated){
            navigate('/')
        }
    },[isAuthenticated,navigate])

    return !isAuthenticated ? <>{children}</> : null
};

export default GuestRoute;
