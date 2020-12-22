 import * as actionTypes from '../actions/types';

 const INITIAL_STATE = {
    currentUser: null,
     isLoading: true,
 }

 const userReducer = (state = INITIAL_STATE, action) => {
     switch (action.type){
         case actionTypes.SET_USER: 
         return {
             currentUser: action.payload.currentUser,
             isLoading: false,
         }
         case actionTypes.CLEAR_USER:
             return {
                 ...state,
                 isLoading: false
             }
         default: 
         return state;
     }
 }

 export default userReducer;