// 초기 이미지 번호 설정
let currentIndex = 0;

function loadImages() {
    // 이미지 번호 읽기
    const imageIndex = parseInt(document.getElementById("imageIndex").value);
    currentIndex = imageIndex;

    // Pororo 이미지 폴더의 파일 경로 설정
    const sourceFolder = "pororo_source/";
    const outputFolder = "pororo_output/";

    // Pororo 매칭 규칙 적용
    const sourceFileName = `${Math.floor(currentIndex / 4)}_${currentIndex % 4}.png`;
    const outputFileName = `${String(currentIndex).padStart(4, '0')}.png`;

    // 이미지 요소 가져오기
    document.getElementById("sourceImage").src = `${sourceFolder}${sourceFileName}`;
    document.getElementById("generatedImage").src = `${outputFolder}${outputFileName}`;

    // 이전/다음 버튼 활성화 상태 업데이트
    updateButtons();
}

function nextImage() {
    currentIndex += 1;
    document.getElementById("imageIndex").value = currentIndex;
    loadImages();
}

function prevImage() {
    currentIndex -= 1;
    document.getElementById("imageIndex").value = currentIndex;
    loadImages();
}

function updateButtons() {
    document.getElementById("prevButton").disabled = currentIndex <= 0;
    document.getElementById("nextButton").disabled = !imageExists(`pororo_output/${String(currentIndex + 1).padStart(4, '0')}.png`);
}

function imageExists(url) {
    const img = new Image();
    img.src = url;
    return img.complete && img.naturalHeight !== 0;
}

// 첫 로드 시 이미지 표시
window.onload = loadImages;
