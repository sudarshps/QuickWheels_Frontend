import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AdminProtectedRoute: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.adminauth.token);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ?<Outlet/>: null;
}

export default AdminProtectedRoute;


