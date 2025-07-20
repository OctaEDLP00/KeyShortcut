(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const d=`:host {
  --keyboard-font: consolas, monospace;
  --keyboard-weight: 500;
  --keyboard-color-light: white;
  --keyboard-bg-light: #444;
  --keyboard-color-dark: #444;
  --keyboard-bg-dark: white;
  --keyboard-font-size: 1.45rem;
  --keyboard-shadow-light: #444;
  --keyboard-shadow-dark: white;
  --keyboard-shadow-light-press: #444;
  --keyboard-shadow-dark-press: white;

  display: inline-block;
  font-size: var(--keyboard-font-size);
  font-weight: var(--keyboard-weight);
  text-rendering: optimizeLegibility;
}

.shortcut-sequence {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  color: light-dark(var(--keyboard-color-light), var(--keyboard-color-dark));
  font-size: var(--keyboard-font-size);
  line-height: 1;
}

.combo {
  display: inline-flex;
  gap: 0.25rem;
}

kbd {
  display: inline-block;
  padding: 8px 14px;
  margin: 0 0.75px;
  background-color: light-dark(var(--keyboard-bg-light, #e2e5e9), var(--keyboard-bg-dark, #2a2d30));
  border: 1px solid light-dark(#b4b4b4, #444);
  border-top: 2px solid light-dark(#fff, #444);
  border-bottom: 3px solid light-dark(#999, #111);
  border-radius: 6px;
  box-shadow:
    0 3px 0 light-dark(var(--keyboard-shadow-light), var(--keyboard-shadow-dark)),
    0 3px 6px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  user-select: none;
  cursor: default;
  transition:
    transform 0.05s ease,
    box-shadow 0.05s ease;
}

kbd:active {
  transform: translateY(2px);
  box-shadow:
    0 1px 0 light-dark(var(--keyboard-shadow-light), var(--keyboard-shadow-dark)),
    0 1px 2px rgba(0, 0, 0, 0.2);
  border-bottom-width: 1px;
}

kbd:hover {
  filter: brightness(1.1);
}

kbd.pressed {
  transform: translateY(2px);
  box-shadow:
    0 1px 0 light-dark(var(--keyboard-shadow-light-press), var(--keyboard-shadow-dark-press)),
    0 1px 2px rgba(0, 0, 0, 0.2);
  border-bottom-width: 1px;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}
`;class i extends HTMLElement{keys=null;forceMac=!1;pressedKeys=new Set;constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.keys=this.getAttribute("keys")??"Ctrl + T",this.forceMac=this.hasAttribute("mac"),this.render(),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp)}disconnectedCallback(){window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp)}static get observedAttributes(){return["keys","mac"]}attributeChangedCallback(e,t,n){if(t!==n){switch(e){case"keys":this.keys=n;break;case"mac":this.forceMac=this.hasAttribute("mac");break}this.render()}}detectOS(){if(this.forceMac)return"mac";const e=navigator.userAgent.toLowerCase();return/macintosh|mac os x/.test(e)?"mac":/windows nt/.test(e)?"windows":/android/.test(e)?"android":/iphone|ipad|ipod/.test(e)?"ios":/linux/.test(e)?"linux":"unknown"}formatKeys(){const t=this.detectOS()==="mac",n=this.keys;return n?n.split(/\s+/).map(s=>`<span class="combo">${s.split("+").map(o=>{switch(o){case"win":return"⊞";case"ctrl":return t?"⌘":"Ctrl";case"cmd":return"⌘";case"alt":return t?"⌥":"Alt";case"shift":return"Shift";default:return o.toUpperCase()}}).map(o=>`<kbd data-key="${o}">${o}</kbd>`).join("")}</span>`).join("<span>&nbsp;</span>"):""}normalizeKey(e){console.log(e);const t=navigator.platform.includes("Mac");switch(e){case"Control":return t?"⌘":"Ctrl";case"Meta":return t?"⌘":"Win";case"Alt":return t?"⌥":"Alt";case"Shift":return"Shift";case" ":return"Space";default:return e.length===1?e.toUpperCase():e}}handleKeyDown=({key:e})=>{console.log("key",e);const t=this.normalizeKey(e);this.pressedKeys.add(t),this.highlightKeys(),["Alt","Ctrl","Shift","⌥","⌘","Win"].includes(e)&&setTimeout(()=>{this.pressedKeys.delete(e),this.highlightKeys()},150)};handleKeyUp=({key:e})=>{const t=this.normalizeKey(e);this.pressedKeys.delete(t),this.highlightKeys()};highlightKeys(){(Array.from(this.shadowRoot.querySelectorAll("kbd"))??[]).map(t=>{const n=t.getAttribute("data-key");n&&this.pressedKeys.has(n)?t.classList.add("pressed"):t.classList.remove("pressed")})}static get styles(){return d}render(){this.shadowRoot.innerHTML=`
      <style>${i.styles}</style>
      <div class="shortcut-sequence">${this.formatKeys()}</div>
    `}}customElements.define("key-shortcut",i);
