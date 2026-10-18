export type Pixel = string | null;
export type Sprite = { version: 1; width: number; height: number; frames: Pixel[][]; current: number; fps: number };
export const emptyFrame = (w: number, h: number) => Array<Pixel>(w * h).fill(null);
export const newSprite = (): Sprite => ({ version: 1, width: 32, height: 32, frames: [emptyFrame(32, 32)], current: 0, fps: 8 });
export function parseSprite(value: unknown): Sprite {
  const s = value as Sprite;
  if (!s || s.version !== 1 || !Number.isInteger(s.width) || !Number.isInteger(s.height) || s.width < 4 || s.width > 100 || s.height < 4 || s.height > 100 || !Array.isArray(s.frames) || !s.frames.length || s.frames.length > 32 || !Number.isInteger(s.current) || s.current < 0 || s.current >= s.frames.length || !Number.isInteger(s.fps) || s.fps < 1 || s.fps > 24 || s.frames.some(f => !Array.isArray(f) || f.length !== s.width * s.height || f.some(p => p !== null && (typeof p !== 'string' || !/^#[0-9a-f]{6}$/i.test(p))))) throw new Error('This is not a valid sprite project.');
  return s;
}
export function resizeSprite(s: Sprite, width: number, height: number, anchor: string): Sprite {
  const dx = anchor.includes('right') ? width - s.width : anchor.includes('left') ? 0 : Math.floor((width - s.width) / 2);
  const dy = anchor.includes('bottom') ? height - s.height : anchor.includes('top') ? 0 : Math.floor((height - s.height) / 2);
  const frames = s.frames.map(f => { const next = emptyFrame(width, height); f.forEach((p, i) => { const x = i % s.width + dx, y = Math.floor(i / s.width) + dy; if (x >= 0 && x < width && y >= 0 && y < height) next[y * width + x] = p; }); return next; });
  return { ...s, width, height, frames };
}
export function line(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const result: [number, number][] = [], dx = Math.abs(x1-x0), dy = -Math.abs(y1-y0), sx = x0<x1?1:-1, sy = y0<y1?1:-1; let err=dx+dy;
  while (true) { result.push([x0,y0]); if(x0===x1 && y0===y1) break; const e=2*err; if(e>=dy){err+=dy;x0+=sx;} if(e<=dx){err+=dx;y0+=sy;} } return result;
}
export function hsv(h: number, s: number, v: number) {
  const f = (n: number) => { const k=(n+h/60)%6; return Math.round(255*v*(1-s*Math.max(0,Math.min(k,4-k,1)))).toString(16).padStart(2,'0'); }; return `#${f(5)}${f(3)}${f(1)}`;
}
export const PALETTE = [...Array.from({length:16},(_,i)=>hsv(0,0,i/15)), ...Array.from({length:24},(_,i)=>[hsv(i*15,.66,.3),hsv(i*15,.66,.53),hsv(i*15,.66,.75),hsv(i*15,.42,.83),hsv(i*15,.22,.9),hsv(i*15,1,.4),hsv(i*15,1,.7),hsv(i*15,1,1),hsv(i*15,.7,1),hsv(i*15,.4,1)]).flat()];
export function shade(color: string, amount: number) { return '#'+[1,3,5].map(i=> Math.max(0,Math.min(255,parseInt(color.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join(''); }
export function paintCanvas(canvas: HTMLCanvasElement, frame: Pixel[], w: number, h: number, scale = 1, white = false) {
  canvas.width=w*scale; canvas.height=h*scale; const c=canvas.getContext('2d')!; c.imageSmoothingEnabled=false; if(white){c.fillStyle='#ffffff';c.fillRect(0,0,canvas.width,canvas.height);} frame.forEach((p,i)=>{if(p){c.fillStyle=p;c.fillRect(i%w*scale,Math.floor(i/w)*scale,scale,scale);}});
}
export function download(blob: Blob, name: string) { const url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),10000); }
// GIF89a with a transparent global palette. Reset LZW before the 9-bit
// dictionary grows; this favors a small, dependency-free encoder over compression.
export function encodeGif(s: Sprite, scale: number, white: boolean): Uint8Array {
  const colors = Array.from(new Set(s.frames.flat().filter((p): p is string => p !== null)));
  if(white && !colors.includes('#ffffff')) colors.push('#ffffff');
  const exact = colors.length <= 255;
  const palette = exact ? ['#000000', ...colors] : ['#000000', ...Array.from({length:216},(_,i)=>'#'+[Math.floor(i/36),Math.floor(i/6)%6,i%6].map(v=>(v*51).toString(16).padStart(2,'0')).join('')), ...Array.from({length:39},(_,i)=>hsv(0,0,i/38))];
  const indices = new Map<string,number>(); palette.slice(1).forEach((p,i)=>indices.set(p,i+1));
  const index = (p: Pixel) => { if(!p) return white ? indices.get('#ffffff')! : 0; if(indices.has(p)) return indices.get(p)!; const rgb=[1,3,5].map(i=>parseInt(p.slice(i,i+2),16)); let best=1, distance=Infinity; palette.slice(1).forEach((c,i)=>{const d=rgb.reduce((a,v,j)=>a+(v-parseInt(c.slice(j*2+1,j*2+3),16))**2,0);if(d<distance){distance=d;best=i+1;}});indices.set(p,best);return best; };
  const out: number[] = [], word=(v:number)=>out.push(v&255,v>>8&255), ascii=(v:string)=>{for(const ch of v)out.push(ch.charCodeAt(0));};
  ascii('GIF89a'); const w=s.width*scale,h=s.height*scale; word(w);word(h);out.push(0xf7,0,0);
  for(let i=0;i<256;i++){const p=palette[i]||'#000000';out.push(...[1,3,5].map(n=>parseInt(p.slice(n,n+2),16)));}
  out.push(0x21,0xff,11);ascii('NETSCAPE2.0');out.push(3,1,0,0,0);
  for(const frame of s.frames){out.push(0x21,0xf9,4,white?8:9);word(Math.round(100/s.fps));out.push(0,0,0x2c);word(0);word(0);word(w);word(h);out.push(0,8);
    const data:number[]=[];let bits=0,buffer=0,count=0; const code=(v:number)=>{buffer|=v<<bits;bits+=9;while(bits>=8){data.push(buffer&255);buffer>>>=8;bits-=8;}};code(256);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(count===200){code(256);count=0;}code(index(frame[Math.floor(y/scale)*s.width+Math.floor(x/scale)]));count++;}code(257);if(bits)data.push(buffer&255);
    for(let i=0;i<data.length;i+=255){const block=data.slice(i,i+255);out.push(block.length,...block);}out.push(0);
  }out.push(0x3b);return new Uint8Array(out);
}
export function template(name: string): Sprite {
  const width=16,height=16;
  const frames=Array.from({length:4},(_,phase)=>{const f=emptyFrame(width,height);const bob=phase===1||phase===2?1:0;for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c:Pixel=null;const yy=y-bob;
    if(name==='Slime' && yy>=6&&yy<=13 && ((x-8)**2/36+(yy-11)**2/30<=1)){c=yy>11?'#357b3d':'#70bf6b';if(yy===9&&(x===6||x===10))c='#12172d';}
    if(name==='Ghost' && yy>=3&&yy<=13 && (yy>=7?x>=4&&x<=11:(x-7.5)**2+(yy-7)**2<=16)){c='#dceffd';if(yy===7&&(x===6||x===9))c='#12172d';if(yy===13&&(x+phase)%3===0)c=null;}
    if(name==='Heart' && yy>=4&&yy<=12 && ((yy<7&&((x-5)**2+(yy-6)**2<=9||(x-10)**2+(yy-6)**2<=9))||(yy>=7&&Math.abs(x-7.5)<=12-yy))){c=x<7?'#f69b96':'#ee6a55';}
    if(name==='Coin' && (x-7.5)**2/((phase%2?3:5)**2)+(yy-8)**2/36<=1){c=x<8?'#ffdf65':'#e0aa27';if(x===7&&yy>=5&&yy<=10)c='#fff0d5';}f[y*width+x]=c;
  }return f;});return{version:1,width,height,frames,current:0,fps:6};
}
