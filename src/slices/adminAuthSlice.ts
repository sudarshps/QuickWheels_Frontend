import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    token:string | null;
}


const initialState:AuthState = {
    token:null
}


const adminAuthSlice = createSlice({
    name:'adminauth',
    initialState,
    reducers:{
        setAdminToken:(state,action:PayloadAction<{token:string}>)=>{
            const{token} = action.payload
            state.token = token
        },
        logout:(state)=>{
            state.token = null
        }
    }
})

export const {setAdminToken,logout} = adminAuthSlice.actions
export default adminAuthSlice.reducer