import React, { createContext, useContext, useReducer } from 'react';
import Reducer from '../Reducer/Reducer';

// Create a Context
const AppContext = createContext(null);
const updateAppContext = createContext(null);

const initialState = {
    page: '',
    refActive: false,
    overlayActive: false,
    popupActive: false,
    headerActive: true,
    NavSelected: '',
    MobileMenuActive: false,
    footerActive: '',
    scrollPosition: -1,
    subPage: {
        id: 0,
        active: false,
    },
    error: null,
};

export function useAppContext() {
    return useContext(AppContext);
}

export function useNavUpdate(i) {
    return useContext(updateAppContext);
}
// a store to hold context
const AppContextProvider = (props) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return <AppContext.Provider value={[state, dispatch]}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
