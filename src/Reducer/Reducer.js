const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PAGE':
            return {
                ...state,
                page: action.payload,
            };
        case 'TOGGLE_REFS':
            return {
                ...state,
                refActive: action.payload,
            };
        case 'TOGGLE_HEADER':
            return {
                ...state,
                headerActive: action.payload,
            };

        case 'TOGGLE_OVERLAY':
            return {
                ...state,
                overlayActive: action.payload,
            };
        case 'SCROLL_POSITION':
            return {
                ...state,
                scrollPosition: action.payload,
            };
        case 'TOGGLE_SUB_PAGE':
            return {
                ...state,
                subPage: action.payload,
            };

        case 'TOGGLE_POPUP':
            return {
                ...state,
                popupActive: action.payload,
            };

        case 'TOGGLE_MOBILE_MENU':
            return {
                ...state,
                MobileMenuActive: action.payload,
            };

        case 'CLOSE_OVERLAYS':
            return {
                ...state,
                MobileMenuActive: false,
                overlayActive: false,
                popupActive: false,
                headerActive: true,
                refActive: false,
            };

        case 'NAV_SELECTED':
            return {
                ...state,
                NavSelected: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default Reducer;
