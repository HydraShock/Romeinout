import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERTEX_SHADER_GL2 = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER_GL2 = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform vec2 uMouse;

out vec4 fragColor;

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){ \
  int index=0; \
  for(int i=0;i<2;i++){ \
    ColorStop currentColor=colors[i]; \
    bool inBetween=currentColor.position<=factor; \
    index=int(mix(float(index),float(i),float(inBetween))); \
  } \
  ColorStop currentColor=colors[index]; \
  ColorStop nextColor=colors[index+1]; \
  float range=nextColor.position-currentColor.position; \
  float lerpFactor=(factor-currentColor.position)/range; \
  finalColor=mix(currentColor.color,nextColor.color,lerpFactor); \
}

void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  vec2 m = uMouse / uResolution;

  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float noise = snoise(vec2(uv.x * 3.0, uTime * 0.2 + m.x * 0.5));
  float waveHeight = uv.y - (noise * 0.15 * uAmplitude);

  float fade = smoothstep(0.0, 0.4, uv.y);
  waveHeight = mix(uv.y, waveHeight, fade);

  float core = 0.5;
  float intensity = smoothstep(core - uBlend, core + uBlend, waveHeight);

  vec3 auroraColor = intensity * rampColor;
  float auroraAlpha = intensity;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const VERTEX_SHADER_GL1 = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER_GL1 = `
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform vec2 uMouse;

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){ \
  int index=0; \
  for(int i=0;i<2;i++){ \
    ColorStop currentColor=colors[i]; \
    bool inBetween=currentColor.position<=factor; \
    index=int(mix(float(index),float(i),float(inBetween))); \
  } \
  ColorStop currentColor=colors[index]; \
  ColorStop nextColor=colors[index+1]; \
  float range=nextColor.position-currentColor.position; \
  float lerpFactor=(factor-currentColor.position)/range; \
  finalColor=mix(currentColor.color,nextColor.color,lerpFactor); \
}

void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  vec2 m = uMouse / uResolution;

  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float noise = snoise(vec2(uv.x * 3.0, uTime * 0.2 + m.x * 0.5));
  float waveHeight = uv.y - (noise * 0.15 * uAmplitude);

  float fade = smoothstep(0.0, 0.4, uv.y);
  waveHeight = mix(uv.y, waveHeight, fade);

  float core = 0.5;
  float intensity = smoothstep(core - uBlend, core + uBlend, waveHeight);

  vec3 auroraColor = intensity * rampColor;
  float auroraAlpha = intensity;

  gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export default function AuroraShader({
  colorStops = ['#5227FF', '#7cff67', '#5227FF'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  className = '',
}) {
  const containerRef = useRef(null);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, window.innerWidth <= 768 ? 1.4 : 2),
    });
    const gl = renderer.gl;
    const isWebGl2 = Boolean(renderer.isWebgl2);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    let program;
    try {
      program = new Program(gl, {
        vertex: isWebGl2 ? VERTEX_SHADER_GL2 : VERTEX_SHADER_GL1,
        fragment: isWebGl2 ? FRAGMENT_SHADER_GL2 : FRAGMENT_SHADER_GL1,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uBlend: { value: blend },
          uResolution: { value: [container.offsetWidth || 1, container.offsetHeight || 1] },
          uColorStops: {
            value: colorStops.map((hex) => {
              const c = new Color(hex);
              return [c.r, c.g, c.b];
            }),
          },
          uMouse: { value: [0, 0] },
        },
      });
    } catch (error) {
      console.error('AuroraShader init error:', error);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return undefined;
    }

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    const resize = () => {
      const width = container.offsetWidth || 1;
      const height = container.offsetHeight || 1;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const onPointerMove = (event) => {
      mouseTargetRef.current.x = event.clientX;
      mouseTargetRef.current.y = window.innerHeight - event.clientY;
    };

    const onTouchMove = (event) => {
      const touch = event.touches && event.touches[0];
      if (!touch) {
        return;
      }
      mouseTargetRef.current.x = touch.clientX;
      mouseTargetRef.current.y = window.innerHeight - touch.clientY;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    resize();
    mouseTargetRef.current.x = window.innerWidth * 0.5;
    mouseTargetRef.current.y = window.innerHeight * 0.5;
    mouseSmoothRef.current.x = mouseTargetRef.current.x;
    mouseSmoothRef.current.y = mouseTargetRef.current.y;

    let animationId = 0;

    const animate = (time) => {
      animationId = window.requestAnimationFrame(animate);

      mouseSmoothRef.current.x += (mouseTargetRef.current.x - mouseSmoothRef.current.x) * 0.08;
      mouseSmoothRef.current.y += (mouseTargetRef.current.y - mouseSmoothRef.current.y) * 0.08;

      program.uniforms.uTime.value = time * 0.001 * speed;
      program.uniforms.uAmplitude.value = amplitude;
      program.uniforms.uBlend.value = blend;
      program.uniforms.uMouse.value = [mouseSmoothRef.current.x, mouseSmoothRef.current.y];

      renderer.render({ scene: mesh });
    };

    animate(0);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, colorStops, speed]);

  return <div ref={containerRef} className={className} />;
}
