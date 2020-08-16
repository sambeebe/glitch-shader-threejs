
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
uniform vec4 iMouse2;
uniform vec4 iMouse3;
uniform vec4 iMouse4;
uniform vec4 iMouse5;
uniform float fiMouse;
uniform float fiMouse1;
uniform float fiMouse2;
uniform float fiMouse3;
uniform float fiMouse4;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;

    uniform vec2 iResolution;
    uniform float iFrame;
    uniform float kval;
    uniform float fval;
    varying vec2 vUv;
  void main( ) {
  vec2 uv = vUv;// / iResolution.xy;

    vec3 d = texture2D(iChannel0, uv).rgb;


  //  vec3 d = texture(iChannel1, uv).rgb;
	d *= kval;

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

        vec2 uv = vUv;// / iResolution.xy;

        gl_FragColor = vec4(texture2D(iChannel0,uv).rgb,1.0);
    }
`

var BUFFER_C_FRAG = `
    uniform vec4 iMouse;
    uniform sampler2D iChannel0;
    uniform vec3 iResolution;
    varying vec2 vUv;




    void main( ) {

        vec2 uv = vUv;// / iResolution.xy;

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
      var gui = new dat.GUI();
      var newParagraph = document.createElement("p");
      var maxObjectRect;


      //interactive controller
      var options = {
        hostname : "127.0.0.1", // localhost
        port : 8086,
        supported_objects : ["button"]
      };



      var params = {
         kvalval:.4,
         fvalval:.6
      };
      gui.add(params, 'kvalval')
      gui.add(params, 'fvalval')
      var App = /** @class */ (function () {
    function App() {
        var _this = this;
        this.width = window.innerWidth ;
        this.height =  window.innerHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.loader = new THREE.TextureLoader();
        // this.mousePosition = new THREE.Vector4();
        this.mousePosition = new THREE.Vector4(400,400,0,0);
        this.mousePosition1 =new THREE.Vector4(200,400,0,0);
        this.mousePosition2 = new THREE.Vector4(200,400,0,0);
        this.mousePosition3 = new THREE.Vector4();
        this.mousePosition4 = new THREE.Vector4();
        this.fmousePosition = .04;
        this.fmousePosition1 = .04;
        this.fmousePosition2 = .04;
        this.fmousePosition3 = .04;
        this.fmousePosition4 = .04;
        this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);


        // folder.addColor(new ColorGUIHelper(material.cube,'color'),'value') //
          // .name('color')
          // .onChange(animationLoop)

        // this.folder.add(cubeMesh.scale,'x',0.1,1.5) //
        //   .name('scale x')
          // .onChange(animationLoop)

        this.counter = 0;
        this.targetA = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.targetB = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.targetC = new BufferManager(this.renderer, { width: this.width, height: this.height });
        this.renderer.setSize(this.width / 2, this.height / 2 );
    this.renderer.setPixelRatio(2);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.addEventListener('mousedown', function () {
            // this.mousePosition.setZ(1)
            // this.counter = 0
        });
        this.renderer.domElement.addEventListener('mouseup', function () {
            // this.mousePosition.setZ(0)
        });
        this.renderer.domElement.addEventListener('mousemove', function (event) {
            _this.mousePosition.setX(event.clientX);

            _this.mousePosition.setY(_this.height - event.clientY);
        });
    }
    App.prototype.start = function () {

      // folder.addColor(new ColorGUIHelper(material.cube,'color'),'value') //
      //     .name('color')
      //     .onChange(animationLoop)

          // .onChange(animationLoop)
        var resolution = new THREE.Vector3(this.width, this.height, window.devicePixelRatio);
        // var resolution = new THREE.Vector3(2048,1024, 1);

        var channel0 = this.loader.load('https://i.imgur.com/Zd3BchG.jpeg');

        this.loader.setCrossOrigin('');
        this.bufferA = new BufferShader(BUFFER_A_FRAG, {
            iFrame: { value: 0 },
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            iMouse1: { value: this.mousePosition1 },
            iMouse2: { value: this.mousePosition2 },
            iMouse3: { value: this.mousePosition3 },
            iMouse4: { value: this.mousePosition4 },
        fiMouse: { value: this.fmousePosition },
            fiMouse1: { value: this.fmousePosition1 },
            fiMouse2: { value: this.fmousePosition2 },
            fiMouse3: { value: this.fmousePosition3 },
            fiMouse4: { value: this.fmousePosition4 },
            iChannel0: { value: null },
            iChannel1: { value: channel0 },
            kval: {value: 0.03},
            fval: {value: .03}
        });
        this.bufferB = new BufferShader(BUFFER_B_FRAG, {
            iFrame: { value: 0 },
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            iChannel0: { value: null },
            kval: {value: 0.03},
            fval: {value: .04}

        });
        // this.bufferC = new BufferShader(BUFFER_C_FRAG, {
        //     iFrame: { value: 0 },
        //     iResolution: { value: resolution },
        //     iMouse: { value: this.mousePosition },
        //     iChannel0: { value: null }
        // });
        this.bufferImage = new BufferShader(BUFFER_FINAL_FRAG, {
            iResolution: { value: resolution },
            iMouse: { value: this.mousePosition },
            iChannel0: { value: channel0 },
            iChannel1: { value: null }
        });
        this.animate();
    };
    App.prototype.animate = function () {


      // datGui.domElement.id = 'gui'

        var _this = this;
        requestAnimationFrame(function () {
            _this.bufferA.uniforms['iFrame'].value = _this.counter++;
            _this.bufferA.uniforms['iChannel0'].value = _this.targetB.readBuffer.texture;
          //  _this.bufferA.uniforms['iChannel1'].value = _this.targetB.readBuffer.texture;
            _this.bufferA.uniforms['kval'].value = params.kvalval;
            _this.bufferA.uniforms['fval'].value = params.fvalval;
            _this.targetA.render(_this.bufferA.scene, _this.orthoCamera);
            _this.bufferB.uniforms['iChannel0'].value = _this.targetA.readBuffer.texture;
            _this.bufferB.uniforms['kval'].value = params.kvalval;
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
