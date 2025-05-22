class NoiseCanvas {
  constructor(container, options = {}) {
      // 기본 옵션
      this.options = {
          opacity: options.opacity || 0.2,
          zIndex: options.zIndex || 10,
          colorMin: options.colorMin || 0,
          colorMax: options.colorMax || 255,
          threshold: options.threshold || 200,
          frameRate: options.frameRate || 30
      };
      
      // 캔버스 생성
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'noise-canvas';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none'; 
      this.canvas.style.zIndex = this.options.zIndex;
      this.canvas.style.opacity = this.options.opacity;
      
      // 컨테이너에 캔버스 추가
      container.appendChild(this.canvas);
      
      // 컨텍스트 설정
      this.ctx = this.canvas.getContext('2d');
      
      // 애니메이션 변수
      this.frame = 0;
      this.isAnimating = false;
      this.lastFrameTime = 0;
      this.frameInterval = 1000 / this.options.frameRate;
      
      // 초기화
      this.resize();
      window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
      const container = this.canvas.parentElement;
      this.canvas.width = container.offsetWidth;
      this.canvas.height = container.offsetHeight;
  }
  
  generateNoise() {
      const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
          const noise = Math.floor(Math.random() * 255);
          const cell = Math.floor((i / 4) / this.canvas.width) % 2 + Math.floor((i / 4) % this.canvas.width) % 2;
          
          const value = (noise < this.options.threshold) ? this.options.colorMin : this.options.colorMax;
          
          data[i] = value;     // R
          data[i+1] = value;   // G
          data[i+2] = value;   // B
          data[i+3] = cell * 10 + 5;
      }
      
      this.ctx.putImageData(imageData, 0, 0);
  }
  
  animate(timestamp) {
      if (!this.isAnimating) return;
      
      if (!timestamp) timestamp = 0;
      const elapsed = timestamp - this.lastFrameTime;
      
      if (elapsed > this.frameInterval) {
          this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
          this.frame++;
          this.generateNoise();
      }
      
      requestAnimationFrame((ts) => this.animate(ts));
  }
  
  start() {
      if (!this.isAnimating) {
          this.isAnimating = true;
          this.animate();
      }
      return this;
  }
  
  stop() {
      this.isAnimating = false;
      return this;
  }
  
  setOpacity(value) {
      this.canvas.style.opacity = value;
      this.options.opacity = value;
      return this;
  }
}

// 사용 방법
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.portfolio-wrap .face.bottom');
  const noiseEffect = new NoiseCanvas(container, {
      opacity: 1,
      threshold: 20  // 노이즈 강도 조절
  });
  noiseEffect.start();
});