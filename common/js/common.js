const revealOption = { duration: 1200, distance: '60px', opacity: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', reset: false, beforeReveal: (el) => { el.classList.add('sr-animate') }, beforeReset: (el) => { el.classList.remove('sr-animate') } }
const revealOption2 = { duration: 1200, distance: '1920px', opacity: 1, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', reset: false, beforeReveal: (el) => { el.classList.add('sr-animate'); }, beforeReset: (el) => { el.classList.remove('sr-animate'); }};
const fadeIn = { ...revealOption, distance: 0 }
const fadeUp = { ...revealOption, origin: 'bottom' }
const fadeRight = { ...revealOption, origin: 'left' }
const fadeRight2 = { ...revealOption2, origin: 'left' }
const fadeLeft = { ...revealOption, origin: 'right' }
const fadeLeft2 = { ...revealOption2, origin: 'right' }
const zoomOutUp = { ...revealOption, origin: 'bottom', scale: 0.5 }
const banner = { ...revealOption2, origin: 'right' };

let HTML, HEADER, FOOTER, GNB, NAV, thisScroll = 0;
let option = {
    mobileWidth: 1024,
    ticking: false,
    timeline: [],
}
function initializeLenis() {
  lenis = new Lenis({
    duration: 1.2,
    infinite: false,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
if (window.innerWidth > option.mobileWidth) {
  initializeLenis();
}
window.addEventListener('resize', () => {
  if (window.innerWidth > option.mobileWidth && !lenis) {
    initializeLenis();
  } else if (window.innerWidth <= option.mobileWidth && lenis) {
    lenis.destroy();
    lenis = null;
  }
});
window.addEventListener('DOMContentLoaded', () => {
    // common.init();
    // common.windowScroll();
    // common.windowResize();
    // common.header();
    // common.sub();
});

let common = {
    lenus: null,
    init: () => {
        HTML = document.querySelector('html');
        HEADER = document.querySelector('header');
        FOOTER = document.querySelector('footer');
        GNB = HEADER.querySelector('.gnb');
        NAV = HEADER.querySelector('.nav');

        gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
        handler.initialize();
        // if(handler.isMobile()){
        //     lenis.stop();
        // }
    },
    windowScroll: () => {
        window.addEventListener('scroll', () => {
            if (!option.ticking) {
                window.requestAnimationFrame(() => {
                    scrollAnimate();
                    option.ticking = false;
                });
                option.ticking = true;
            }
            // floating();
        });

        function scrollAnimate(){
            stickyHeader();
            toggleHeader();
        }
    },
    windowResize: () => {
        window.addEventListener('resize', () => {
            handler.updateDevice();
            hamburger.update();
        });
    },
    header: () => {
        handler.updateHeader();
        hamburger.initialize();
        stickyHeader();
        toggleHeader();
        language();

        // HEADER.addEventListener('mouseenter', mouseEnter);
        // HEADER.addEventListener('mouseleave', mouseLeave);
        //
        // function mouseEnter(){
        //     option.headerTheme = HEADER.dataset.headerTheme;
        //     if(handler.isMobile()){
        //         return;
        //     }
        //     if (option.headerTheme === 'white'){
        //         HEADER.dataset.headerTheme = 'light';
        //         option.headerPreviousTheme = 'white';
        //     }
        //     if (option.headerTheme === 'transparent'){
        //         HEADER.dataset.headerTheme = 'light';
        //     }
        //     HEADER.dataset.headerGnb = 'opened';
        //     gsap.to(GNB, { duration: 0.5, height: option.headerMaxHeight });
        // }
        // function mouseLeave() {
        //     if(handler.isMobile()){
        //         return;
        //     }
        //     gsap.killTweensOf(GNB);
        //     if (option.headerPreviousTheme === 'white') {
        //         HEADER.dataset.headerTheme = 'white';
        //         option.headerPreviousTheme = '';
        //     }
        //     if (option.headerTheme === 'transparent') {
        //         HEADER.dataset.headerTheme = 'transparent';
        //     }
        //     HEADER.removeAttribute('data-header-GNB');
        //     gsap.to(GNB, { duration: 0.3, height: option.headerMinHeight });
        // }
        const depth1Items = document.querySelectorAll('.depth1 > li');
        const GNB = document.querySelector('.gnb');

        depth1Items.forEach(item => {
          item.addEventListener('mouseenter', () => {
            if(handler.isMobile()) return;
            depth1Items.forEach(otherItem => {
              if(otherItem !== item) {
                const depth2 = otherItem.querySelector('.depth2');
                if(depth2) {
                  gsap.killTweensOf(depth2);
                  gsap.to(depth2, {
                    duration: 0.3,
                    opacity: 0,
                    display: 'none'
                  });
                }
              }
            });

            const depth2 = item.querySelector('.depth2');
            if(depth2) {
              gsap.killTweensOf(depth2);
              gsap.to(depth2, {
                duration: 0.5,
                opacity: 1,
                display: 'block'
              });
            }

            if (option.headerTheme === 'white'){
              HEADER.dataset.headerTheme = 'light';
              option.headerPreviousTheme = 'white';
            }
            if (option.headerTheme === 'transparent'){
              HEADER.dataset.headerTheme = 'light';
            }
            HEADER.dataset.headerGnb = 'opened';
          });
        });

        HEADER.addEventListener('mouseleave', () => {
          if(handler.isMobile()) return;
          // 모든 depth2 숨기기
          depth1Items.forEach(item => {
            const depth2 = item.querySelector('.depth2');
            if(depth2) {
              gsap.killTweensOf(depth2);
              gsap.to(depth2, {
                duration: 0.3,
                opacity: 0,
                display: 'none'
              });
            }
          });

          // 헤더 스타일 원복
          if (option.headerPreviousTheme === 'white') {
            HEADER.dataset.headerTheme = 'white';
            option.headerPreviousTheme = '';
          }
          if (option.headerTheme === 'transparent') {
            HEADER.dataset.headerTheme = 'transparent';
          }
          HEADER.removeAttribute('data-header-GNB');
        });
    },
    sub: () => {
      sublinkWrap();
      scrollBtn();
      footerDropDown();
    }
}

let handler = {
    initialize() {
        option.windowWidth = window.innerWidth;
        option.windowHeight = window.innerHeight;

        this.updateDevice();
    },
    updateDevice() {
        option.windowWidth = window.innerWidth;
        option.windowHeight = window.innerHeight;

        this.getDevice();
    },
    updateHeader: () => {
        option.headerMinHeight = GNB.offsetHeight;
        option.headerMaxHeight = GNB.querySelector('.depth1').offsetHeight;
        // GNB.querySelector('.background').style.top = option.headerMinHeight + 'px';
    },
    getDevice: () => {
        if (option.windowWidth <= option.mobileWidth) {
            option.device = 'mobile';
        } else {
            option.device = 'pc';
        }

        return option.device;
    },
    isMobile: () => {
      return option.device === 'mobile';
    },
    resetHeader: () => {
        option.headerMinHeight = 'auto';
        option.headerMaxHeight = 'none';
        // GNB.querySelector('.background').removeAttribute('style');
    }
}

let hamburger = {
    depth1: '',
    openButton: '',
    closeButton: '',
    currentDevice: '',
    initialize() {
        this.depth1 = GNB.querySelectorAll('.depth1 > li > a');
        this.openButton = HEADER.querySelector('.hamburger a');
        this.closeButton = HEADER.querySelector('.gnb .close a');

        if(handler.isMobile()){
            this.makeBurger();
        }

        this.currentDevice = handler.getDevice();
        this.update();
    },
    makeBurger(){
        this.openButton.addEventListener('click', this.toggleMenu);
        this.depth1.forEach((element) => element.addEventListener('click', this.accordion) );
    },
    removeBurger(){
        this.openButton.removeEventListener('click', this.openMenu);
        this.closeButton.removeEventListener('click', this.closeMenu);
        this.depth1.forEach((element) => element.removeEventListener('click', this.accordion) );
    },
    toggleMenu() {
      const isOpened = HEADER.dataset.hamburger === 'opened';
      const body = document.body;
      const html = document.documentElement;
      if(isOpened) {
        setScrollState(true);
        HEADER.dataset.hamburger = 'closed';
        body.removeAttribute('data-lenis-prevent');
        body.style.removeProperty('overflow');
        html.style.removeProperty('overflow');
      } else {
        setScrollState(false);
        HEADER.dataset.hamburger = 'opened';
        body.setAttribute('data-lenis-prevent', '');
        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';
      }
    },
    resetMenu(){
        this.toggleMenu();

        this.depth1.forEach((element) => {
            element.removeAttribute('aria-expanded');
            if(element.nextElementSibling !== null){
                element.nextElementSibling.removeAttribute('style')
            }
        });
    },
    isChangeDevice(){
        if(option.device !== this.currentDevice){
            this.currentDevice = handler.getDevice();
            return true;
        }
    },
    update(){
        if(this.isChangeDevice()){
            this.resetMenu();

            if(handler.isMobile()){
                this.makeBurger();
                handler.resetHeader();
            }else{
                this.removeBurger();
                handler.updateHeader();
            }
        }
    },
    accordion(el) {
        const depth2 = el.target.nextElementSibling;

        if (depth2 === null) {
            return;
        }

        if (el.target.getAttribute('aria-expanded') === 'true') {
            el.target.setAttribute('aria-expanded', 'false');
            gsap.to(depth2, { duration: 0.3, maxHeight: 0, onComplete: () => { depth2.removeAttribute('style') } });
        } else {
            el.target.setAttribute('aria-expanded', 'true');
            gsap.to(depth2, { duration: 0.3, maxHeight: depth2.scrollHeight, opacity: 1, visibility: 'visible' });
        }

        el.preventDefault();
    }
}


function setScrollState(state){
    if(state){
        HTML.removeAttribute('data-scroll-y');
    }else{
        HTML.dataset.scrollY = '' + state + '';
    }
}

function toggleHeader(){
    const isMainPage = document.querySelector('.wrap.main') !== null;
    if (isMainPage && !window.headerControlEnabled) return;
    if(window.scrollY > option.scrollY){
        if(window.scrollY < 10){
            gsap.to('.wrap .header', { y: 0 });
        }else{
            gsap.to('.wrap .header', { y: -170 });
        }
    }

    if(window.scrollY < option.scrollY){
        gsap.to('.wrap .header', { y: 0 });
    }

    option.scrollY = window.scrollY;
}

function stickyHeader() {
    const subHeader = document.querySelector('.wrap .header');
    if (subHeader) { // 요소가 존재하는지 확인
        if (window.scrollY > 230) {
            headerStickyState = true;
            subHeader.setAttribute('data-header-sticky', 'true');
        } else {
            headerStickyState = false;
            subHeader.setAttribute('data-header-sticky', 'false');
        }
    }
}

function language(){
    const toggle = document.querySelector('.header-language .current');

    if(toggle === null){
        return;
    }

    toggle.addEventListener('click', (el) => {
        if(toggle.getAttribute('aria-pressed') === 'true'){
            toggle.setAttribute('aria-pressed', 'false');
        } else {
            toggle.setAttribute('aria-pressed', 'true');
        }
    });

    window.addEventListener('click', (e) => {
        if(e.target.parentNode === toggle){
            return;
        }
        if(e.target !== toggle){
            toggle.setAttribute('aria-pressed', 'false');
        }
    });
}

// 스크롤 TOP
function scrollBtn() {
	const scroll_btn = document.querySelector('.scroll-top');
  if (!scroll_btn) return;
	scroll_btn.addEventListener('click', () => {
		const target = 0;
		const duration = 200;
		const start = window.pageYOffset;
		const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

		const scrollAnimation = (currentTime) => {
			const timeElapsed = currentTime - startTime;
			const progress = Math.min(timeElapsed / duration, 1);

			window.scrollTo(0, start + progress * (target - start));

			if (progress < 1) {
				window.requestAnimationFrame(scrollAnimation);
			}
		};

		window.requestAnimationFrame(scrollAnimation);
	});
}

function sublinkWrap() {
	const linkWrap = document.querySelector('.subvisual-sw');
  if(!linkWrap) return;
	const linkSlides = linkWrap.querySelectorAll('.swiper-slide');
	const sublinkWrap = new Swiper(linkWrap, {
		speed: 300,
		freeMode: true,
		slidesPerView: 'auto',
		slidesPerGroup: 1,
	});

	linkSlides.forEach((tab, i) => {
		if(tab.classList.contains('on')){
				if(i < 2){
						return;
				}
				sublinkWrap.slideTo(i, 0);
		}
	});
}


// function hamburger() {
//   const hdMenu = document.querySelector('.hamburger');
//   const closeButton = document.querySelector('header .close');
//   const body = document.documentElement;
//   const introElement = document.querySelector('.intro');
//
//   hdMenu.addEventListener('click', function() {
//     gsap.to('.gnb', {
//       duration: 0.5,
//       right: '0',
//       ease: 'power1.out',
//       onStart: function() {
//         body.classList.add('no-scroll');
//         lenis.stop();
//         if (introElement) {
//           introElement.classList.add('hide');
//         }
//       }
//     });
//   });
//
//   closeButton.addEventListener('click', function() {
//     gsap.to('.gnb', {
//       duration: 0.5,
//       right: '-100%',
//       ease: 'power1.out',
//       onComplete: function() {
//         body.classList.remove('no-scroll');
//         lenis.start();
//       },
//       onStart: function() {
//         if (introElement) {
//           introElement.classList.remove('hide');
//         }
//       }
//     });
//   });
// }

function floating(){
  const scrollPosition = window.pageYOffset;
  const scrollTo = document.querySelector('.floating-container');
  if(!scrollTo) return;

  const footer = document.querySelector('footer');
  const topButton = scrollTo.querySelector('.btn-top');

  // 푸터 체크 및 포지션 설정
  if (window.innerHeight >= footer.getBoundingClientRect().top) {
    scrollTo.style.position = 'absolute';
  } else {
    scrollTo.style.position = 'absolute';
  }

  // 스크롤 위치에 따른 active 클래스 토글
  if (scrollPosition >= window.innerHeight / 2) {
    scrollTo.classList.add('active');
  } else {
    scrollTo.classList.remove('active');
  }

  // 탑 버튼 클릭 이벤트
  topButton.onclick = () => {
    window.scrollTo(0, {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  };
}

function footerDropDown() {
  const content = document.querySelector('.site-wrap');
  content.addEventListener('click', ()=> {
    content.classList.toggle('active');
  })
}

function lang_chg(c){
  $.ajax({
    url : "/ajax.lang.php",
    data : {"lang":c},
    type : "post",
    success : function(data){
      location.reload();
    }
  });
}
