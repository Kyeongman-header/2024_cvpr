// 초기 이미지 번호 설정
let currentIndex = 0;
let captionLists = [];
let evaluationData = []; // 평가 데이터 배열 선언

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

// 엑셀 파일에서 평가 데이터 로드
async function loadEvaluationData() {
    const response = await fetch("PORORO_human_eval.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(1); // 첫 행 건너뛰기

    // 1부터 100까지의 데이터를 evaluationData에 저장
    evaluationData = jsonData.slice(0, 100).map(row => ({
        EB: row[1],
        SET: row[2],
        CON_CHAR: row[3],
        CON_BACK: row[4]
    }));
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
    document.getElementById("captionDisplay").innerText = "Caption : " + captionText;
    
    if (currentIndex >= 0 && currentIndex < 100) {
        const data = evaluationData[currentIndex];
        document.getElementById("question1").innerText = `Question 1: (캡션 - 인물 반영) On a scale from 0 to 1, how accurately does the character’s emotions and behavior in the generated image reflect the emotions and behavior described in the caption? 
            (Pay attention to facial expressions, body language, and actions. And consider whether direct behaviors have been reflected.) 
            -> ${data["EB"]}`;
        document.getElementById("question2").innerText = `Question 2: (캡션 - 배경 반영) On a scale from 0 to 1, how appropriate is the background setting in the generated image compared to what is described in the caption? 
        -> ${data["SET"]}`;
        document.getElementById("question3").innerText = `Question 3: (소스 이미지 - 인물 일관성) On a scale from 0 to 1, how well does the appearance of the character in the generated image match the appearance of the same character in the source image? 
            (Consider factors like clothing, facial features, and overall design. If the character doesn't match, consider styles of drawings. 
            Pay attention to facial expressions, body language, and actions.) 
            -> ${data["CON_CHAR"]}`;
        document.getElementById("question4").innerText = `Question 4: (소스 이미지 - 배경 일관성) On a scale from 0 to 1, how well does the background in the generated image maintain consistent artistic style compared to the source image? 
            (Consider the level of detail, color schemes, and any recurring elements.) 
            -> ${data["CON_BACK"]}`;
    }

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

// 첫 로드 시 엑셀 데이터와 캡션을 로드하고 이벤트 리스너를 추가
window.onload = () => {
    loadEvaluationData().then(() => {
        loadCaptions();
    });

    document.getElementById("imageIndex").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            loadImages();
        }
    });
};
