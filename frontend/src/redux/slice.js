import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
    name: 'auth',
    initialState: {
      accesstoken:null,
      refreshtoken:null,
      username:null
    },
    reducers:{
      setAccessToken: (state,action) => {
        state.accesstoken = action.payload;
        localStorage.setItem('jwt',action.payload)
      },
      setRefreshToken: (state,action) => {
        state.refreshtoken = action.payload;
      },
      setUsername: (state,action) => {
        // console.log(action.payload)
        state.username = action.payload;
        localStorage.setItem('user',action.payload)
      }
    }
  })
  // export const slice.reducer;
  
export const { setAccessToken, setRefreshToken, setUsername } = slice.actions;

export default slice.reducer