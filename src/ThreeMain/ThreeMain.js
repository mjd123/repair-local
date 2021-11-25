import './threemain.css';
import * as THREE from "three"
import ReactDOM from "react-dom"
import React, { useRef, useEffect } from "react"
import {Canvas, useFrame, useThree} from "@react-three/fiber"
import { Block, useBlock } from "./blocks"
import state from "./store"
import "./styles.css"
import { Text } from '@react-three/drei';
import "./CustomMaterial"
import "./ColorMaterial"
import "./ImageFadeMaterial"
import t from './sunflower.png'
import {map, clamp} from "./utils/utilities";
import ScrollToPlugin from './plugins/gsap/esm/ScrollToPlugin.js'
import gsap from 'gsap';
import font from './Hero New Bold.woff'
gsap.registerPlugin(ScrollToPlugin);

function Plane({ color = "white", ...props }) {
    const material = useRef();
    const map = t;
    return (
        <mesh {...props}>
            <planeGeometry />
            <meshBasicMaterial color={color} />
        </mesh>
    )
}
function ShaderPlane({ color = "white", ...props }) {
    const material = useRef();
    const { viewportHeight } = useBlock()
    useFrame(({ clock, delta }) => {
        const curTop = state.top.current;
        const curY = material.current.uniforms.distortion.value;
        const nextY = (curTop / ((state.pages - 1) * viewportHeight * state.zoom)) * Math.PI
        let targ = THREE.MathUtils.lerp(curY, nextY, 0.015);
        material.current.uniforms.time.value = clock.oldTime * 0.011;
        material.current.uniforms.distortion.value = targ;
        let targAlpha = map(targ, 0.1, 1, 1, 0);
        targAlpha = clamp(targAlpha, 0 , 1);
        material.current.uniforms.opacity.value = targAlpha;
    });
    return (
        <points {...props}>
            <planeBufferGeometry args={[1024,1024,512,512]}/>
            <imageFadeMaterial attach="material" ref={material}/>
        </points>
    )
}

function Cross() {
    const ref = useRef()
    const { viewportHeight } = useBlock()
    useFrame(() => {
        const curTop = state.top.current
        const curY = ref.current.rotation.z
        const nextY = (curTop / ((state.pages - 1) * viewportHeight * state.zoom)) * Math.PI
        ref.current.rotation.z = THREE.MathUtils.lerp(curY, nextY, 0.05)
    })
    return (
        <group ref={ref} scale={[2, 2, 2]}>
            <Plane scale={[1, 0.2, 0.2]} color="#e2bfca" position={[0,0,3]}/>
            <Plane scale={[0.2, 1, 0.2]} color="#e2bfca" position={[0,0,3]} />
        </group>
    )
}

function Content({ left, children }) {
    const { contentMaxWidth, canvasWidth, margin } = useBlock()
    const aspect = 1.75
    const alignRight = (canvasWidth - contentMaxWidth) / 2
    return (
        <group position={[alignRight * (left ? -1 : 1), 0, -1]}>
            <Plane scale={[contentMaxWidth, contentMaxWidth / aspect, 1]} color="#171738" />
            {children}
        </group>
    )
}
function ShaderContent({ left, children }) {
    const { contentMaxWidth, canvasWidth, margin } = useBlock()
    const aspect = 1
    const alignRight = (canvasWidth - contentMaxWidth - margin) / 2
    return (
        <group position={[alignRight * (left ? -1 : 1), 0, 0]}>
            <ShaderPlane scale={[0.01, 0.01, 0.01]} color="#eeff00" />
            {children}
        </group>
    )
}

