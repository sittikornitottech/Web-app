// ฟังก์ชันสลับหน้าจอ (SPA)
function navigateTo(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // เมื่อผู้ใช้กดเข้ามาที่หัวข้อ 3.2 
    if (pageId === 'page-3-2') {
        // 1. ดึงโครงสร้างหน้าจอ Simulator จากไฟล์ดีไซน์มาแปะลงหน้าเว็บ
        document.getElementById('am-simulator-container').innerHTML = amSimulatorTemplate;
        
        // 2. เริ่มต้นผูกฟังก์ชันระบบคำนวณและตัวเลื่อนสัญญาณ (Slider) 
        initializeAMSimulator();
    }
}

// ฟังก์ชันเริ่มระบบคุมเครื่องจำลอง AM
function initializeAMSimulator() {
    const paramAm = document.getElementById('param-Am');
    const paramFm = document.getElementById('param-fm');
    const paramAc = document.getElementById('param-Ac');
    const paramFc = document.getElementById('param-fc');

    // ผูกเหตุการณ์เวลามีการเลื่อน Slider ให้คำนวณใหม่แบบเรียลไทม์
    paramAm.addEventListener('input', updateAll);
    paramFm.addEventListener('input', updateAll);
    paramAc.addEventListener('input', updateAll);
    paramFc.addEventListener('input', updateAll);

    // รันการประมวลผลคำนวณและวาดกราฟนัดแรกทันที
    updateAll();
}

// ฟังก์ชันรีเซ็ตค่ากลับไปตามโจทย์ดั้งเดิม
function resetToDefaults() {
    document.getElementById('param-Am').value = 10;
    document.getElementById('param-fm').value = 10;
    document.getElementById('param-Ac').value = 25;
    document.getElementById('param-fc').value = 150;
    updateAll();
}

// ฟังก์ชันวาดลายตาราง Grid พื้นหลัง Canvas
function drawGrid(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.strokeStyle = '#cbd5e0';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
}

