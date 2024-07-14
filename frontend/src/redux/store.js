import { configureStore } from '@reduxjs/toolkit'
import authreducer from './slice.js'
// import thunk from 'redux-thunk';



// const middleware = [...getDefaultMiddleware(), thunk];

export default configureStore({
  reducer: authreducer,
  // middleware: [...getDefaultMiddleware(), thunk],
})
