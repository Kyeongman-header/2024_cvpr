// 초기 이미지 번호 설정
let currentIndex = 0;
let captionLists = [];

// CSV 파일에서 캡션 로드
function loadCaptions() {
    fetch("test_captions.csv")
        .then(response => response.text())
        .then(text => {
            const rows = text.split("\n").slice(1); // 첫 번째 행(헤더) 건너뛰기
            rows.forEach((row, index) => {
                const columns = row.split(",");
                captionLists.push({ num: index, caption: columns[1], source_caption: columns[2] });
            });
            loadImages(); // 첫 이미지를 로드
        });
}

// 이미지와 캡션 로드
function loadImages() {
    // 이미지 번호 읽기
    const imageIndex = parseInt(document.getElementById("imageIndex").value);
    currentIndex = imageIndex;

    // Flintstones 이미지 폴더의 파일 경로 설정
    const sourceFolder = "flintstones_source/";
    const outputFolder = "flintstones_output/";

    // Flintstones 매칭 규칙 적용
    const sourceFileName = `${Math.floor(currentIndex / 4)}_${currentIndex % 4}.png`;
    const outputFileName = `${String(currentIndex).padStart(4, '0')}.png`; // 4자리 형식 적용

    // 이미지 요소 가져오기
    document.getElementById("sourceImage").src = `${sourceFolder}${sourceFileName}`;
    document.getElementById("generatedImage").src = `${outputFolder}${outputFileName}`;

    // 캡션 표시
    const captionText = captionLists[currentIndex]?.caption || "No caption available";
    document.getElementById("captionDisplay").innerText = "Caption of image: " + captionText;

    // 이전/다음 버튼 활성화 상태 업데이트
    updateButtons();
}

function nextImage() {
    if (currentIndex < 1000) {  // 1000 이하일 때만 다음 이미지로 이동
        currentIndex += 1;
        document.getElementById("imageIndex").value = currentIndex;
        loadImages();
    }
}

function prevImage() {
    if (currentIndex > 0) {  // 0 이상일 때만 이전 이미지로 이동
        currentIndex -= 1;
        document.getElementById("imageIndex").value = currentIndex;
        loadImages();
    }
}

function updateButtons() {
    document.getElementById("prevButton").disabled = currentIndex <= 0;
    document.getElementById("nextButton").disabled = currentIndex >= 1000;
}

// 첫 로드 시 캡션 불러오기 및 이미지 표시
window.onload = () => {
    loadCaptions();
    document.getElementById("imageIndex").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            loadImages();
        }
    });
};
