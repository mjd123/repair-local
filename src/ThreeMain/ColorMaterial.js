import * as THREE from "three"
import {extend} from "@react-three/fiber"
import t from './sunflower.png'
export class ColorMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: "f", value: 0 },
                t: { type: "t", value: new THREE.TextureLoader().load(t) },
                distortion: { type: "f", value: 0.44 },
                resolution: { type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },
            vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
            fragmentShader: `uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
              gl_FragColor.rgba = vec4(0.1 + 0.3 * sin(vUv.yxx + time) + color, 1);
              gl_FragColor = vec4(0.161,0.161,0.388,1.0);
            }
          `
        })
    }
}

extend({ColorMaterial})
