// เก็บโค้ดโครงสร้างหน้าตาของโปรเจกต์เครื่องจำลอง AM 3.12 ตัวเต็ม
const amSimulatorTemplate = `
    <div class="card">
        <div class="chapter-title">3.2 AMPLITUDE MODULATION (AM) - Live Interactive Simulator</div>
        
        <div class="control-panel">
            <div class="panel-title">
                <span>พารามิเตอร์ของระบบ (Input Parameters)</span>
                <button class="btn-reset" onclick="resetToDefaults()">รีเซ็ตเป็นค่าเริ่มต้นตามโจทย์</button>
            </div>
            
            <div class="grid-controls">
                <div class="grid-row">
                    <div class="grid-cell">
                        <div class="control-group">
                            <label>Message Amp (Am): <span id="Am-val" class="value-display">10</span></label>
                            <input type="range" id="param-Am" min="1" max="25" step="0.5" value="10">
                        </div>
                        <div class="control-group">
                            <label>Message Freq (fm): <span id="fm-val" class="value-display">10</span> Hz</label>
                            <input type="range" id="param-fm" min="2" max="30" step="1" value="10">
                        </div>
                    </div>
                    
                    <div class="grid-cell">
                        <div class="control-group">
                            <label>Carrier Amp (Ac): <span id="Ac-val" class="value-display">25</span></label>
                            <input type="range" id="param-Ac" min="15" max="50" step="1" value="25">
                        </div>
                        <div class="control-group">
                            <label>Carrier Freq (fc): <span id="fc-val" class="value-display">150</span> Hz</label>
                            <input type="range" id="param-fc" min="100" max="250" step="5" value="150">
                        </div>
                    </div>

                    <div class="grid-cell" style="width: 50%;">
                        <div class="math-title">สมการคณิตศาสตร์ที่เกิดขึ้นในระบบ (Mathematical Equations)</div>
                        <div class="math-box">
                            <div><strong>m(t)</strong> = <span id="eq-mt">10 · cos(2π(10)t)</span></div>
                            <div><strong>x<sub>c</sub>(t)</strong> = <span id="eq-xct">25[1 + 0.40·cos(2π(10)t)] · cos(2π(150)t)</span></div>
                            <div><strong>y<sub>D</sub>(t)</strong> = <span id="eq-ydt">25[1 + 0.40·cos(2π(10)t)] · [cos(2π(300)t) + 1]</span></div>
                            <div><strong>m̂<sub>n</sub>(t)</strong> = <span id="eq-mnt">25[1 + 0.40·cos(2π(10)t)]</span> (หลังผ่าน Low Pass Filter)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="visual-panel">
            <div class="canvas-container">
                <div class="canvas-title">1) สัญญาณข้อมูลแบบนอร์มัลไลซ์: m<sub>n</sub>(t) = cos(2π(f<sub>m</sub>)t)</div>
                <canvas id="canvas-mn" width="1000" height="160"></canvas>
            </div>
            <div class="canvas-container">
                <div class="canvas-title">2) สัญญาณพาหะ (Unmodulated Carrier): c(t) = A<sub>c</sub> · cos(2π(f<sub>c</sub>)t)</div>
                <canvas id="canvas-c" width="1000" height="160"></canvas>
            </div>
            <div class="canvas-container">
                <div class="canvas-title">3) สัญญาณที่ถูกมอดูเลตแล้ว: x<sub>c</sub>(t) = A<sub>c</sub>[1 + μ · m<sub>n</sub>(t)] · cos(2π(f<sub>c</sub>)t)</div>
                <canvas id="canvas-xc" width="1000" height="160"></canvas>
            </div>
            <div class="canvas-container">
                <div class="canvas-title">4) สัญญาณหลังการดีมอดูเลต (คูณ Carrier ซ้ำก่อนเข้า Filter): y<sub>D</sub>(t) = x<sub>c</sub>(t) · 2cos(2π(f<sub>c</sub>)t)</div>
                <canvas id="canvas-yd" width="1000" height="160"></canvas>
            </div>
            <div class="canvas-container">
                <div class="canvas-title">5) สัญญาณเอาต์พุตสุดท้ายหลังผ่านตัวกรองความถี่ต่ำ: m̂<sub>n</sub>(t) (Filtered Output)</div>
                <canvas id="canvas-output" width="1000" height="160"></canvas>
            </div>
        </div>

        <div class="analysis-panel">
            <div class="canvas-title" style="color: #2c3e50; margin-bottom: 15px;">ผลการวิเคราะห์ทางทฤษฎีจากพารามิเตอร์ปัจจุบัน</div>
            <div class="analysis-grid">
                <div class="grid-row">
                    <div class="analysis-cell">
                        <div class="stat-card">
                            <div class="stat-label">Modulation Index (μ)</div>
                            <div id="stat-mu" class="stat-value">0.40</div>
                            <div class="stat-desc">คำนวณจาก Am / Ac (μ ≤ 1 คือสัญญาณไม่เพี้ยน)</div>
                        </div>
                    </div>
                    <div class="analysis-cell">
                        <div class="stat-card">
                            <div class="stat-label">Bandwidth (BW)</div>
                            <div id="stat-bw" class="stat-value">20 Hz</div>
                            <div class="stat-desc">คำนวณจาก 2 × fm (ความกว้างช่องสัญญาณ)</div>
                        </div>
                    </div>
                    <div class="analysis-cell">
                        <div class="stat-card">
                            <div class="stat-label">Transmission Efficiency (η)</div>
                            <div id="stat-eff" class="stat-value">7.41%</div>
                            <div class="stat-desc">ประสิทธิภาพการส่งกำลังสัญญาณข้อมูล η = μ² / (2 + μ²)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;