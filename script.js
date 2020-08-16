
"use strict";
// Port from Shadertoy to THREE.js: https://www.shadertoy.com/view/4sG3WV
// var VERTEX_SHADER = "\n    varying vec2 vUv;\n    \n    void main() {\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n    }\n";
// var BUFFER_A_FRAG = "\n    uniform vec4 iMouse;\n    uniform sampler2D iChannel0;\n    uniform sampler2D iChannel1;\n    uniform vec2 iResolution;\n    uniform float iFrame;\n    varying vec2 vUv;\n    \n\n  vec4 circle(vec2 uv, vec2 pos, float rad, vec3 color) {\n    float d = length(pos - uv) - rad;\n    float t = clamp(d, 0.0, 1.0);\n    return vec4(color, 1.0 - t);\n  }\nvoid getVal(vec2 p, out vec2 val, out vec2 laplacian) {\n  vec2 r = iResolution.xy;\n  vec2 uv = p / r;\n  vec2 n = p + vec2(0.0, 1.0);\n  vec2 ne = p + vec2(1.0, 1.0);\n  vec2 nw = p + vec2(-1.0, 1.0);\n  vec2 e = p + vec2(1.0, 0.0);\n  vec2 s = p + vec2(0.0, -1.0);\n  vec2 se = p + vec2(1.0, -1.0);\n  vec2 sw = p + vec2(-1.0, -1.0);\n  vec2 w = p + vec2(-1.0, 0.0);\n\n  val = texture2D(iChannel0, uv).xy;\n    \n  //3x3 convolution with center weight -1, adjacent neighbors .2, and diagonals .05\n  laplacian = texture2D(iChannel0, n / r).xy * 0.2;\n  laplacian += texture2D(iChannel0, e / r).xy * 0.2;\n  laplacian += texture2D(iChannel0, s / r).xy * 0.2;\n  laplacian += texture2D(iChannel0, w / r).xy * 0.2;\n  laplacian += texture2D(iChannel0, nw / r).xy * 0.05;\n  laplacian += texture2D(iChannel0, ne / r).xy * 0.05;\n  laplacian += texture2D(iChannel0, sw / r).xy * 0.05;\n  laplacian += texture2D(iChannel0, se / r).xy * 0.05;\n  laplacian += -1.0 * val;   \n}\n    float lineDist(vec2 p, vec2 start, vec2 end, float width) {\n        vec2 dir = start - end;\n        float lngth = length(dir);\n        dir /= lngth;\n        vec2 proj = max(0.0, min(lngth, dot((start - p), dir))) * dir;\n        return length( (start - p) - proj ) - (width / 2.0);\n    }\n    \n    void main() {\n        vec2 uv = vUv;\n\n\n    vec3 color = vec3(0.0);\n\n\n\tfloat Da, Db;\n  vec2 mo = iMouse.xy / iResolution.xy;\n    if (iFrame > 2.) {\n     \n      \n\nif (length(uv-mo) < .04){\n \t\tvec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo)); \n         color = m.xyz;\n     }\nelse{\n   vec2 laplacian;\n    \tvec3 val = texture2D(iChannel0, uv).xyz;\n        \n        float AB2 =  val.x * val.y * val.y;\n    \tgetVal(gl_FragCoord.xy, val.xy, laplacian);\n\nfloat f, k;\n        vec2 center = iResolution.xy * .5;\n\t\tfloat radius = 0.5 * iResolution.y;\n\n    \tif ( length(center-gl_FragCoord.xy) < 205.){\n            Da = 1.;\n            Db = .9;\n        \tf = .02;\n            k = .05;\n        }\n        else{\n            Da = 1.;\n            Db = .5;\n            f = .03;\n            k = .06;\n        }\n     \n/*k = ~.05-.09\nF = ~.012-.04*/\nfloat a = Da * laplacian.x - AB2 + f * (1.0 - val.x);\nfloat b = Db * laplacian.y + AB2 - (k + f) * val.y;\nvec2 rxn = vec2(a,b);\nfloat timestep= 1.0;\n  color = vec3(val.xy + rxn * .75, 1.);\n}\n gl_FragColor = vec4(color.xy,1.,1.0);\n\n\n     }\n}\n\n";
// var BUFFER_B_FRAG = "\n    uniform vec4 iMouse;\n    uniform sampler2D iChannel0;\n    uniform vec3 iResolution;\n    varying vec2 vUv;\n    \n  \n    \n    \n    void main( ) {\n    \n        vec2 uv = vUv;// / iResolution.xy;\n      \n        gl_FragColor = vec4(texture2D(iChannel0,uv).rgb,1.0);\n    }\n";
// var BUFFER_C_FRAG = "\n    uniform vec4 iMouse;\n    uniform sampler2D iChannel0;\n    uniform vec3 iResolution;\n    varying vec2 vUv;\n    \n  \n    \n    \n    void main( ) {\n    \n        vec2 uv = vUv;// / iResolution.xy;\n      \n        gl_FragColor = vec4(texture2D(iChannel0,uv).rgb,1.0);\n    }\n";
// var BUFFER_FINAL_FRAG = "\nuniform vec4 iMouse;\n    uniform sampler2D iChannel0;\n    uniform sampler2D iChannel1;\nuniform vec3 iResolution;\n    varying vec2 vUv;\n    \n    void main() {\n        vec2 uv = vUv;\n     vec2 pixelSize = 1. / iResolution.xy;\n     vec2 aspect = vec2(1.,iResolution.y/iResolution.x);\n\n\n \tvec2 lightSize=vec2(4.);\n\n//     // get the gradients from the blurred image\n \tvec2 d = pixelSize*2.;\n \tvec4 dx = (texture2D(iChannel1, uv + vec2(1,0)*d) - texture2D(iChannel1, uv - vec2(1,0)*d))*0.5;\n\tvec4 dy = (texture2D(iChannel1, uv + vec2(0,1)*d) - texture2D(iChannel1, uv - vec2(0,1)*d))*0.5;\n\t// add the pixel gradients\n\td = pixelSize*1.;\n\tdx += texture2D(iChannel0, uv + vec2(1,0)*d) - texture2D(iChannel0, uv - vec2(1,0)*d);\n\tdy += texture2D(iChannel0, uv + vec2(0,1)*d) - texture2D(iChannel0, uv - vec2(0,1)*d);\n\n\tvec2 displacement = vec2(dx.x,dy.x)*lightSize; // using only the red gradient as displacement vector\n\tfloat light = pow(max(1.-distance(0.5+(uv-0.5)*aspect*lightSize + displacement,0.5+(iMouse.xy*pixelSize-0.5)*aspect*lightSize),0.),4.);\n\n\t// recolor the red channel\n\tvec4 rd = vec4(texture2D(iChannel0,uv+vec2(dx.x,dy.x)*pixelSize*8.).x)*vec4(0.7,1.5,2.0,1.0)- vec4(0.3,1.0,1.0,1.0);\n\n    // and add the light map\n  gl_FragColor = mix(rd,vec4(8.0,6.,2.,1.), light*0.75*vec4(texture2D(iChannel0,uv+vec2(dx.x,dy.x)*pixelSize*8.).x)); \n\t\n        vec2 a = texture2D(iChannel1,uv).xy;\n        gl_FragColor = vec4(texture2D(iChannel0,a).rgb,1.0);\n    }\n";


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


  vec4 circle(vec2 uv, vec2 pos, float rad, vec3 color) {
    float d = length(pos - uv) - rad;
    float t = clamp(d, 0.0, 1.0);
    return vec4(color, 1.0 - t);
  }


