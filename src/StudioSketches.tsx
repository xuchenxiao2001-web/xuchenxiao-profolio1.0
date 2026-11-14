import {useEffect,useRef,useState} from 'react';

export function StudioSketches(){
 const [pouring,setPouring]=useState(false);
 const [hopping,setHopping]=useState(false);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 function pour(){if(pouring)return;setPouring(true);timers.current.push(setTimeout(()=>setPouring(false),3200))}
 function hop(){if(hopping)return;setHopping(true)}
 return <>
 <div className="paper-wash" aria-hidden="true"/>
 <svg width="0" height="0" aria-hidden="true" className="absolute"><defs><filter id="pencil-edge" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".065" numOctaves="3" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1"/></filter></defs></svg>
 <button type="button" className={'tea-sketch '+(pouring?'is-pouring':'')} onClick={pour} aria-label="点击茶壶倒水" aria-disabled={pouring} title="点击茶壶，倒一杯茶">
 <svg viewBox="0 0 250 220" role="img" aria-label="红色手绘茶壶和茶杯">
 <g fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" filter="url(#pencil-edge)">
 <g className="teapot">
 <path d="M62 65C35 40 13 63 22 94C27 113 43 116 55 104M57 73C35 53 24 70 32 91C37 102 43 104 53 99"/>
 <path d="M82 51C54 57 49 76 53 102C56 128 77 137 110 135C140 134 157 124 159 104L160 84C171 88 186 87 191 72C194 62 201 59 208 65C204 52 194 48 186 58C176 71 171 71 158 64C153 52 138 48 124 48"/>
 <path d="M77 50C82 42 98 39 102 38L100 30C99 23 111 22 115 28L113 38C127 40 139 43 144 50C126 57 95 58 77 50Z"/>
 <path d="M75 134C80 142 132 143 140 132"/>
 <path d="M64 74C60 87 62 104 69 113" opacity=".45"/>
 <text x="105" y="88" textAnchor="middle" strokeWidth=".4" fill="currentColor" fontFamily="Georgia,serif" fontStyle="italic" fontSize="13">a little</text>
 <text x="107" y="105" textAnchor="middle" strokeWidth=".4" fill="currentColor" fontFamily="Georgia,serif" fontStyle="italic" fontSize="14">inspiration</text>
 </g>
 <g className="water-stream" stroke="#6d9db1" strokeDasharray="3 6"><path d="M207 91Q224 117 207 158"/><path d="M211 94Q231 121 211 158" opacity=".55"/></g>
 <g className="teacup"><ellipse cx="202" cy="163" rx="24" ry="7"/><path d="M178 163L183 190Q201 198 220 189L226 163M225 169C244 165 239 184 222 183"/><path className="tea-fill" d="M183 180Q200 187 221 180" stroke="#6d9db1" strokeWidth="8"/><path d="M178 190C152 198 177 207 207 206C235 206 246 198 227 193"/></g>
 <g className="tea-steam" stroke="#8ca7ad" strokeWidth="1"><path d="M193 150Q185 142 194 133Q200 127 194 120"/><path d="M207 146Q199 138 209 130"/></g>
 </g>
 </svg><span className="sketch-hint">{pouring?'a moment to pause…':'a little tea?'}</span></button>
 <button type="button" onClick={hop} aria-label="点击让三只兔子一起跳离页面" disabled={hopping} title="点击兔子，一起跳走" className={'rabbit-sketch '+(hopping?'is-hopping':'')}>
 <svg className="reference-rabbit-pack" viewBox="0 0 330 220" aria-hidden="true">
 <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
 {/* Three closed, continuous outlines: leaping, stretching and sitting. */}
 <path d="M29 48
 C25 38 30 26 38 19
 C44 11 49 4 53 8
 C58 12 45 29 43 35
 C51 30 60 14 65 18
 C71 23 55 42 48 48
 C48 57 46 62 43 66
 C50 76 61 77 71 82
 C88 89 99 105 101 120
 C108 116 113 119 112 126
 C111 132 105 134 101 132
 C99 145 108 153 107 158
 C105 164 97 160 93 157
 C96 165 100 171 96 174
 C90 179 81 162 77 153
 C67 149 61 143 57 134
 C47 127 39 116 34 105
 C26 101 19 92 16 88
 C10 94 4 91 7 85
 L14 74
 C9 72 4 71 5 66
 C0 65 1 59 8 56
 C12 50 20 47 29 48 Z"/>
 <path d="M158 99
 C156 91 166 84 179 86
 C187 85 193 90 197 96
 L209 105
 C214 109 207 113 200 111
 C203 117 210 120 209 124
 C205 128 199 120 194 117
 C191 128 195 136 202 146
 C211 154 217 166 214 178
 C223 179 225 187 219 191
 C215 194 212 189 209 189
 C207 197 210 201 207 204
 C201 208 196 199 193 195
 C190 199 190 207 185 208
 C179 208 180 196 181 190
 C168 187 159 176 156 165
 C148 154 141 138 139 127
 C133 119 127 108 129 104
 C135 100 140 115 146 119
 C145 111 142 102 145 100
 C149 97 154 107 158 111
 C161 107 161 103 158 99 Z"/>
 <path d="M261 146
 C259 135 266 120 274 114
 C280 108 284 109 283 114
 C282 120 272 128 271 136
 C278 130 288 125 291 130
 C294 135 281 141 279 147
 C288 147 296 150 298 156
 L307 160
 C313 164 306 168 299 167
 C299 174 307 182 309 192
 C314 190 319 193 318 198
 C317 203 312 203 308 201
 C307 210 299 213 287 212
 C277 217 267 213 269 209
 C270 206 276 206 278 204
 C270 201 263 192 262 182
 C255 179 253 172 256 167
 C253 161 255 151 261 146 Z"/>
 </g>
 </svg><span className="sketch-hint">{hopping?'off to explore!':'follow your curiosity ↗'}</span></button>
 <svg className="pencil-spark spark-one" viewBox="0 0 50 65" aria-hidden="true"><path d="M25 3Q24 29 5 32Q24 33 25 60Q27 34 46 32Q26 29 25 3Z" fill="none" stroke="currentColor"/></svg>
 <svg className="pencil-spark spark-two" viewBox="0 0 50 65" aria-hidden="true"><path d="M25 3Q24 29 5 32Q24 33 25 60Q27 34 46 32Q26 29 25 3Z" fill="none" stroke="currentColor"/></svg>
 <svg className="pencil-landscape" viewBox="0 0 1000 45" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30Q30 28 42 16L57 3L68 32Q89 43 106 27L124 25Q132 34 155 28T207 29Q230 40 251 25L274 30Q303 37 332 25M540 28Q565 23 590 29T644 26Q671 17 690 27L713 21Q739 36 766 26T816 26Q840 37 869 21L901 31Q930 35 960 20L1000 9" fill="none" stroke="currentColor" strokeWidth=".8"/></svg>
 <div className="sketch-live sr-only" aria-live="polite">{pouring?'茶壶正在往杯子里倒水。':hopping?'三只兔子已一起跳离页面。':''}</div>
 </>;
}