// ฟังก์ชันแกนหลักสำหรับการคำนวณทางคณิตศาสตร์วิศวกรรมและลากเส้นคลื่น
function updateAll() {
    // โหลดตัวจับ Element ต่างๆ ในหน้าเครื่องจำลอง
    const paramAm = document.getElementById('param-Am');
    const paramFm = document.getElementById('param-fm');
    const paramAc = document.getElementById('param-Ac');
    const paramFc = document.getElementById('param-fc');

    const AmVal = document.getElementById('Am-val');
    const fmVal = document.getElementById('fm-val');
    const AcVal = document.getElementById('Ac-val');
    const fcVal = document.getElementById('fc-val');

    const eqMt = document.getElementById('eq-mt');
    const eqXct = document.getElementById('eq-xct');
    const eqYdt = document.getElementById('eq-ydt');
    const eqMnt = document.getElementById('eq-mnt');

    const statMu = document.getElementById('stat-mu');
    const statBw = document.getElementById('stat-bw');
    const statEff = document.getElementById('stat-eff');

    const canvasMn = document.getElementById('canvas-mn');
    const canvasC = document.getElementById('canvas-c');
    const canvasXc = document.getElementById('canvas-xc');
    const canvasYd = document.getElementById('canvas-yd');
    const canvasOutput = document.getElementById('canvas-output');

    // อ่านค่าตัวเลขพารามิเตอร์ปัจจุบัน
    const Am = parseFloat(paramAm.value);
    const fm = parseFloat(paramFm.value);
    const Ac = parseFloat(paramAc.value);
    const fc = parseFloat(paramFc.value);

    const mu = Am / Ac;
    const bw = 2 * fm;
    const efficiency = (Math.pow(mu, 2) / (2 + Math.pow(mu, 2))) * 100;

    // แสดงผลข้อมูลลงในหน้าการวิเคราะห์
    AmVal.innerText = Am;
    fmVal.innerText = fm;
    AcVal.innerText = Ac;
    fcVal.innerText = fc;

    statMu.innerText = mu.toFixed(2);
    statBw.innerText = bw + " Hz";
    statEff.innerText = efficiency.toFixed(2) + "%";

    if (mu > 1) {
        statMu.style.color = '#e53e3e';
        statMu.innerText += " (Overmodulation! รูปคลื่นหักเหเพี้ยน)";
    } else {
        statMu.style.color = '#2d3748';
    }

    // อัปเดตสูตรสมการสดบนหน้าจอ
    eqMt.innerText = `${Am} · cos(2π(${fm})t)`;
    eqXct.innerText = `${Ac}[1 + ${mu.toFixed(2)}·cos(2π(${fm})t)] · cos(2π(${fc})t)`;
    eqYdt.innerText = `${Ac}[1 + ${mu.toFixed(2)}·cos(2π(${fm})t)] · [cos(2π(${2*fc})t) + 1]`;
    eqMnt.innerText = `${Ac}[1 + ${mu.toFixed(2)}·cos(2π(${fm})t)]`;

    const scaleY = 1.8; 
    const ctxMn = canvasMn.getContext('2d');
    const ctxC = canvasC.getContext('2d');
    const ctxXc = canvasXc.getContext('2d');
    const ctxYd = canvasYd.getContext('2d');
    const ctxOutput = canvasOutput.getContext('2d');

    // วาดลายเส้นตารางช่องสโคป
    drawGrid(canvasMn, ctxMn);
    drawGrid(canvasC, ctxC);
    drawGrid(canvasXc, ctxXc);
    drawGrid(canvasYd, ctxYd);
    drawGrid(canvasOutput, ctxOutput);

    const totalTime = 0.2; 

    ctxMn.beginPath(); ctxMn.strokeStyle = '#3182ce'; ctxMn.lineWidth = 2;
    ctxC.beginPath(); ctxC.strokeStyle = '#718096'; ctxC.lineWidth = 1;
    ctxXc.beginPath(); ctxXc.strokeStyle = '#2b579a'; ctxXc.lineWidth = 1.2;
    ctxYd.beginPath(); ctxYd.strokeStyle = '#dd6b20'; ctxYd.lineWidth = 1;
    ctxOutput.beginPath(); ctxOutput.strokeStyle = '#38a169'; ctxOutput.lineWidth = 2;

    let envTopPoints = [];
    let envBotPoints = [];

    // ประมวลผลจุดพิกัดคลื่นวิศวกรรม (Time Steps)
    for (let x = 0; x < canvasMn.width; x++) {
        let t = (x / canvasMn.width) * totalTime;

        // 1. Normalized Message Signal
        let mn_val = Math.cos(2 * Math.PI * fm * t);
        let y_mn = (canvasMn.height / 2) - (mn_val * 40 * scaleY);
        if (x === 0) ctxMn.moveTo(x, y_mn); else ctxMn.lineTo(x, y_mn);

        // 2. Carrier Signal
        let c_val = Ac * Math.cos(2 * Math.PI * fc * t);
        let y_c = (canvasC.height / 2) - (c_val * scaleY);
        if (x === 0) ctxC.moveTo(x, y_c); else ctxC.lineTo(x, y_c);

        // 3. AM Modulated Signal
        let envelope = Ac * (1 + mu * mn_val);
        let xc_val = envelope * Math.cos(2 * Math.PI * fc * t);
        let y_xc = (canvasXc.height / 2) - (xc_val * scaleY);
        if (x === 0) ctxXc.moveTo(x, y_xc); else ctxXc.lineTo(x, y_xc);
        
        envTopPoints.push({x: x, y: (canvasXc.height / 2) - (envelope * scaleY)});
        envBotPoints.push({x: x, y: (canvasXc.height / 2) + (envelope * scaleY)});

        // 4. Demodulated Output Before LPF
        let yd_val = xc_val * 2 * Math.cos(2 * Math.PI * fc * t);
        let y_yd = (canvasYd.height / 2) - (yd_val * 0.5 * scaleY);
        if (x === 0) ctxYd.moveTo(x, y_yd); else ctxYd.lineTo(x, y_yd);

        // 5. Filtered Output (m̂_n)
        let y_out = (canvasOutput.height / 2) - (envelope * scaleY);
        if (x === 0) ctxOutput.moveTo(x, y_out); else ctxOutput.lineTo(x, y_out);
    }

    ctxMn.stroke(); ctxC.stroke(); ctxXc.stroke(); ctxYd.stroke(); ctxOutput.stroke();

    // วาดเส้นกรอบนอกสัญญาณสีแดง (Envelope Line)
    ctxXc.beginPath();
    ctxXc.strokeStyle = 'rgba(229, 62, 62, 0.6)';
    ctxXc.setLineDash([4, 4]);
    ctxXc.moveTo(envTopPoints[0].x, envTopPoints[0].y);
    for(let i=1; i<envTopPoints.length; i++) ctxXc.lineTo(envTopPoints[i].x, envTopPoints[i].y);
    ctxXc.moveTo(envBotPoints[0].x, envBotPoints[0].y);
    for(let i=1; i<envBotPoints.length; i++) ctxXc.lineTo(envBotPoints[i].x, envBotPoints[i].y);
    ctxXc.stroke(); ctxXc.setLineDash([]);
}