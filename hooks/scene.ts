// The HUD backdrop: dark field, faint grid, two slow-turning reactor reticles
// pinned to the corners (away from the text column), and a slow scan sweep.
export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.spin{transform-box:fill-box;transform-origin:center;animation:spin 60s linear infinite}
.spinr{transform-box:fill-box;transform-origin:center;animation:spin 90s linear infinite reverse}
.spinf{transform-box:fill-box;transform-origin:center;animation:spin 28s linear infinite}
.breathe{animation:breathe 7s ease-in-out infinite}
.sweep{animation:sweep 18s linear infinite}
.bar{transform-box:fill-box;transform-origin:bottom;animation:bar 9s ease-in-out infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{opacity:.55}50%{opacity:.85}}
@keyframes sweep{from{transform:translateY(-200px)}to{transform:translateY(1200px)}}
@keyframes bar{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
</style>
<defs>
<radialGradient id="bg" cx="50%" cy="45%" r="75%">
<stop offset="0" stop-color="#0a1a28"/><stop offset="1" stop-color="#03070c"/>
</radialGradient>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
<path d="M40 0H0V40" fill="none" stroke="#2ad4ff" stroke-opacity=".06" stroke-width="1"/>
</pattern>
<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2ad4ff" stop-opacity="0"/>
<stop offset=".5" stop-color="#2ad4ff" stop-opacity=".07"/>
<stop offset="1" stop-color="#2ad4ff" stop-opacity="0"/>
</linearGradient>
<radialGradient id="core"><stop offset="0" stop-color="#bff3ff"/><stop offset=".35" stop-color="#2ad4ff" stop-opacity=".6"/><stop offset="1" stop-color="#2ad4ff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="1000" fill="url(#bg)"/>
<rect width="1600" height="1000" fill="url(#grid)"/>
<rect class="sweep" x="0" y="0" width="1600" height="160" fill="url(#scan)"/>
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMaxYMin meet">
<g transform="translate(380 140)" fill="none" stroke="#2ad4ff">
<circle r="34" fill="url(#core)" stroke="none" class="breathe"/>
<circle r="46" stroke-opacity=".5" stroke-width="2"/>
<g class="spinf"><circle r="70" stroke-opacity=".55" stroke-width="3" stroke-dasharray="30 14"/></g>
<g class="spinr"><circle r="100" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="2 6"/></g>
<g class="spin"><circle r="130" stroke-opacity=".35" stroke-width="6" stroke-dasharray="120 60 20 60"/></g>
<g class="spinr"><circle r="165" stroke-opacity=".18" stroke-width="1"/><path d="M0 -175V-155M0 155V175M-175 0H-155M155 0H175" stroke-opacity=".5" stroke-width="2"/></g>
<g class="spinf"><path d="M-195 0A195 195 0 0 1 0 -195" stroke-opacity=".25" stroke-width="2"/></g>
</g>
</svg>
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 520 520" preserveAspectRatio="xMinYMax meet">
<g transform="translate(110 420)" fill="none" stroke="#2ad4ff">
<circle r="10" fill="#2ad4ff" fill-opacity=".5" stroke="none" class="breathe"/>
<g class="spin"><circle r="40" stroke-opacity=".45" stroke-width="2" stroke-dasharray="50 12"/></g>
<g class="spinr"><circle r="62" stroke-opacity=".25" stroke-width="1" stroke-dasharray="4 4"/></g>
<path d="M-80 0H-50M50 0H80M0 -80V-50M0 50V80" stroke-opacity=".4"/>
</g>
<g transform="translate(210 470)" fill="#2ad4ff" fill-opacity=".35">
<rect class="bar" x="0" y="-60" width="8" height="60"/>
<rect class="bar" x="14" y="-60" width="8" height="60" style="animation-delay:-2s"/>
<rect class="bar" x="28" y="-60" width="8" height="60" style="animation-delay:-4s"/>
<rect class="bar" x="42" y="-60" width="8" height="60" style="animation-delay:-6s"/>
<rect class="bar" x="56" y="-60" width="8" height="60" style="animation-delay:-1s"/>
<rect class="bar" x="70" y="-60" width="8" height="60" style="animation-delay:-5s"/>
</g>
<path d="M210 480H300" stroke="#2ad4ff" stroke-opacity=".4"/>
</svg>
</svg>`
