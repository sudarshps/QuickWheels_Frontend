import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId:string | null;
    dob:string | null;
    phone:string | null;
    drivingExpDate:string | null;
    address:string | null;
    drivingID:string|null;
    drivingIDFront:string|null;
    drivingIDBack:string|null;
    profileUpdated:boolean | null;
    verifiedUser:boolean | null;
    isHost:boolean | null;
    status:string | null;
    role:string[];
    note:string| null;
}

const initialState:UserState = {
    userId:null,
    dob:null,
    phone:null,
    drivingExpDate:null,
    address:null,
    drivingID:null,
    drivingIDFront:null,   
    drivingIDBack:null,
    profileUpdated:false,
    verifiedUser:false,
    isHost:false,
    status:null,
    role:[],
    note:null
}


const userDetailSlice = createSlice({
    name:'userDetails',
    initialState,
    reducers:{
        setUserDetails:(state,action:PayloadAction<UserState>) => {
            const {userId,dob,phone,drivingExpDate,address,drivingID,drivingIDFront,drivingIDBack,profileUpdated,isHost,status,role,note,verifiedUser} = action.payload
            state.userId = userId
            state.dob = dob
            state.phone = phone
            state.drivingExpDate = drivingExpDate
            state.address = address
            state.drivingID = drivingID
            state.drivingIDFront = drivingIDFront
            state.drivingIDBack = drivingIDBack
            state.profileUpdated = profileUpdated
            state.verifiedUser = verifiedUser
            state.isHost = isHost
            state.status = status
            state.role = role
            state.note = note
        }
    }
})


export const {setUserDetails} = userDetailSlice.actions
export default userDetailSlice.reducer