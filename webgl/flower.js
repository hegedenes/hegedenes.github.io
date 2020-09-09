import * as common from './common.js';

function animate(env) {
    env.uniforms.time.value = 60.0 * (Date.now() - env.startTime) / 1000.0;
    env.renderer.render(env.scene, env.camera);

    requestAnimationFrame(function() {
        animate(env);
    });
}

export function init(container, radius, thickness) {
    var fragmentShader = `
        uniform float time;
        
        bool is_circle(vec2 p, float radius) {
            vec2 coord;
            coord.x = mod(p.x, 2.0 * radius) - radius;
            coord.y = mod(p.y, 2.0 * radius) - radius;
            return abs(coord.x * coord.x + coord.y * coord.y - radius * radius) < ${thickness}.0;
        }

        void main()	{
            vec2 coord;
            float radius = ${radius}.0;
            bool isCircle1 = is_circle(gl_FragCoord.xy, radius);
            bool isCircle2 = is_circle(gl_FragCoord.xy - vec2(radius, 0.0), radius);
            bool isCircle3 = is_circle(gl_FragCoord.xy - vec2(0.0, radius), radius);
            bool isCircle4 = is_circle(gl_FragCoord.xy - vec2(radius, radius), radius);
            bool isCircle = isCircle1 || isCircle2 || isCircle3 || isCircle4;
            float r = isCircle ? 1.0 : 0.0;
            float g = isCircle ? round(gl_FragCoord.y / 600.0 * 6.0) / 6.0 : 0.0;
            float b = isCircle ? 0.4 : 0.0;
            gl_FragColor = vec4(r, g, b, 1.0);
        }`;

    var uniforms = {
        time: { type: "f", value: 1.0 },
    };

    var env = common.init(container, fragmentShader, uniforms);
    animate(env);
}
