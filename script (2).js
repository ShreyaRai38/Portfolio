document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. Typing Animation
    // ==========================================
    const typingText = document.querySelector(".typing");
    if (typingText) {
        const words = [
            " a Tech-Driven Problem Solver",
            " an Analytical Thinker",
            " an AI Enthusiast"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typingText.textContent = currentWord.substring(0, charIndex);

            let typeSpeed = isDeleting ? 50 : 90;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 1600; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before typing next word
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    // ==========================================
    // 2. Mobile Navbar Toggle
    // ==========================================
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // 3. Scroll Reveal Animation (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll(
        ".stat-card, .project-card, .skill-card, .timeline-item, .contact-card, .cert-folder-card"
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add("show"));
    }

    // ==========================================
    // 4. Contact Form Submission (Direct to Gmail)
    // ==========================================
    const contactForm = document.querySelector(".contact-form");
    const sendBtn = document.getElementById("send-msg-btn");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !subject || !message) {
                if (formStatus) {
                    formStatus.style.display = "flex";
                    formStatus.className = "form-status error";
                    formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields.';
                }
                return;
            }

            const originalBtnHTML = sendBtn ? sendBtn.innerHTML : "";
            if (sendBtn) {
                sendBtn.disabled = true;
                sendBtn.innerHTML = '<span>SENDING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            }
            if (formStatus) {
                formStatus.style.display = "none";
            }

            try {
                const response = await fetch("https://formsubmit.co/ajax/shreyaraii2007@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _replyto: email,
                        subject: subject,
                        message: message,
                        _subject: `Portfolio Inquiry from ${name}: ${subject}`
                    })
                });

                const data = await response.json();

                if (response.ok || data.success === "true" || data.success === true) {
                    if (sendBtn) {
                        sendBtn.innerHTML = '<span>MESSAGE SENT!</span> <i class="fa-solid fa-check"></i>';
                        sendBtn.style.background = "#2e7d32";
                    }
                    if (formStatus) {
                        formStatus.style.display = "flex";
                        formStatus.className = "form-status success";
                        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent directly to Shreya\'s Gmail inbox.';
                    }
                    contactForm.reset();
                    setTimeout(() => {
                        if (sendBtn) {
                            sendBtn.disabled = false;
                            sendBtn.innerHTML = originalBtnHTML;
                            sendBtn.style.background = "";
                        }
                    }, 4000);
                } else {
                    throw new Error(data.message || "Submission error");
                }
            } catch (err) {
                console.error("FormSubmit Error:", err);
                if (formStatus) {
                    formStatus.style.display = "flex";
                    formStatus.className = "form-status error";
                    formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Could not send automatically. <a href="mailto:shreyaraii2007@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message) + '" style="color: inherit; text-decoration: underline; font-weight: 600; margin-left: 5px;">Click to email directly</a>.';
                }
                if (sendBtn) {
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = originalBtnHTML;
                }
            }
        });
    }

    // ==========================================
    // 5. Copy Drive Folder Link
    // ==========================================
    const copyDriveBtn = document.getElementById("copy-drive-btn");
    if (copyDriveBtn) {
        copyDriveBtn.addEventListener("click", async () => {
            const driveLink = copyDriveBtn.getAttribute("data-link") || "https://drive.google.com";
            try {
                await navigator.clipboard.writeText(driveLink);
                const originalContent = copyDriveBtn.innerHTML;
                copyDriveBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="copy-text">Link Copied!</span>';
                copyDriveBtn.style.background = "var(--color-primary)";
                copyDriveBtn.style.color = "#ffffff";
                setTimeout(() => {
                    copyDriveBtn.innerHTML = originalContent;
                    copyDriveBtn.style.background = "";
                    copyDriveBtn.style.color = "";
                }, 2200);
            } catch (err) {
                // Fallback prompt if clipboard API is restricted
                prompt("Copy this Google Drive folder link:", driveLink);
            }
        });
    }
});