void getVal(vec2 p, out vec2 val, out vec2 laplacian) {
  vec2 r = iResolution.xy;
  vec2 uv = p / r;
  vec2 n = p + vec2(0.0, 1.0);
  vec2 ne = p + vec2(1.0, 1.0);
  vec2 nw = p + vec2(-1.0, 1.0);
  vec2 e = p + vec2(1.0, 0.0);
  vec2 s = p + vec2(0.0, -1.0);
  vec2 se = p + vec2(1.0, -1.0);
  vec2 sw = p + vec2(-1.0, -1.0);
  vec2 w = p + vec2(-1.0, 0.0);

  val = texture2D(iChannel0, uv).xy;

  //3x3 convolution with center weight -1, adjacent neighbors .2, and diagonals .05
  laplacian = texture2D(iChannel0, n / r).xy * 0.2;
  laplacian += texture2D(iChannel0, e / r).xy * 0.2;
  laplacian += texture2D(iChannel0, s / r).xy * 0.2;
  laplacian += texture2D(iChannel0, w / r).xy * 0.2;
  laplacian += texture2D(iChannel0, nw / r).xy * 0.05;
  laplacian += texture2D(iChannel0, ne / r).xy * 0.05;
  laplacian += texture2D(iChannel0, sw / r).xy * 0.05;
  laplacian += texture2D(iChannel0, se / r).xy * 0.05;
  laplacian += -1.0 * val;
}
    float lineDist(vec2 p, vec2 start, vec2 end, float width) {
        vec2 dir = start - end;
        float lngth = length(dir);
        dir /= lngth;
        vec2 proj = max(0.0, min(lngth, dot((start - p), dir))) * dir;
        return length( (start - p) - proj ) - (width / 2.0);
    }

    void main() {
        vec2 uv = vUv;


    vec3 color = vec3(0.0);


	float Da, Db;
  vec2 mo = iMouse.xy / iResolution.xy;
  vec2 mo1 = iMouse2.xy / iResolution.xy;
  vec2 mo2 = iMouse3.xy / iResolution.xy;
  vec2 mo3 = iMouse4.xy / iResolution.xy;
  vec2 mo4 = iMouse5.xy / iResolution.xy;


    if (iFrame > 10.) {



if (length(uv-mo) < fiMouse){
 		vec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo)*2.);
         color = m.xyz;
     }
