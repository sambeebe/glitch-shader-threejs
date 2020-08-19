"use strict";

var VERTEX_SHADER = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`

var BUFFER_A_FRAG = `
    uniform vec4 iMouse;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform vec2 iResolution;
    uniform float iFrame;

    varying vec2 vUv;
    void main( ) {
      vec2 uv = vUv;
      vec3 d = texture2D(iChannel0, uv).rgb;
      d *= iMouse.x*.001;
      vec3 e = texture2D(iChannel1, uv + d.r).rgb;
      vec3 f = texture2D(iChannel1, uv + d.g).rgb;
      vec3 g = texture2D(iChannel1, uv + d.b).rgb;
      vec3 h = vec3(e.r,f.g,g.b);
      gl_FragColor = vec4(h,1.);
    }
`

var BUFFER_B_FRAG = `
    uniform vec4 iMouse;
    uniform sampler2D iChannel0;
    uniform vec3 iResolution;
    varying vec2 vUv;
    void main( ) {
        vec2 uv = vUv;
        gl_FragColor = vec4(texture2D(iChannel0,uv).rgb,1.0);
    }
`

var BUFFER_FINAL_FRAG = `
    uniform vec4 iMouse;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform vec3 iResolution;
    varying vec2 vUv;
    void main() {
        vec2 uv = vUv;
        gl_FragColor = vec4(texture2D(iChannel1,uv).rgb,1.0);
    }
`



var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.width = window.innerWidth ;
        this.height =  window.innerHeight;
        this.video = document.getElementById( 'video' );
        // this.video.src = "https://i.imgur.com/5iR9iHf.mp4";
        // this.video.load(); // must call after setting/changing source
        // this.video.play();
        this.videoTexture = new THREE.VideoTexture( video );
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;

        this.renderer = new THREE.WebGLRenderer();
        this.loader = new THREE.TextureLoader();
        this.mousePosition = new THREE.Vector4(400,400,0,0);

        this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.counter = 0;
        this.targetA = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.targetB = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.targetC = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.renderer.setSize(this.width/2 , this.height /2 );
        this.renderer.setPixelRatio(2);

        document.body.appendChild(this.renderer.domElement);
        document.getElementById('play-button').addEventListener('click',  function () {video.play(); });
          document.getElementById('stop-button').addEventListener('click', function () { video.pause(); });

        this.renderer.domElement.addEventListener('mousedown', function () {
            this.mousePosition.setZ(1)
            this.counter = 0
        });
        this.renderer.domElement.addEventListener('mouseup', function () {
            this.mousePosition.setZ(0)
        });
        this.renderer.domElement.addEventListener('mousemove', function (event) {
            _this.mousePosition.setX(event.clientX);
            _this.mousePosition.setY(_this.height - event.clientY);
        });
    }
    App.prototype.start = function () {

        var resolution = new THREE.Vector3(this.width, this.height, window.devicePixelRatio);
        // var channel0 = this.loader.load('https://i.imgur.com/Zd3BchG.jpeg');
        var channel0 = this.videoTexture;

        this.loader.setCrossOrigin('');
        this.bufferA = new BufferShader(BUFFER_A_FRAG, {
            iFrame: { value: 0 },
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            fiMouse: { value: this.fmousePosition },
            iChannel0: { value: null },
            iChannel1: { value: channel0 },

        });
        this.bufferB = new BufferShader(BUFFER_B_FRAG, {
            iFrame: { value: 0 },
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            iChannel0: { value: null },


        });
        this.bufferImage = new BufferShader(BUFFER_FINAL_FRAG, {
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            iChannel0: { value: channel0 },
            iChannel1: { value: null }
        });
        this.animate();
    };
    App.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            _this.bufferA.uniforms['iFrame'].value = _this.counter++;
            _this.bufferA.uniforms['iChannel0'].value = _this.targetB.readBuffer.texture;
            _this.targetA.render(_this.bufferA.scene, _this.orthoCamera);
            _this.bufferB.uniforms['iChannel0'].value = _this.targetA.readBuffer.texture;
            _this.targetB.render(_this.bufferB.scene, _this.orthoCamera);
            _this.bufferImage.uniforms['iChannel1'].value = _this.targetA.readBuffer.texture;
            _this.targetC.render(_this.bufferImage.scene, _this.orthoCamera, true);
            _this.animate();
        });
    };
    return App;
}());
var BufferShader = /** @class */ (function () {
    function BufferShader(fragmentShader, uniforms) {
        if (uniforms === void 0) { uniforms = {}; }
        this.uniforms = uniforms;
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragmentShader,
            vertexShader: VERTEX_SHADER,
            uniforms: uniforms
        });
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material));
    }
    return BufferShader;
}());
var BufferManager = /** @class */ (function () {
    function BufferManager(renderer, _a) {
        var width = _a.width, height = _a.height;
        this.renderer = renderer;
        this.readBuffer = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            stencilBuffer: false
        });
        this.writeBuffer = this.readBuffer.clone();
    }
    BufferManager.prototype.swap = function () {
        var temp = this.readBuffer;
        this.readBuffer = this.writeBuffer;
        this.writeBuffer = temp;
    };
    BufferManager.prototype.render = function (scene, camera, toScreen) {
        if (toScreen === void 0) { toScreen = false; }
        if (toScreen) {
            this.renderer.render(scene, camera);
        }
        else {
            this.renderer.render(scene, camera, this.writeBuffer, true);
        }
        this.swap();
    };
    return BufferManager;
}());
document.addEventListener('DOMContentLoaded', function () {
    (new App()).start();

});
