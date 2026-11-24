// The Pearl backdrop: nacre light that drifts slowly over a pearl-white ground
// (black pearl in dark mode), a pearl pinned top-right with ripple rings, and
// a small ripple bottom-left. Subjects stay in the corners, clear of the text.
export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.base{fill:#f3efec}
.sheen{opacity:.55}
.ln{stroke:#8a6fb5}
.pl{display:inline}
.pd{display:none}
@media (prefers-color-scheme: dark){
.base{fill:#0f0f13}
.sheen{opacity:.32}
.ln{stroke:#c9b8e6}
.pl{display:none}
.pd{display:inline}
}
.d1{animation:d1 70s ease-in-out infinite}
.d2{animation:d2 90s ease-in-out infinite}
.d3{animation:d3 110s ease-in-out infinite}
.spin{transform-box:fill-box;transform-origin:center;animation:spin 120s linear infinite}
.spinr{transform-box:fill-box;transform-origin:center;animation:spin 160s linear infinite reverse}
.glow{animation:glow 9s ease-in-out infinite}
@keyframes d1{0%,100%{transform:translate(0,0)}50%{transform:translate(160px,90px)}}
@keyframes d2{0%,100%{transform:translate(0,0)}50%{transform:translate(-200px,60px)}}
@keyframes d3{0%,100%{transform:translate(0,0)}50%{transform:translate(120px,-110px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{opacity:.75}50%{opacity:1}}
</style>
<defs>
<radialGradient id="rose"><stop offset="0" stop-color="#f2b8cf"/><stop offset="1" stop-color="#f2b8cf" stop-opacity="0"/></radialGradient>
<radialGradient id="lav"><stop offset="0" stop-color="#bba7ea"/><stop offset="1" stop-color="#bba7ea" stop-opacity="0"/></radialGradient>
<radialGradient id="mint"><stop offset="0" stop-color="#a8e3d2"/><stop offset="1" stop-color="#a8e3d2" stop-opacity="0"/></radialGradient>
<radialGradient id="cream"><stop offset="0" stop-color="#f6e2b8"/><stop offset="1" stop-color="#f6e2b8" stop-opacity="0"/></radialGradient>
<radialGradient id="pearlL" cx="38%" cy="32%" r="70%">
<stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#f4eef2"/><stop offset=".7" stop-color="#ddd0e0"/><stop offset="1" stop-color="#bfb0c8"/>
</radialGradient>
<radialGradient id="pearlD" cx="38%" cy="32%" r="70%">
<stop offset="0" stop-color="#b7c9c4"/><stop offset=".25" stop-color="#5b6170"/><stop offset=".7" stop-color="#2a2833"/><stop offset="1" stop-color="#15141b"/>
</radialGradient>
<linearGradient id="nacre" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#f2b8cf" stop-opacity=".55"/><stop offset=".5" stop-color="#a8e3d2" stop-opacity=".35"/><stop offset="1" stop-color="#bba7ea" stop-opacity=".55"/>
</linearGradient>
</defs>
<rect class="base" width="1600" height="1000"/>
<g class="sheen">
<circle class="d1" cx="300" cy="200" r="520" fill="url(#rose)"/>
<circle class="d2" cx="1300" cy="750" r="560" fill="url(#lav)"/>
<circle class="d3" cx="900" cy="150" r="440" fill="url(#mint)"/>
<circle class="d1" cx="200" cy="900" r="420" fill="url(#cream)"/>
</g>
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMaxYMin meet">
<g transform="translate(390 130)" fill="none">
<g class="spinr ln" stroke-opacity=".22"><circle r="150" stroke-width="1" stroke-dasharray="1 7"/></g>
<g class="spin ln" stroke-opacity=".28"><circle r="118" stroke-width="1.5" stroke-dasharray="90 40 10 40"/></g>
<circle class="ln" r="88" stroke-opacity=".3" stroke-width="1"/>
<g class="pl"><circle r="58" fill="url(#pearlL)"/></g>
<g class="pd"><circle r="58" fill="url(#pearlD)"/></g>
<circle r="58" fill="url(#nacre)" class="glow"/>
<ellipse cx="-18" cy="-22" rx="16" ry="10" fill="#ffffff" fill-opacity=".55" transform="rotate(-30 -18 -22)"/>
</g>
</svg>
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMinYMax meet">
<g transform="translate(100 430)" fill="none">
<g class="pl"><circle r="14" fill="url(#pearlL)"/></g>
<g class="pd"><circle r="14" fill="url(#pearlD)"/></g>
<circle r="14" fill="url(#nacre)"/>
<circle class="ln" r="34" stroke-opacity=".3" stroke-width="1"/>
<g class="spin ln" stroke-opacity=".22"><circle r="56" stroke-width="1" stroke-dasharray="40 16"/></g>
<g class="spinr ln" stroke-opacity=".15"><circle r="80" stroke-width="1" stroke-dasharray="1 6"/></g>
</g>
</svg>
</svg>`
