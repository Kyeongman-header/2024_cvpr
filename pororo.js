// 초기 이미지 번호 설정
let currentIndex = 400;
let captionLists = [];

// JSON 파일에서 캡션 로드
function loadCaptions() {
    fetch("all_captions_test.json")
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < Object.keys(data).length; i++) {
                data[i].forEach(caption => {
                    captionLists.push(caption);
                });
            }
            loadImages(); // 첫 이미지를 로드
        });
}

// 이미지와 캡션 로드
function loadImages() {
    const imageIndex = parseInt(document.getElementById("imageIndex").value);
    currentIndex = imageIndex;

    const sourceFolder = "pororo_source/";
    const outputFolder = "pororo_output/";

    const sourceFileName = `${Math.floor(currentIndex / 4)}_${currentIndex % 4}.png`;
    const outputFileName = `${String(currentIndex).padStart(4, '0')}.png`;

    document.getElementById("sourceImage").src = `${sourceFolder}${sourceFileName}`;
    document.getElementById("generatedImage").src = `${outputFolder}${outputFileName}`;

    const captionText = captionLists[currentIndex] || "No caption available";
    document.getElementById("captionDisplay").innerText = captionText;

    updateButtons();
}

function nextImage() {
    if (currentIndex < captionLists.length - 1) {
        currentIndex += 1;
        document.getElementById("imageIndex").value = currentIndex;
        loadImages();
    }
}

function prevImage() {
    if (currentIndex > 0) {
        currentIndex -= 1;
        document.getElementById("imageIndex").value = currentIndex;
        loadImages();
    }
}

function updateButtons() {
    document.getElementById("prevButton").disabled = currentIndex <= 0;
    document.getElementById("nextButton").disabled = currentIndex >= captionLists.length - 1;
}

window.onload = () => {
    loadCaptions();
    document.getElementById("imageIndex").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            loadImages();
        }
    });
};
