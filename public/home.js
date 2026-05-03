// Contact form handler with Express backend
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        formStatus.innerHTML = '<div class="status sending">📧 Sending your message...</div>';
        
        try {
            // Send to Express backend
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Success!
                formStatus.innerHTML = `
                    <div class="status success">
                        ✅ ${result.message}
                    </div>
                `;
                contactForm.reset();
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.innerHTML = '';
                }, 5000);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            // Error handling
            formStatus.innerHTML = `
                <div class="status error">
                    ❌ ${error.message || 'Something went wrong. Please try again.'}
                </div>
            `;
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear error after 5 seconds
            setTimeout(() => {
                if (formStatus.innerHTML.includes('error')) {
                    formStatus.innerHTML = '';
                }
            }, 5000);
        }
    });
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
    .status {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 5px;
        text-align: center;
        animation: fadeIn 0.3s ease;
    }
    
    .status.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .status.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .status.sending {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);