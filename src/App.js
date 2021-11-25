import React, { useEffect, useState, useRef } from 'react';
import { motion, useViewportScroll, useTransform, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import './App.scss';

import { useAppContext } from './Context/AppContext';
import { useViewportContext } from './Context/ViewportContext';
import Main from './Components/Main/Main';
import Header from './Components/Header/Header';
import Loading from './Pages/Loading/Loading';
import Overview from './Pages/Overview/Overview';
import Refs from './Components/Buttons/Refs/Refs';
import Footer from './Components/Footer/Footer';

import Pathophysiology from './Pages/Pathophysiology/Pathophysiology';
//import Scene from './Components/Scene/Scene';
// import OverviewVideo from './Assets/videos/1.mp4';
import Potential from './Pages/Potential/Potential';
import Study from './Pages/Study/Study';
import Summary from './Pages/Summary/Summary';
// import Video2 from './Assets/videos/Vascular_Remodelling_2-0_Preview_04.mp4';
import LeftIndicator from './Components/Indicators/LeftIndicator/LeftIndicator';
import { useRoutes } from 'hookrouter';

import AppContextProvider from './Context/AppContext';
import ThreeMain from './ThreeMain/ThreeMain';

const routes = {
    '/': () => <Overview />,
    '/Pathophysiology': () => <Pathophysiology />,
    '/potential-of-opsumit': () => <Potential />,
    '/the-repair-study': () => <Study />,
    '/summary': () => <Summary />,
};

function App() {
    const headerData = useAppContext();
    const [state, dispatch] = useAppContext(headerData);
    const viewportData = useViewportContext();
    const viewportWidth = useViewportContext(viewportData);

    const [scrollPos, setScrollPos] = useState(state.scrollPosition);
    // Create a MotionValue to track scrollYProgress
    const { scrollYProgress } = useViewportScroll();
    const pos = useTransform(
        scrollYProgress,
        [0, 0.07, 0.014, 0.21, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.7, 0.77, 0.85, 0.92, 0.99],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    );

    const video1Ref = useRef();
    const video2Ref = useRef();
    const source = useRef();
    const [videoEnd, setVideoEnd] = useState(false);

    const routeResult = useRoutes(routes);

    //reset scrol posistion on reload
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
    // window.onload = function () {
    //     video1Ref.current.play();
    // };

    useEffect(() => {
        if (
            state.overlayActive ||
            state.popupActive ||
            state.refActive ||
            state.MobileMenuActive ||
            state.subPage.active
        ) {
            // stop user scrolling
            disableBodyScroll(video1Ref);
        } else {
            // allow scroll
            clearAllBodyScrollLocks();

            // to dispatch scroll position
            const unsubscribeY = scrollYProgress.onChange((x) => {
                if (state.NavSelected >= 0) {
                    // console.log('state.NavSelected >= 0');
                    // //pos.set(9);
                    // scrollYProgress.set(0.85);
                    // console.log(Math.round(pos.get()), scrollYProgress.current);
                    // dispatch({ type: 'SCROLL_POSITION', payload: Math.round(pos.get()) });
                    // dispatch({ type: 'NAV_SELECTED', payload: -1 });
                }
                // pos needs updating with route change
                // setScrollPos(Math.round(pos.get()));
                // // console.log(scrollYProgress, 'scrolly');
                // if (state.NavSelected === 7) {
                //     console.log('state.NavSelected >= 0', scrollYProgress, x);
                //     //pos.set(9);
                //     scrollYProgress.set(0.9, true);
                //     console.log(pos.get(), scrollYProgress.current);
                //     dispatch({ type: 'SCROLL_POSITION', payload: 8 });
                //     dispatch({ type: 'NAV_SELECTED', payload: '' });
                // } else {
                //console.log(Math.round(pos.get()), state.scrollPosition, 'set');
                //     console.log(Math.round(pos.get()), 'get');
                //     //pos.set(Math.round(pos.get()), true);
                dispatch({ type: 'SCROLL_POSITION', payload: Math.round(pos.get()) });
                // }
                // console.log('pos', pos.get());
            });

            return () => {
                unsubscribeY();
            };
        }
    }, [
        scrollPos,
        pos,
        state.overlayActive,
        state.popupActive,
        state.refActive,
        state.MobileMenuActive,
        state.scrollPosition,
        state.subPage.active,
        scrollYProgress,
        state.NavSelected,
    ]);

    useEffect(() => {
        //store screen size
        dispatch({ type: 'SET_VIEWPORT' });
    }, []);

    function handleProgress(e) {
        let timeStamp = Math.round(e.timeStamp / 1000) * 1000;
        //console.log(Math.round(e.timeStamp / 1000) * 1000);
        if (timeStamp === 1000 && state.scrollPosition < 1) {
            video1Ref.current.pause();
        }
    }

    // useEffect(() => {
    //     const handleScroll = (event) => {
    //         // console.log(video1Ref.current, state.scrollPosition, 'event');
    //         if (!videoEnd && video1Ref.current && state.scrollPosition >= 0) {
    //             if (Math.sign(event.deltaY) > 0) {
    //                 video1Ref.current.currentTime += 0.05;
    //             } else {
    //                 if (state.scrollPosition <= 2) {
    //                     video1Ref.current.currentTime -= 0.05;
    //                 }
    //             }

    //             // window.('mousewheel DOMMouseScroll', function(event){
    //             //     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
    //             //        video.currentTime += 5;
    //             //     }
    //             //     else {
    //             //        video.currentTime -= 5;
    //             //     }
    //             // });
    //         }
    //     };

    //     window.addEventListener('wheel', handleScroll);
    //     return () => {
    //         window.removeEventListener('wheel', handleScroll);
    //     };

    //     // if (videoEnd) {
    //     //     video1Ref.current.pause();
    //     //     // source.current.setAttribute('src', Video2);
    //     //     console.log(source, 'source');
    //     // }
    // }, []);

    function animationComplete() {
        return;
    }

    return (
        <div className="app">
            <Header />
            {/* <AnimatePresence exitBeforeEnter>{contentSwitch()}</AnimatePresence> */}

            <main style={{ position: 'relative' }}>
                <AnimatePresence exitBeforeEnter>
                    {state.scrollPosition >= 11 && <Summary scrollPosition={scrollPos} />}
                </AnimatePresence>

                <AnimatePresence exitBeforeEnter>
                    {state.scrollPosition < 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ opacity: { duration: 0.5 } }}
                        >
                            <Overview scrollPosition={pos} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {state.scrollPosition > 1 && state.scrollPosition < 6 && (
                    <Pathophysiology scrollPosition={scrollPos} />
                )}

                <AnimatePresence exitBeforeEnter>
                    {state.scrollPosition === 6 && <Potential scrollPosition={scrollPos} />}
                </AnimatePresence>

                <AnimatePresence exitBeforeEnter>
                    {state.scrollPosition > 6 && state.scrollPosition < 11 && (
                        <Study scrollPosition={scrollPos} />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {state.scrollPosition > 1 && !state.overlayActive && viewportWidth > 800 && (
                        <LeftIndicator onComplete={animationComplete} />
                    )}
                </AnimatePresence>
            </main>

            <Refs />

            <Footer />
        </div>
    );
}

export default App;
