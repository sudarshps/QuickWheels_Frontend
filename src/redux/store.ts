import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../slices/authSlice'
import userDetailsReducer from '../slices/userDetailSlice'
import adminAuthSlice from "../slices/adminAuthSlice";
// import { apiSlice } from "../slices/apiSlice";


const store = configureStore({
    reducer:{
        auth:authReducer, 
        userDetails:userDetailsReducer,
        adminauth:adminAuthSlice
        // [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // middleware:(getDefaultMiddleware) => 
    //     getDefaultMiddleware().concat(apiSlice.middleware),
    // devTools:true
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;