else if (length(uv-mo1) < fiMouse1){
vec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo));
color = m.xyz;
}
else if (length(uv-mo2) < fiMouse2){
vec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo));
color = m.xyz;
}
else if (length(uv-mo3) < fiMouse3){
vec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo));
color = m.xyz;
}
else if (length(uv-mo4) < fiMouse4){
vec4 m = mix(vec4(0,1,0,1), vec4(1,0,0,1), length(uv-mo));
   color = m.xyz;
}
else{
   vec2 laplacian;
    	vec3 val = texture2D(iChannel0, uv).xyz;

        float AB2 =  val.x * val.y * val.y;
    	getVal(gl_FragCoord.xy, val.xy, laplacian);

float f, k;
        vec2 center = iResolution.xy * .5;
		float radius = 0.5 * iResolution.y;
    vec4 c = texture2D(iChannel1,uv);
float rr= max(min(c.r, c.g), min(max(c.r, c.g), c.b)); // https://github.com/Chlumsky/msdfgen



f = (rr * 1.1)* .09545;
k = (rr * 1.1 )* .052;

            Da = 1.;
            Db = .5;
          //  f = .0545;
          //   k = .062;


/*k = ~.05-.09
F = ~.012-.04*/
//f=.0545, k=.062
float a = Da * laplacian.x - AB2 + f * (1.0 - val.x);
float b = Db * laplacian.y + AB2 - (k + f) * val.y;
vec2 rxn = vec2(a,b);
float timestep= 1.0;
  color = vec3(val.xy + rxn * 1., 1.);
}
 gl_FragColor = vec4(color.xyz,1.);


     }
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
     vec2 pixelSize = 1. / iResolution.xy;
     vec2 aspect = vec2(1.,iResolution.y/iResolution.x);


 	vec2 lightSize=vec2(4.);

//     // get the gradients from the blurred image
 	vec2 d = pixelSize*2.;
 	vec4 dx = (texture2D(iChannel1, uv + vec2(1,0)*d) - texture2D(iChannel1, uv - vec2(1,0)*d))*0.5;
	vec4 dy = (texture2D(iChannel1, uv + vec2(0,1)*d) - texture2D(iChannel1, uv - vec2(0,1)*d))*0.5;
	// add the pixel gradients
	d = pixelSize*1.;
	dx += texture2D(iChannel0, uv + vec2(1,0)*d) - texture2D(iChannel0, uv - vec2(1,0)*d);
	dy += texture2D(iChannel0, uv + vec2(0,1)*d) - texture2D(iChannel0, uv - vec2(0,1)*d);

	vec2 displacement = vec2(dx.x,dy.x)*lightSize; // using only the red gradient as displacement vector
	float light = pow(max(1.-distance(0.5+(uv-0.5)*aspect*lightSize + displacement,0.5+(iMouse.xy*pixelSize-0.5)*aspect*lightSize),0.),4.);

	// recolor the red channel
	vec4 rd = vec4(texture2D(iChannel0,uv+vec2(dx.x,dy.x)*pixelSize*8.).x)*vec4(0.7,1.5,2.0,1.0)- vec4(0.3,1.0,1.0,1.0);

    // and add the light map
  gl_FragColor = mix(rd,vec4(8.0,6.,2.,1.), light*0.75*vec4(texture2D(iChannel0,uv+vec2(dx.x,dy.x)*pixelSize*8.).x));

        vec2 a = texture2D(iChannel1,uv).xy;
     gl_FragColor = vec4(texture2D(iChannel1,uv).rgb,1.0);
   float r = texture2D(iChannel1, uv).r;
//vec4 aa=texture2D(iChannel1,uv);
    //  gl_FragColor = vec4(smoothstep(0.1,.2,vec4(r)));
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
        this.width = window.innerWidth  / 2;
        this.height =  window.innerHeight / 2;

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
        this.renderer.setSize(this.width, this.height);
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
        var channel0 = this.loader.load('https://i.imgur.com/oQhh8ZG.jpg');

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
