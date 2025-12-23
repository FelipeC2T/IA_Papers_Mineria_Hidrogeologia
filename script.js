// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Smooth scroll to top of content
            window.scrollTo({
                top: document.querySelector('.tabs').offsetTop - 20,
                behavior: 'smooth'
            });
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.info-card, .case-card, .model-card, .reference-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Stats counter animation
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end;
            }
        };
        window.requestAnimationFrame(step);
    };

    // Observe stat numbers for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                const text = entry.target.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    const number = parseInt(match[1]);
                    entry.target.setAttribute('data-animated', 'true');
                    animateValue(entry.target, 0, number, 1500);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-small-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add hover effect to model cards
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Highlight search functionality (optional)
    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    // Add keyboard navigation for tabs
    document.addEventListener('keydown', (e) => {
        const activeTabIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
        
        if (e.key === 'ArrowRight') {
            const nextIndex = (activeTabIndex + 1) % tabButtons.length;
            tabButtons[nextIndex].click();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (activeTabIndex - 1 + tabButtons.length) % tabButtons.length;
            tabButtons[prevIndex].click();
        }
    });

    // Add print functionality
    const addPrintButton = () => {
        const printBtn = document.createElement('button');
        printBtn.textContent = '🖨️ Imprimir';
        printBtn.className = 'download-btn';
        printBtn.style.position = 'fixed';
        printBtn.style.bottom = '2rem';
        printBtn.style.right = '2rem';
        printBtn.style.zIndex = '1000';
        printBtn.style.padding = '0.75rem 1.5rem';
        printBtn.style.cursor = 'pointer';
        printBtn.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        
        printBtn.addEventListener('click', () => {
            window.print();
        });
        
        document.body.appendChild(printBtn);
        
        // Hide print button on mobile
        if (window.innerWidth < 768) {
            printBtn.style.display = 'none';
        }
    };

    // Uncomment to enable print button
    // addPrintButton();

    // Add copy functionality to code blocks
    document.querySelectorAll('pre code').forEach(codeBlock => {
        const button = document.createElement('button');
        button.textContent = 'Copiar';
        button.className = 'copy-btn';
        button.style.position = 'absolute';
        button.style.top = '0.5rem';
        button.style.right = '0.5rem';
        button.style.padding = '0.25rem 0.75rem';
        button.style.fontSize = '0.75rem';
        button.style.background = 'var(--primary-blue)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        codeBlock.parentElement.style.position = 'relative';
        codeBlock.parentElement.appendChild(button);
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent);
            button.textContent = '✓ Copiado';
            setTimeout(() => {
                button.textContent = 'Copiar';
            }, 2000);
        });
    });

    // Add dark mode toggle (optional)
    const addDarkModeToggle = () => {
        const toggle = document.createElement('button');
        toggle.textContent = '🌙';
        toggle.className = 'dark-mode-toggle';
        toggle.style.position = 'fixed';
        toggle.style.top = '2rem';
        toggle.style.right = '2rem';
        toggle.style.zIndex = '1000';
        toggle.style.width = '50px';
        toggle.style.height = '50px';
        toggle.style.borderRadius = '50%';
        toggle.style.border = 'none';
        toggle.style.background = 'white';
        toggle.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toggle.style.cursor = 'pointer';
        toggle.style.fontSize = '1.5rem';
        toggle.style.transition = 'all 0.3s ease';
        
        let isDark = false;
        
        toggle.addEventListener('click', () => {
            isDark = !isDark;
            document.body.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : 'none';
            toggle.textContent = isDark ? '☀️' : '🌙';
        });
        
        document.body.appendChild(toggle);
    };

    // Uncomment to enable dark mode
    // addDarkModeToggle();

    // Add loading animation
    const showLoadingAnimation = () => {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100%';
        loader.style.height = '100%';
        loader.style.background = 'rgba(255,255,255,0.9)';
        loader.style.display = 'flex';
        loader.style.alignItems = 'center';
        loader.style.justifyContent = 'center';
        loader.style.zIndex = '9999';
        
        const spinner = loader.querySelector('.spinner');
        spinner.style.width = '60px';
        spinner.style.height = '60px';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid var(--primary-blue)';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);
        
        return loader;
    };

    // Add table of contents generator
    const generateTableOfContents = () => {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.style.position = 'fixed';
        toc.style.left = '2rem';
        toc.style.top = '50%';
        toc.style.transform = 'translateY(-50%)';
        toc.style.background = 'white';
        toc.style.padding = '1rem';
        toc.style.borderRadius = '10px';
        toc.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        toc.style.maxWidth = '200px';
        toc.style.display = 'none';
        
        const headings = document.querySelectorAll('h2, h3');
        const tocList = document.createElement('ul');
        tocList.style.listStyle = 'none';
        tocList.style.padding = '0';
        
        headings.forEach((heading, index) => {
            heading.id = heading.id || `heading-${index}`;
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = heading.textContent;
            link.href = `#${heading.id}`;
            link.style.textDecoration = 'none';
            link.style.color = 'var(--primary-blue)';
            link.style.fontSize = heading.tagName === 'H2' ? '0.9rem' : '0.8rem';
            link.style.paddingLeft = heading.tagName === 'H3' ? '1rem' : '0';
            item.appendChild(link);
            tocList.appendChild(item);
        });
        
        toc.appendChild(tocList);
        
        // Show TOC only on large screens
        if (window.innerWidth > 1400) {
            toc.style.display = 'block';
            document.body.appendChild(toc);
        }
    };

    // Uncomment to enable TOC
    // generateTableOfContents();

    // Add scroll progress indicator
    const addScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '4px';
        progressBar.style.background = 'var(--gradient-secondary)';
        progressBar.style.zIndex = '10000';
        progressBar.style.transition = 'width 0.2s ease';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    };

    addScrollProgress();

    // Log initialization
    console.log('✅ IA en Geociencias - Web initialized successfully');
    console.log('📊 Total tabs:', tabButtons.length);
    console.log('📄 Total sections:', tabContents.length);
});

// Export for potential external use
window.GeosciencesApp = {
    version: '1.0.0',
    initialized: true,
    features: {
        tabNavigation: true,
        scrollReveal: true,
        statsAnimation: true,
        scrollProgress: true,
        keyboardNavigation: true
    }
};
