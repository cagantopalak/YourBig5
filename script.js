const images = [
    "aişe.jpg", "alina.jpeg", "aslı.jpeg", "belinay.jpeg", "beril.jpeg",
    "cybelle.jpeg", "damla.jpeg", "ece_celikgun.jpeg", "ece_ertugrul.jpeg", "ece_nur.jpeg",
    "ela.jpeg", "elif.jpg", "elvin.jpeg", "eser.jpg", "esra.jpeg",
    "eunseo_lee.jpeg", "fatime.jpeg", "kübra.jpg", "lal.jpeg", "lara.jpeg",
    "miray.jpeg", "naz.jpeg", "nazlı.jpeg", "nisa.jpeg", "rengin.jpeg",
    "sude.jpeg", "tuğçe.jpeg", "zelal.jpeg", "zeynep.jpeg", "özdenur.jpg"
];

let maxSelection = 15;
const selectedImages = new Set();

const gridContainer = document.getElementById('image-grid');
const countDisplay = document.getElementById('count-display');
const continueBtn = document.getElementById('continue-btn');
const selectionPhase = document.getElementById('selection-phase');
const resultPhase = document.getElementById('result-phase');
const resultPreview = document.getElementById('result-preview');
const downloadBtn = document.getElementById('download-btn');
const backBtn = document.getElementById('back-btn');
const userNameInput = document.getElementById('user-name');

// Mode Toggle Elements
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');
const mode5Btn = document.getElementById('mode-5');
const mode15Btn = document.getElementById('mode-15');

function setMode(limit) {
    if (maxSelection === limit) return;

    maxSelection = limit;
    selectedImages.clear();
    document.querySelectorAll('.image-card.selected').forEach(card => card.classList.remove('selected'));

    // Update UI Text
    pageTitle.textContent = `Big ${limit}`;
    pageSubtitle.textContent = `Kişisel koleksiyonunuzu oluşturmak için ${limit} favori kızınızı seçin.`;

    // Update Buttons
    if (limit === 5) {
        mode5Btn.classList.add('active');
        mode15Btn.classList.remove('active');
    } else {
        mode5Btn.classList.remove('active');
        mode15Btn.classList.add('active');
    }

    updateUI();
}

mode5Btn.addEventListener('click', () => setMode(5));
mode15Btn.addEventListener('click', () => setMode(15));

function formatName(filename) {
    return filename.split('.')[0]
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function initGrid() {
    gridContainer.innerHTML = '';
    images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.dataset.filename = img;

        const imageElement = document.createElement('img');
        imageElement.src = `photos/${img}`;
        imageElement.alt = formatName(img);
        imageElement.loading = 'lazy';

        const nameTag = document.createElement('div');
        nameTag.className = 'name-tag';
        nameTag.textContent = formatName(img);

        card.appendChild(imageElement);
        card.appendChild(nameTag);

        if (selectedImages.has(img)) {
            card.classList.add('selected');
        }

        card.addEventListener('click', () => toggleSelection(img, card));
        gridContainer.appendChild(card);
    });
}

function toggleSelection(filename, cardElement) {
    if (selectedImages.has(filename)) {
        selectedImages.delete(filename);
        cardElement.classList.remove('selected');
    } else {
        if (selectedImages.size >= maxSelection) {
            alert(`Sadece ${maxSelection} kişi seçebilirsiniz.`);
            return;
        }
        selectedImages.add(filename);
        cardElement.classList.add('selected');
    }
    updateUI();
}

function updateUI() {
    countDisplay.textContent = `${selectedImages.size} / ${maxSelection} Seçildi`;
    continueBtn.disabled = selectedImages.size !== maxSelection;
}

continueBtn.addEventListener('click', () => {
    selectionPhase.classList.add('hidden');
    resultPhase.classList.remove('hidden');
    showResultPreview();
    window.scrollTo(0, 0);
});

backBtn.addEventListener('click', () => {
    resultPhase.classList.add('hidden');
    selectionPhase.classList.remove('hidden');
});

function showResultPreview() {
    resultPreview.innerHTML = '';
    selectedImages.forEach(img => {
        const imgEl = document.createElement('img');
        imgEl.src = `photos/${img}`;
        resultPreview.appendChild(imgEl);
    });
}

downloadBtn.addEventListener('click', async () => {
    const userName = userNameInput.value.trim();

    if (!userName) {
        alert("Lütfen indirmeden önce adınızı giriniz.");
        return;
    }
    const websiteName = "big5_big15.vercel"; // Placeholder as requested

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Config: 5 columns
    const cols = 5;
    // Rows depend on selection limit
    const rows = maxSelection === 5 ? 1 : 3;

    const imgWidth = 450;
    const imgHeight = 600;
    const borderSize = 20;
    const bottomFooterHeight = 120;

    // Total dimensions
    const totalWidth = (cols * imgWidth) + (borderSize * 2);
    const totalHeight = (rows * imgHeight) + (borderSize * 2) + bottomFooterHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Fill background (Border color)
    ctx.fillStyle = '#cfff02'; // Green border
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fill inner background (where images go)
    ctx.fillStyle = '#1a1a1d';
    ctx.fillRect(borderSize, borderSize, cols * imgWidth, rows * imgHeight);

    // Fill footer background
    ctx.fillStyle = '#1a1a1d';
    ctx.fillRect(borderSize, canvas.height - bottomFooterHeight - borderSize, cols * imgWidth, bottomFooterHeight);

    const selectedArray = Array.from(selectedImages);

    const loadPromises = selectedArray.map((src, index) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const x = (index % cols) * imgWidth + borderSize;
                const y = Math.floor(index / cols) * imgHeight + borderSize;
                ctx.drawImage(img, x, y, imgWidth, imgHeight);
                resolve();
            };
            img.onerror = reject;
            img.src = `photos/${src}`;
        });
    });

    try {
        await Promise.all(loadPromises);

        // Add Text to Footer
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const footerY = canvas.height - borderSize - (bottomFooterHeight / 2);
        const textX = borderSize + 40;

        // Website Name + User Name
        ctx.textAlign = 'center';
        ctx.fillText(`My Big ${maxSelection} | ${userName}`, canvas.width / 2, footerY);

        // Website name on the middle
        ctx.font = '50px Outfit, sans-serif';
        ctx.fillStyle = '#a0a0a0';
        ctx.textAlign = 'left';
        ctx.fillText(`${websiteName}`, textX, footerY);

        // Watermark
        ctx.font = '50px Outfit, sans-serif';
        ctx.fillStyle = '#a0a0a0';
        ctx.textAlign = 'right';
        ctx.fillText('Made by CaganT', canvas.width - borderSize - 40, footerY);

        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.download = `${userName}_big${maxSelection}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (securityError) {
            console.error("Security Error:", securityError);
            alert("Tarayıcı güvenliği indirmeyi engelledi. Lütfen dosyayı yerel bir sunucu üzerinden çalıştırın (örn: VS Code Live Server).");
        }
    } catch (err) {
        console.error("Error generating image", err);
        alert("Görseller yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(images);
initGrid();
updateUI();
