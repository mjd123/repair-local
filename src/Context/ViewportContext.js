import React, { useEffect, useState, createContext, useContext } from 'react';

const viewportContext = createContext(null);

export function useViewportContext() {
    return useContext(viewportContext);
}

const ViewportProvider = (props) => {
    const isSSR = typeof window !== 'undefined';
    const [windowSize, setWindowSize] = useState(
        window.innerWidth
        //height: isSSR ? 800 : window.innerHeight,
    );

    // only info needed is if window width is more or less that 800

    function changeWindowSize() {
        setWindowSize(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', changeWindowSize);

        return () => {
            window.removeEventListener('resize', changeWindowSize);
        };
    }, []);

    return <viewportContext.Provider value={windowSize}>{props.children}</viewportContext.Provider>;
};

export default ViewportProvider;