function Stripe() {
    const { contentMaxWidth } = useBlock()
    return (
        <Plane scale={[100, contentMaxWidth/3, 1]} rotation={[0, 0, Math.PI / 4]} position={[0, 0, -1]} color="#330000" />
    )
}
function TextItem({copy}) {
    const ref = useRef()
    const { viewportHeight, contentMaxWidth } = useBlock()
    const aspect = 1;
    useFrame(() => {
        const curTop = state.top.current
        const curY = ref.current.rotation.z
        const nextY = (curTop / ((state.pages - 1) * viewportHeight * state.zoom)) * Math.PI
        // ref.current.rotation.z = THREE.MathUtils.lerp(curY, nextY, 0.1);
    })
    return (
        <group ref={ref} scale={[1, 1, 1]}>
            <Text
                color={'#ffffff'}
                fontSize={0.1}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign={'left'}
                font={font}
                anchorX="center"
                anchorY="middle"
                scale={[contentMaxWidth, contentMaxWidth / aspect, 1]}
            >
                {copy}
            </Text>
        </group>
    )
}
function Cube() {

    const ref = useRef()
    useFrame(() => {
        ref.current.rotation.y += 0.01
        ref.current.rotation.x += 0.01
    })
    return (
        <mesh ref={ref} scale={[1, 1, 1]} position={[1,0,100]} frustumCulled={false} castShadow receiveShadow>
            <boxBufferGeometry />
            <meshStandardMaterial attach="material" color="lightblue" roughness={0} metalness={0.1} />
        </mesh>
    )
}

function Bg() {
    const { viewport } = useThree()
    const { viewportHeight, contentMaxWidth, viewportWidth, canvasWidth } = useBlock()
    const max = Math.max(viewport.width, viewport.height)
    const ref = useRef()
    useFrame(({clock}) => {
        // ref.current.time.value += delta * 100
        ref.current.uniforms.time.value =  clock.oldTime * 0.0001;
    })
    return (
        <mesh scale={[canvasWidth*2, viewportHeight*4, 1]} position={[0, 0, -2]}>
            <planeBufferGeometry />
            <colorMaterial ref={ref} />
        </mesh>
    )
}

function ThreeMain() {
    const scrollArea = useRef()
    const onScroll = (e) => (state.top.current = e.target.scrollTop)
    useEffect(() => void onScroll({ target: scrollArea.current }), [])

    function jumpTo(idx) {
        console.log('', idx);
        // gsap.to(window, {duration: 2, scrollTo: 400});
        window.scrollTo(0, 200);
        gsap.to('.scrollArea', {duration: 2, scrollTo: window.innerHeight * (idx-1), ease: 'expo.out'});
    }
    return (
        <>
            <Canvas linear orthographic camera={{ zoom: state.zoom, position: [0, 0, 500], far: 5000 }}>
                <ambientLight intensity={1} />
                <directionalLight
                    position={[0, 5, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-height={1024}
                    shadow-mapSize-width={1024}
                    shadow-radius={10}
                    shadow-bias={-0.0001}
                />

                {/* First section */}
                <Block factor={1.5} offset={0}>
                    <Block factor={0.9}>
                        <TextItem copy={`Home`}/>
                    </Block>
                </Block>
                {/* Second section */}
                <Block factor={2.0} offset={1}>
                    <Content />
                    <Cube />
                    <Block factor={0.9}>
                        <TextItem copy={`Artery`}/>
                    </Block>
                </Block>
                {/* Stripe */}
                <Block factor={-1.0} offset={1}>
                    <Stripe />
                </Block>
                {/* Last section */}
                <Block factor={1.5} offset={2}>
                    <Content right>
                        <Block factor={-1.6}>
                            <Cross />
                            <ShaderContent left />
                        </Block>
                    </Content>
                </Block>
                <Block factor={1.5} offset={0}>

                    <Block factor={-1.2}>
                        <Bg/>z
                    </Block>
                </Block>
            </Canvas>
            <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
                <div className="debug">
                    <div onClick={()=> jumpTo(1)}>1</div>
                    <div onClick={()=> jumpTo(2)}>2</div>
                    <div onClick={()=> jumpTo(3)}>3</div>
                </div>
                <div style={{ height: `${state.pages * 150}vh` }} />
            </div>
        </>
    )
}

export default ThreeMain;
