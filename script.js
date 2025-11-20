document.addEventListener('DOMContentLoaded', () => {
    // Timeline Scroll Animation
    function updateTimeline() {
        const timeline = document.querySelector('.timeline');
        const progressLine = document.querySelector('.timeline-progress');
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (!timeline || !progressLine) return;

        const timelineRect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate progress based on scroll position relative to timeline
        const startOffset = windowHeight / 2;
        const endOffset = windowHeight / 2;

        let progress = 0;

        if (timelineRect.top < startOffset) {
            const totalHeight = timeline.offsetHeight;
            const scrolled = startOffset - timelineRect.top;
            progress = Math.min(totalHeight, Math.max(0, scrolled));
            progressLine.style.height = `${progress}px`;
        } else {
            progressLine.style.height = '0px';
        }

        // Activate dots
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < windowHeight / 2) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });
});
