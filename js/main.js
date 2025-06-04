// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');

// Configuration for backend URLs
const config = {
    development: 'http://localhost:3000',
    production: 'https://kamal-singh-portfolio.onrender.com' // This is your actual Render URL
};

// Use the appropriate backend URL based on environment
const backendUrl = window.location.hostname === 'localhost' ? config.development : config.production;

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Basic form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const phone = document.getElementById('phone').value.trim(); // Get phone number
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            // Data to send to the backend
            const formData = {
                from_name: name,
                from_email: email,
                message: message,
                phone: phone, // Include phone number
            };
            
            // Send data to backend endpoint
            const response = await fetch(`${backendUrl}/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                // Show error message from backend
                alert(`Failed to send message: ${result.message || 'Unknown error'}`);
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Sorry, there was an error sending your message. Please try again later.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about, .projects, .contact').forEach(section => {
    observer.observe(section);
});

// Add animation classes to CSS
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .about, .projects, .contact {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .about.animate, .projects.animate, .contact.animate {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`);

// Scroll Progress Bar
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPosition = window.pageYOffset;
    const progressPercentage = (scrollPosition / totalHeight) * 100;
    
    scrollProgress.style.width = `${progressPercentage}%`;
});

// Circular Scroll Indicator with Scroll to Top
const circularScrollIndicator = document.getElementById('circular-scroll-indicator');

window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPosition = window.pageYOffset;
    const progressPercentage = (scrollPosition / totalHeight) * 100;
    
    // Update circular indicator progress
    circularScrollIndicator.style.background = `conic-gradient(var(--primary-color) ${progressPercentage}%, #f3f3f3 ${progressPercentage}%)`;

    // Show/hide indicator based on scroll position
    if (scrollPosition > 200) { // Show after scrolling 200px, adjust as needed
        circularScrollIndicator.classList.add('show');
    } else {
        circularScrollIndicator.classList.remove('show');
    }
});

// Scroll to top on click
circularScrollIndicator.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling effect
    });
}); 