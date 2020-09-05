import * as common from './common.js';

function animate(env) {
    env.uniforms.time.value = 60.0 * (Date.now() - env.startTime) / 1000.0;
    env.uniforms.rand1.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    env.uniforms.rand2.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    env.uniforms.rand3.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    env.renderer.render(env.scene, env.camera);

    requestAnimationFrame(function() {
        animate(env);
    });
}

export function init(container, r, g, b) {
    var fragmentShader = `
        uniform float time;
        uniform vec3 rand1;
        uniform vec3 rand2;
        uniform vec3 rand3;
        
        float random(vec2 co) {
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        void main()	{
            vec2 coord = gl_FragCoord.xy;
            float r = ${r ? 'random(coord * rand1.x * rand1.y * rand1.z)' : '0.4'};
            float g = ${g ? 'random(coord * rand2.x * rand2.y * rand2.z)' : '0.4'};
            float b = ${b ? 'random(coord * rand3.x * rand3.y * rand3.z)' : '0.4'};
            gl_FragColor = vec4(r, g, b, 1.0);
        }`;

    var uniforms = {
        time: { type: "f", value: 1.0 },
        rand1: { type: "v3", value: new THREE.Vector3() },
        rand2: { type: "v3", value: new THREE.Vector3() },
        rand3: { type: "v3", value: new THREE.Vector3() },
    };

    var env = common.init(container, fragmentShader, uniforms);
    animate(env);
}
