// 초기 이미지 번호 설정
let currentIndex = 0;
let captionLists = [];

// CSV 파일에서 캡션 로드
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

    const captionText = captionLists[currentIndex] || "No caption available";
    document.getElementById("captionDisplay").innerText = captionText;
    
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
    currentIndex -= 1;
    document.getElementById("imageIndex").value = currentIndex;
    loadImages();
}

function updateButtons() {
    document.getElementById("prevButton").disabled = currentIndex <= 0;
    document.getElementById("nextButton").disabled = currentIndex >= 1000; // 1000을 넘으면 비활성화
}


// 첫 로드 시 이미지 표시
window.onload = () => {
    loadCaptions();
    document.getElementById("imageIndex").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {  // Enter 키 확인
            loadImages();
        }
    });
};
