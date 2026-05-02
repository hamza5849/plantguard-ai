// ─── FILE UPLOAD & PREVIEW ───
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const resultItems = document.getElementById('resultItems');

let selectedFile = null;

// Drag and drop support
const uploadZone = document.getElementById('uploadZone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '#2e7d32';
    uploadZone.style.background = '#f1f8e9';
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = '#81c784';
    uploadZone.style.background = '#f9fbe7';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '#81c784';
    uploadZone.style.background = '#f9fbe7';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedFile = file;
        showPreview(file);
    }
});

fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) showPreview(selectedFile);
});

function showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
        analyzeBtn.disabled = false;
        resetBtn.style.display = 'block';
        results.style.display = 'none';
        resultItems.innerHTML = '';
    };
    reader.readAsDataURL(file);
}

// ─── RESET ───
function resetAll() {
    selectedFile = null;
    fileInput.value = '';
    preview.src = '';
    preview.style.display = 'none';
    analyzeBtn.disabled = true;
    resetBtn.style.display = 'none';
    results.style.display = 'none';
    loading.style.display = 'none';
    resultItems.innerHTML = '';
    uploadZone.style.borderColor = '#81c784';
}

// ─── ANALYZE ───
function analyze() {
    if (!selectedFile) return;

    loading.style.display = 'block';
    results.style.display = 'none';
    analyzeBtn.disabled = true;
    resultItems.innerHTML = '';

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];

        fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
        })
        .then(r => r.json())
        .then(data => {
            loading.style.display = 'none';
            analyzeBtn.disabled = false;
            showResults(data);
        })
        .catch(() => {
            loading.style.display = 'none';
            analyzeBtn.disabled = false;
            alert('Something went wrong. Please try again.');
        });
    };
    reader.readAsDataURL(selectedFile);
}

// ─── SHOW RESULTS ───
function showResults(data) {
    resultItems.innerHTML = '';

    data.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `result-item ${i === 0 ? 'top' : ''}`;
        div.innerHTML = `
            <div class="result-row">
                <div class="result-name">
                    ${item.disease}
                    <span class="result-badge ${i === 0 ? 'best' : 'alt'}">
                        ${i === 0 ? 'Best Match' : 'Alternative'}
                    </span>
                </div>
                <div class="result-pct ${i === 0 ? 'top' : ''}">${item.confidence}%</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${i === 0 ? 'top' : ''}" id="bar${i}"></div>
            </div>
        `;
        resultItems.appendChild(div);
    });

    results.style.display = 'block';

    // Animate progress bars
    setTimeout(() => {
        data.forEach((item, i) => {
            const bar = document.getElementById(`bar${i}`);
            if (bar) bar.style.width = item.confidence + '%';
        });
    }, 100);
}

// ─── MOBILE MENU ───
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.getElementById('hamburger');
    menu.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// ─── SMOOTH SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            document.getElementById('mobileMenu').classList.remove('open');
            document.getElementById('hamburger').classList.remove('active');
        }
    });
});