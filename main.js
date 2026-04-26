import { LFRSimulator } from './math.js';
import Plotly from 'plotly.js-dist-min';

// --- State ---
let state = {
    nMirrors: 22,
    mWidth: 0.195,
    rHeight: 2.5,
    sAngle: 45
};

let simulator = new LFRSimulator(state.nMirrors, state.mWidth, state.rHeight);

// --- UI Elements ---
const inputs = {
    nMirrors: document.getElementById('nMirrors'),
    mWidth: document.getElementById('mWidth'),
    rHeight: document.getElementById('rHeight'),
    sAngle: document.getElementById('sAngle')
};

const vals = {
    nMirrors: document.getElementById('nMirrorsVal'),
    mWidth: document.getElementById('mWidthVal'),
    rHeight: document.getElementById('rHeightVal'),
    sAngle: document.getElementById('sAngleVal')
};

// --- Initialization ---
function init() {
    setupListeners();
    update();
}

function setupListeners() {
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', (e) => {
            state[key] = parseFloat(e.target.value);
            vals[key].textContent = key === 'sAngle' ? `${state[key]}°` : state[key];
            update();
        });
    });

    document.getElementById('downloadCsv').addEventListener('click', showPreview);
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('previewModal').style.display = 'none';
    });
    document.getElementById('confirmDownload').addEventListener('click', downloadCsv);
}

function update() {
    simulator = new LFRSimulator(state.nMirrors, state.mWidth, state.rHeight);
    renderEfficiencyChart();
    renderRayViz();
    renderTable();
}

function showPreview() {
    const csvContent = generateCsvContent();
    document.getElementById('csvPreview').textContent = csvContent;
    document.getElementById('previewModal').style.display = 'flex';
}

function generateCsvContent() {
    const timestamp = new Date().toLocaleString();
    let csv = '--------------------------------------------------\n';
    csv += 'LFR PERFORMANCE SIMULATION REPORT\n';
    csv += '--------------------------------------------------\n';
    csv += `Generated On: ${timestamp}\n`;
    csv += `Total Mirrors: ${state.nMirrors}\n`;
    csv += `Mirror Width: ${state.mWidth} m\n`;
    csv += `Receiver Height: ${state.rHeight} m\n`;
    csv += '--------------------------------------------------\n\n';

    csv += 'Incident_Angle_Deg,Cosine_Efficiency,Shading_Efficiency_M1\n';
    for (let a = 0; a <= 90; a++) {
        const cosEff = simulator.getCosineEfficiency(a).toFixed(4);
        const shadEff = simulator.getShadingEfficiency(1, a).toFixed(4);
        csv += `${a},${cosEff},${shadEff}\n`;
    }

    const avgEff = (Array.from({length: 91}, (_, i) => simulator.getCosineEfficiency(i)).reduce((a, b) => a + b) / 91).toFixed(4);
    csv += '\n--------------------------------------------------\n';
    csv += `OVERALL AVERAGE EFFICIENCY: ${avgEff}\n`;
    csv += 'END OF REPORT\n';
    return csv;
}

function downloadCsv() {
    const csvContent = generateCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `LFR_Production_Report_${new Date().getTime()}.csv`);
    a.click();
    document.getElementById('previewModal').style.display = 'none';
}

function renderEfficiencyChart() {
    const angles = [];
    const cosEffs = [];
    const shadEffs = [];
    for (let a = 0; a <= 90; a += 5) {
        angles.push(a);
        cosEffs.push(simulator.getCosineEfficiency(a));
        shadEffs.push(simulator.getShadingEfficiency(1, a)); // Mirror 1 example
    }

    const data = [
        {
            x: angles,
            y: cosEffs,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Cosine Eff',
            line: { color: '#38bdf8', width: 2 }
        },
        {
            x: angles,
            y: shadEffs,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Shading Eff',
            line: { color: '#f472b6', width: 2 }
        }
    ];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8', size: 10 },
        margin: { t: 30, b: 40, l: 40, r: 10 },
        xaxis: { gridcolor: 'rgba(255,255,255,0.05)', title: 'Angle (°)' },
        yaxis: { gridcolor: 'rgba(255,255,255,0.05)', title: 'Efficiency' },
        height: 300,
        legend: { x: 0, y: 1.1, orientation: 'h' }
    };

    Plotly.newPlot('efficiencyChart', data, layout, { displayModeBar: false });
}

function renderRayViz() {
    const { sunVec, mirrors } = simulator.getRayData(state.sAngle);
    const h = state.rHeight;

    const traces = [];

    // Receiver
    traces.push({
        x: [0], y: [h],
        mode: 'markers',
        marker: { size: 12, color: '#facc15', symbol: 'diamond' },
        name: 'Receiver'
    });

    // Mirrors and Rays
    mirrors.forEach(m => {
        // Mirror
        const mRad = (m.tilt * Math.PI) / 180;
        const dx = (state.mWidth / 2) * Math.cos(mRad);
        const dy = (state.mWidth / 2) * Math.sin(mRad);
        
        traces.push({
            x: [m.x - dx, m.x + dx],
            y: [m.y - dy, m.y + dy],
            mode: 'lines',
            line: { color: '#22d3ee', width: 4 },
            showlegend: false
        });

        // Incident Ray
        traces.push({
            x: [m.x - sunVec[0] * 5, m.x],
            y: [m.y - sunVec[1] * 5, m.y],
            mode: 'lines',
            line: { color: 'rgba(255,255,255,0.1)', width: 1, dash: 'dot' },
            showlegend: false
        });

        // Reflected Ray
        traces.push({
            x: [m.x, 0],
            y: [m.y, h],
            mode: 'lines',
            line: { color: 'rgba(251, 146, 60, 0.6)', width: 1 },
            showlegend: false
        });
    });

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#94a3b8' },
        margin: { t: 10, b: 40, l: 40, r: 10 },
        xaxis: { range: [-3, 3], gridcolor: 'rgba(255,255,255,0.05)' },
        yaxis: { range: [-0.5, h + 1], gridcolor: 'rgba(255,255,255,0.05)', scaleanchor: 'x' },
        height: 600,
        showlegend: false
    };

    Plotly.newPlot('rayViz', traces, layout, { displayModeBar: false });
}

function renderTable() {
    const tbody = document.querySelector('#logsTable tbody');
    tbody.innerHTML = '';
    
    for (let a = 0; a <= 90; a += 10) {
        const tr = document.createElement('tr');
        const cosEff = simulator.getCosineEfficiency(a).toFixed(4);
        const shadEff = simulator.getShadingEfficiency(1, a).toFixed(4);
        tr.innerHTML = `
            <td>${a}°</td>
            <td style="color: #38bdf8">${cosEff}</td>
            <td style="color: #f472b6">${shadEff}</td>
        `;
        tbody.appendChild(tr);
    }
}


init();
