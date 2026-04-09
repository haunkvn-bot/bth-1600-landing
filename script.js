document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. COUNTDOWN TIMER MÔ PHỎNG LƯU LOCALSTORAGE ---
    function startCountdown(durationInSeconds) {
        let savedTime = localStorage.getItem('bth1600_countdown');
        let endTime;

        if (savedTime) {
            endTime = parseInt(savedTime, 10);
        } else {
            endTime = Date.now() + durationInSeconds * 1000;
            localStorage.setItem('bth1600_countdown', endTime);
        }

        const displays = document.querySelectorAll('#main-countdown, #header-countdown, #form-countdown');

        function updateTimer() {
            let now = Date.now();
            let distance = endTime - now;

            if (distance < 0) {
                // Hết giờ, reset lại 24h để tạo fomo liên tục
                endTime = Date.now() + 24 * 3600 * 1000;
                localStorage.setItem('bth1600_countdown', endTime);
                distance = 24 * 3600 * 1000;
            }

            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Format 00:00:00
            let formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            displays.forEach(el => {
                if(el) el.innerText = formatted;
            });
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    // Khởi tạo countdown 24 giờ FOMO
    startCountdown(24 * 3600);


    // --- 2. XỬ LÝ SCROLL ANIMATIONS (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    const stickyBar = document.getElementById('sticky-bottom-bar');
    const heroSection = document.getElementById('hero');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Tùy chọn ngừng theo dõi sau khi đã xuất hiện để nhẹ máy
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));


    // Sticky Bar Observer (Hiện khi cuộn qua Hero)
    if(stickyBar && heroSection) {
        const stickyObs = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting && window.innerWidth <= 900) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        }, { threshold: 0.1 });
        stickyObs.observe(heroSection);
        
        // Cũng kiểm tra lúc resize
        window.addEventListener('resize', () => {
            if(window.innerWidth > 900) stickyBar.classList.remove('visible');
        });
    }

    // --- 3. POPUP ĐƠN HÀNG ẢO MỖI 6-12 GIÂY ---
    const orderPopup = document.getElementById('order-popup');
    const nameData = [
        "Anh Hoàng (Hà Nội)", "Chị Thu (TP.HCM)", "Chú Cường (Đà Nẵng)", 
        "Cô Hạnh (Hải Phòng)", "Anh Bách (Cần Thơ)", "Chị Linh (Bình Dương)"
    ];

    if(orderPopup) {
        function showPopup() {
            // Đổi tên ngẫu nhiên
            document.getElementById('popup-name').innerText = nameData[Math.floor(Math.random() * nameData.length)];
            
            // Hiện popup
            orderPopup.classList.add('show');
            
            // Ẩn sau 4 giây
            setTimeout(() => {
                orderPopup.classList.remove('show');
            }, 4000);
            
            // Next lần hiện ngẫu nhiên từ 8 - 15 giây
            const nextShow = Math.random() * 7000 + 8000;
            setTimeout(showPopup, nextShow);
        }

        // Bắt đầu show lần đầu sau 5 giây vô web
        setTimeout(showPopup, 5000);
    }

    // --- 4. SMOOTH SCROLL ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
