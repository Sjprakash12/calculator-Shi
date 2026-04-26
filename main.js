import { LFRSimulator } from './math.js';
import Plotly from 'plotly.js-dist-min';

// --- State ---
let state = {
    lat: 10.9,
    lon: 76.9,
    dateTime: new Date().toISOString().slice(0, 16),
    rHeight: 10,
    bSpacing: 5,
    nMirrors: 22,
    mWidth: 0.195
};

let simulator = new LFRSimulator(state.nMirrors, state.mWidth, state.rHeight, state.lat, state.lon);

// --- UI Elements ---
const inputs = {
    lat: document.getElementById('lat'),
    lon: document.getElementById('lon'),
    dateTime: document.getElementById('dateTime'),
    rHeight: document.getElementById('rHeight'),
    bSpacing: document.getElementById('bSpacing')
};

const displays = {
    sunAlt: document.getElementById('sunAlt'),
    sunAz: document.getElementById('sunAz'),
    sysStatus: document.getElementById('sysStatus'),
    tiltTable: document.querySelector('#tiltTable tbody')
};

// --- Initialization ---
function init() {
    // Set default datetime
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    inputs.dateTime.value = now.toISOString().slice(0, 16);
    state.dateTime = inputs.dateTime.value;

    setupListeners();
    update();
}

function setupListeners() {
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', (e) => {
            state[key] = key === 'dateTime' ? e.target.value : parseFloat(e.target.value);
            update();
        });
    });

    document.getElementById('optimizeBtn').addEventListener('click', () => {
        displays.sysStatus.textContent = 'OPTIMIZING...';
        setTimeout(() => {
            update();
            displays.sysStatus.textContent = 'OPTIMIZED';
        }, 500);
    });

    document.getElementById('downloadBtn').addEventListener('click', showPreview);
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('previewModal').style.display = 'none';
    });
    document.getElementById('confirmDownload').addEventListener('click', downloadCsv);
}

function update() {
    // 1. Update Simulator
    simulator = new LFRSimulator(state.nMirrors, state.mWidth, state.rHeight, state.lat, state.lon);
    
    // 2. Calculate Solar Position
    const date = new Date(state.dateTime);
    const solar = simulator.calculateSolarPosition(date);
    
    // 3. Update Displays
    displays.sunAlt.textContent = `${solar.altitude.toFixed(2)}°`;
    displays.sunAz.textContent = `${solar.azimuth.toFixed(2)}°`;
    
    // 4. Render Components
    renderEfficiencyChart();
    renderRayViz(solar.altitude);
    renderTiltTable(solar.altitude);
}

function renderTiltTable(altitude) {
    displays.tiltTable.innerHTML = '';
    for (let i = 1; i <= state.nMirrors; i++) {
        const tilt = simulator.getMirrorTilt(i, altitude);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>Mirror ${i}</td>
            <td class="accent">${tilt.toFixed(2)}°</td>
        `;
        displays.tiltTable.appendChild(tr);
    }
}

function renderEfficiencyChart() {
    const angles = [];
    const cosEffs = [];
    const shadEffs = [];
    for (let a = 0; a <= 90; a += 5) {
        angles.push(a);
        cosEffs.push(simulator.getCosineEfficiency(a));
        shadEffs.push(simulator.getShadingEfficiency(1, a));
    }

    const data = [
        {
            x: angles,
            y: cosEffs,
            type: 'scatter',
            mode: 'lines',
            name: 'Cosine Efficiency',
            line: { color: '#38bdf8', width: 3, shape: 'spline' },
            fill: 'tozeroy',
            fillcolor: 'rgba(56, 189, 248, 0.1)'
        },
        {
            x: angles,
            y: shadEffs,
            type: 'scatter',
            mode: 'lines',
            name: 'Shading Efficiency',
            line: { color: '#f472b6', width: 2, dash: 'dot' }
        }
    ];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', family: 'Outfit', size: 11 },
        margin: { t: 40, b: 40, l: 50, r: 20 },
        xaxis: { gridcolor: 'rgba(255,255,255,0.05)', title: 'Solar Altitude (°)' },
        yaxis: { gridcolor: 'rgba(255,255,255,0.05)', title: 'Efficiency' },
        legend: { x: 0, y: 1.2, orientation: 'h' },
        autosize: true
    };

    Plotly.newPlot('efficiencyChart', data, layout, { responsive: true, displayModeBar: false });
}

function renderRayViz(altitude) {
    const { sunVec, mirrors } = simulator.getRayData(altitude);
    const h = state.rHeight;

    const traces = [];

    // Receiver
    traces.push({
        x: [0], y: [h],
        mode: 'markers',
        marker: { size: 15, color: '#fbbf24', symbol: 'circle', line: { color: '#fff', width: 2 } },
        name: 'Receiver'
    });

    // Mirrors and Rays
    mirrors.forEach(m => {
        const mRad = (m.tilt * Math.PI) / 180;
        const dx = (state.mWidth / 2) * Math.cos(mRad);
        const dy = (state.mWidth / 2) * Math.sin(mRad);
        
        // Mirror segment
        traces.push({
            x: [m.x - dx, m.x + dx],
            y: [m.y - dy, m.y + dy],
            mode: 'lines',
            line: { color: '#38bdf8', width: 5 },
            showlegend: false
        });

        // Incident Ray (Dashed)
        traces.push({
            x: [m.x - sunVec[0] * 10, m.x],
            y: [m.y - sunVec[1] * 10, m.y],
            mode: 'lines',
            line: { color: 'rgba(255,255,255,0.15)', width: 1, dash: 'dash' },
            showlegend: false
        });

        // Reflected Ray (Glow)
        traces.push({
            x: [m.x, 0],
            y: [m.y, h],
            mode: 'lines',
            line: { color: 'rgba(56, 189, 248, 0.4)', width: 2 },
            showlegend: false
        });
    });

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', family: 'Outfit' },
        margin: { t: 20, b: 40, l: 50, r: 20 },
        xaxis: { range: [-3, 3], gridcolor: 'rgba(255,255,255,0.05)', zeroline: false },
        yaxis: { range: [-0.5, h + 2], gridcolor: 'rgba(255,255,255,0.05)', scaleanchor: 'x', zeroline: false },
        autosize: true,
        showlegend: false
    };

    Plotly.newPlot('rayViz', traces, layout, { responsive: true, displayModeBar: false });
}

function showPreview() {
    const csvContent = generateCsvContent();
    document.getElementById('csvPreview').textContent = csvContent;
    document.getElementById('previewModal').style.display = 'flex';
}

function generateCsvContent() {
    const date = new Date(state.dateTime);
    const solar = simulator.calculateSolarPosition(date);
    let csv = 'LFR SIMULATOR PERFORMANCE REPORT\n';
    csv += '=================================\n';
    csv += `Timestamp: ${state.dateTime}\n`;
    csv += `Latitude: ${state.lat}, Longitude: ${state.lon}\n`;
    csv += `Solar Altitude: ${solar.altitude.toFixed(4)}°, Azimuth: ${solar.azimuth.toFixed(4)}°\n`;
    csv += `Receiver Height: ${state.rHeight}m\n\n`;
    csv += 'Mirror,Tilt Angle (°)\n';
    for (let i = 1; i <= state.nMirrors; i++) {
        csv += `${i},${simulator.getMirrorTilt(i, solar.altitude).toFixed(4)}\n`;
    }
    return csv;
}

function downloadCsv() {
    const csvContent = generateCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LFR_Solar_Report_${new Date().getTime()}.csv`;
    a.click();
    document.getElementById('previewModal').style.display = 'none';
}

init();
