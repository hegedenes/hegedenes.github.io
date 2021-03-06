export function init(container, fragmentShader, uniforms) {
    var env = {};
    env.camera = new THREE.Camera();
    env.camera.position.z = 1;
    env.scene = new THREE.Scene();
    
    var containerElement = document.getElementById(container);

    var vertexShader = `
        uniform float time;
        void main()	{
            gl_Position = vec4( position, 1.0 );
        }`;
        
    env.uniforms = uniforms;
    env.uniforms.resolution = { type: "v2", value: new THREE.Vector2(containerElement.clientWidth, containerElement.clientWidth) };

    var material = new THREE.ShaderMaterial({
        uniforms: env.uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    env.scene.add(mesh);

    env.renderer = new THREE.WebGLRenderer();
    env.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    containerElement.appendChild(env.renderer.domElement);

    env.renderer.setSize(containerElement.clientWidth, containerElement.clientWidth);
    window.addEventListener("resize", function() {
        env.renderer.setSize(containerElement.clientWidth, containerElement.clientWidth);
    });

    env.startTime = Date.now();
    return env;
}

export function animate(env) {
    env.renderer.render(env.scene, env.camera);

    requestAnimationFrame(function() {
        animate(env);
    });
}
