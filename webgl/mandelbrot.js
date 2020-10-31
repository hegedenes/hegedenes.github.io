import * as common from './common.js';

export function init(container, iterations) {
    var fragmentShader = `
        uniform float zoom;
        uniform vec2 loc;
        uniform vec2 resolution;
        
        vec2 mul_complex(vec2 a, vec2 b) {
            return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
        }
        
        vec2 mandel(vec2 z, vec2 c) {
            return mul_complex(z, z) + c;
        }
        
        int iterate_mandel(vec2 z0, vec2 c, int n) {
            vec2 z = z0;
            int i;
            for (i = 0; i < n; ++i) {
                z = mandel(z, c);
                if (abs(z.x) > 2.0 || abs(z.y) > 2.0) {
                    break;
                }
            }
            return i;
        }

        void main()	{
            vec2 scale = vec2(4.0 / resolution.x, 4.0 / resolution.y) * zoom;
            vec2 center = vec2(resolution.x / 2.0, resolution.y / 2.0);
            vec2 pos = ((gl_FragCoord.xy - center) * scale + loc) ;
            int mandel_res = iterate_mandel(vec2(0.0, 0.0), pos, ${iterations});
            float r = float(mandel_res) / ${iterations}.0;
            float g = 0.0;
            float b = 0.2;
            gl_FragColor = vec4(r, g, b, 1.0);
        }`;

    var uniforms = {
        zoom: { type: "f", value: 1.0 },
        loc: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
    };
    
    document.getElementById(container).addEventListener("wheel", function(event) {
        uniforms.zoom.value *= (1.0 + event.deltaY * 0.02);
        console.log(event.deltaY * 0.01);
    });
    
    var dragging = false;
    document.getElementById(container).addEventListener("mousedown", function(event) {
        dragging = true;
    });

    document.getElementById(container).addEventListener("mouseup", function(event) {
        dragging = false;
    });

    var prev_pos = {x: 0, y: 0};
    document.getElementById(container).addEventListener("mousemove", function(event) {
        if (dragging) {
            uniforms.loc.value.x -= (event.offsetX - prev_pos.x) * 0.002 * uniforms.zoom.value;
            uniforms.loc.value.y += (event.offsetY - prev_pos.y) * 0.002 * uniforms.zoom.value;
        }
        prev_pos.x = event.offsetX;
        prev_pos.y = event.offsetY;
    });

    var env = common.init(container, fragmentShader, uniforms);
    common.animate(env);
}
