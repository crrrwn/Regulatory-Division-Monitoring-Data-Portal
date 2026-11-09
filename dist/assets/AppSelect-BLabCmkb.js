import{r as p,j as s,b as P}from"./react-vendor-BKxfhMu_.js";function H({options:y=[],groups:i=null,value:f="",onChange:b,placeholder:g="Select...",className:$="",disabled:j=!1,leftIcon:S,openUpward:E=!1,"aria-label":R}){const[r,m]=p.useState(!1),k=224,x=2,[c,z]=p.useState({top:0,bottom:void 0,left:0,width:0,openUpward:!1}),u=p.useRef(null),h=p.useRef(null),v=(i?i.flatMap(e=>e.options||[]):y).find(e=>String(e.value)===String(f)),L=v?v.label:g,w=()=>{if(u.current){const e=u.current.getBoundingClientRect(),a=window.innerHeight-e.bottom-x,t=E||a<k&&e.top>a,n=t?void 0:e.bottom+x,l=t?window.innerHeight-e.top+x:void 0;z({top:n,bottom:l,left:e.left,width:e.width,openUpward:t})}};p.useEffect(()=>{if(!r)return;w();const e=t=>{var n,l,d,o;(n=u.current)!=null&&n.contains(t.target)||(d=(l=t.target).closest)!=null&&d.call(l,"[data-app-select-panel]")||((o=h.current)==null||o.focus(),m(!1))},a=()=>w();return window.addEventListener("scroll",a,!0),window.addEventListener("resize",a),document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e),window.removeEventListener("scroll",a,!0),window.removeEventListener("resize",a)}},[r]);const N=e=>{var a;e.disabled||(b==null||b(e.value),(a=h.current)==null||a.focus(),m(!1))},O=s.jsx("div",{"data-app-select-panel":!0,role:"listbox","aria-hidden":!r,...r?{}:{inert:""},className:r?"app-select-panel-open":"app-select-panel-closed",style:{zIndex:99999,position:"fixed",...c.openUpward?{bottom:c.bottom}:{top:c.top},left:c.left,width:Math.max(c.width,140),minWidth:140,background:"white",border:"2px solid #e8e0d4",borderRadius:"0.75rem",overflow:"hidden",boxShadow:"0 20px 25px rgba(30, 77, 43, 0.12)"},children:s.jsx("div",{className:`max-h-56 overflow-y-auto custom-scrollbar ${i?"py-1":"py-1.5"}`,children:i?i.map((e,a)=>s.jsxs("div",{className:"pt-1 first:pt-0",children:[s.jsx("div",{className:"px-3 py-1.5 text-[10px] font-black text-[#5c7355] uppercase tracking-wider sticky top-0 bg-[#faf8f5] border-b border-[#e8e0d4]/60 z-10",children:e.sectionLabel}),(e.options||[]).map((t,n)=>{const l=String(t.value)===String(f),d=t.value===""||t.value==null,o=t.disabled===!0;return s.jsx("button",{type:"button",role:"option","aria-selected":l,"aria-disabled":o,onClick:()=>N(t),disabled:o,style:r?{animationDelay:`${(a*20+n)*25}ms`}:void 0,className:`
                      app-select-option w-full text-left px-4 py-2 text-sm font-semibold
                      transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]
                      ${o?"text-[#8a857c] opacity-60 cursor-not-allowed":""}
                      ${!o&&d?"text-[#8a857c] hover:bg-[#faf8f5] hover:text-[#5c7355]":""}
                      ${!o&&!d?"text-[#1e4d2b] hover:bg-[#f0f5ee] hover:text-[#153019] hover:translate-x-0.5 active:scale-[0.99]":""}
                      ${l?"bg-[#f0f5ee]":""}
                    `,children:t.label},t.value??"empty")})]},a)):y.map((e,a)=>{const t=String(e.value)===String(f),n=e.value===""||e.value==null;return s.jsx("button",{type:"button",role:"option","aria-selected":t,onClick:()=>N(e),style:r?{animationDelay:`${a*35}ms`}:void 0,className:`
                  app-select-option w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1e4d2b]
                  transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]
                  ${n?"text-[#8a857c] hover:bg-[#faf8f5] hover:text-[#5c7355]":"hover:bg-[#f0f5ee] hover:text-[#153019]"}
                  ${t?"bg-[#f0f5ee]":""}
                  hover:translate-x-0.5 active:scale-[0.99]
                `,children:e.label},e.value??"empty")})})});return s.jsxs(s.Fragment,{children:[s.jsx("div",{ref:u,className:`relative ${$}`,children:s.jsxs("button",{ref:h,type:"button",disabled:j,"aria-haspopup":"listbox","aria-expanded":r,"aria-label":R||g,onClick:()=>{j||(r||w(),m(e=>!e))},className:`
            w-full flex items-center justify-between gap-2
            py-2.5 pr-10 min-h-[44px] pl-3 sm:pl-4
            bg-white border-2 border-[#e8e0d4] rounded-xl
            text-left text-sm font-semibold text-[#1e4d2b]
            transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)]
            hover:border-[#1e4d2b]/50 hover:bg-[#faf8f5] hover:shadow-md hover:shadow-[#1e4d2b]/10
            focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none
            active:scale-[0.99]
            ${r?"app-select-trigger-open":""}
            ${v?"":"text-[#8a857c]"}
          `,children:[s.jsxs("span",{className:"flex items-center gap-2 min-w-0",children:[S&&s.jsx("span",{className:"shrink-0 flex items-center justify-center text-[#5c7355] transition-transform duration-300 w-6",children:S}),s.jsx("span",{className:"truncate",children:L})]}),s.jsx("span",{className:`absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-[#1e4d2b] transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${r?"rotate-180":""}`,"aria-hidden":!0,children:s.jsx("iconify-icon",{icon:"mdi:chevron-down",width:"20"})})]})}),P.createPortal(O,document.body)]})}export{H as A};
