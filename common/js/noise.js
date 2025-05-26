// 물결 노이즈 캔버스 효과 구현
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('portfolio-noise');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let animationFrameId;
    let backgroundImage = new Image();
    backgroundImage.src = '/images/main/profil.jpg';
    
    // 이미지 로드 실패 시 대체 이미지 설정
    backgroundImage.onerror = function() {
        // 이미지 로드 실패 시 대체 이미지 또는 그라데이션 사용
        console.warn('배경 이미지 로드 실패');
        backgroundImage = null;
    };
    
    // 캔버스 크기 설정 함수
    function resizeCanvas() {
        const parent = canvas.parentElement;
        width = canvas.width = parent.offsetWidth;
        height = canvas.height = parent.offsetHeight;
    }
    
    // 애니메이션 루프
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // 물결 노이즈 배경 그리기
        drawWaveNoise();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // 물결 노이즈 배경 그리기 함수
    function drawWaveNoise() {
        const time = Date.now() * 0.001;
        
        // 배경 이미지 그리기
        if (backgroundImage && backgroundImage.complete) {
            // 이미지 캔버스에 맞게 그리기 (cover 스타일로 꽉 채우기)
            const imgRatio = backgroundImage.width / backgroundImage.height;
            const canvasRatio = width / height;
            
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            
            if (imgRatio > canvasRatio) {
                // 이미지가 더 넓은 경우
                drawHeight = height;
                drawWidth = height * imgRatio;
                offsetX = (width - drawWidth) / 2;
            } else {
                // 이미지가 더 좁은 경우
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetY = (height - drawHeight) / 2;
            }
            
            ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        } else {
            // 이미지가 없을 경우 그라데이션 배경 사용
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, 'rgba(20, 30, 80, 0.8)');
            gradient.addColorStop(1, 'rgba(60, 90, 180, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }
        
        // 물결 효과에 사용할 이미지 데이터를 가져옴
        let imageData;
        try {
            imageData = ctx.getImageData(0, 0, width, height);
        } catch(e) {
            console.error('이미지 데이터 가져오기 실패:', e);
        }
        
        // 물결 디스토션 효과 적용
        if (imageData) {
            const distortedImageData = ctx.createImageData(width, height);
            const d1 = imageData.data;
            const d2 = distortedImageData.data;
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    // 물결 효과에 의한 변위 계산 (디스토션만 남김)
                    const distX = Math.sin(y * 0.03 + time) * 5; 
                    const distY = Math.cos(x * 0.03 + time) * 3.5;
                    
                    const srcX = Math.floor(x + distX);
                    const srcY = Math.floor(y + distY);
                    
                    // 경계 체크
                    if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                        const i = (y * width + x) * 4;
                        const srcI = (srcY * width + srcX) * 4;
                        
                        // 픽셀 복사
                        d2[i] = d1[srcI];     // R
                        d2[i+1] = d1[srcI+1]; // G
                        d2[i+2] = d1[srcI+2]; // B
                        d2[i+3] = d1[srcI+3]; // A
                    }
                }
            }
            
            // 디스토션 이미지 데이터 적용
            ctx.putImageData(distortedImageData, 0, 0);
        }
    }
    
    // 이벤트 리스너 설정
    window.addEventListener('resize', resizeCanvas);
    
    // 초기화 및 애니메이션 시작
    resizeCanvas();
    animate();
    
    // 큐브 회전 시 노이즈 효과 표시
    const cube = document.querySelector('.cube');
    if (cube) {
        const observer = new MutationObserver((mutations) => {
        });
        
        observer.observe(cube, { attributes: true });
    }
    
    // 페이지 나가면 애니메이션 정지
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
});
