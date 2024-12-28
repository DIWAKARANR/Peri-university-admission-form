// Form navigation
let currentSection = 1;
const totalSections = 5;
const form = document.getElementById('registrationForm');
const sections = document.querySelectorAll('.form-section');
const progress = document.querySelector('.progress');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const submitBtn = document.querySelector('.submit-btn');

// Initialize form
function initForm() {
    createPageDots();
    updateFormNavigation();
    sections[0].classList.add('active');
    updateProgress();
    setupPasswordToggles();
    setupDynamicDepartments();
}

// Create page dots
function createPageDots() {
    const dotsContainer = document.querySelector('.page-dots');
    for (let i = 0; i < totalSections; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    }
}

// Update navigation state
function updateFormNavigation() {
    prevBtn.disabled = currentSection === 1;
    nextBtn.style.display = currentSection === totalSections ? 'none' : 'block';
    submitBtn.style.display = currentSection === totalSections ? 'block' : 'none';
    
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSection - 1);
    });
}

// Update progress bar
function updateProgress() {
    const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;
    progress.style.width = `${progressPercentage}%`;
}

// Navigate between sections
function navigateSection(direction) {
    const currentSectionEl = document.querySelector(`.form-section[data-section="${currentSection}"]`);
    
    if (direction === 'next' && !validateSection(currentSectionEl)) {
        shakePage();
        return;
    }

    currentSectionEl.classList.remove('active');
    currentSection += direction === 'next' ? 1 : -1;
    document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
    
    updateFormNavigation();
    updateProgress();
}

// Setup event listeners
nextBtn.addEventListener('click', () => navigateSection('next'));
prevBtn.addEventListener('click', () => navigateSection('prev'));

// Validate current section
function validateSection(section) {
    let isValid = true;
    const inputs = section.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.required && !input.value) {
            markFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            markFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.id === 'phone' && input.value && !validatePhone(input.value)) {
            markFieldError(input, 'Please enter a valid 10-digit phone number');
            isValid = false;
        } else if (input.id === 'password' && input.value && !validatePassword(input.value)) {
            markFieldError(input, 'Password must meet complexity requirements');
            isValid = false;
        } else if (input.id === 'confirmPassword' && input.value !== document.getElementById('password').value) {
            markFieldError(input, 'Passwords do not match');
            isValid = false;
        }
    });
    
    return isValid;
}

// Field validation functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
}

// Error handling
function markFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    field.addEventListener('input', function() {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }, { once: true });
}

// Animation for invalid section
function shakePage() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentSection}"]`);
    currentSection.classList.add('shake');
    setTimeout(() => currentSection.classList.remove('shake'), 500);
}

// Password visibility toggle
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}

// Dynamic department options
function setupDynamicDepartments() {
    const departmentsByDegree = {
        'bsc': ['Computer Science', 'Mathematics', 'Physics', 'Chemistry','Microbiology'],
        'bcom': ['General','Accounting', 'Finance', 'Banking','others'],
        'ba': ['English', 'History', 'Economics', 'Psychology'],
        'bca': ['Computer Applications', 'Software Development'],
        'B.E': ['Computer science','Mechanical','EEE','others']
    };

    document.getElementById('degree').addEventListener('change', function() {
        const departmentSelect = document.getElementById('department');
        departmentSelect.innerHTML = '<option value="">Select Department</option>';
        
        if (this.value) {
            departmentsByDegree[this.value].forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.toLowerCase().replace(/\s+/g, '-');
                option.textContent = dept;
                departmentSelect.appendChild(option);
            });
        }
    });
}

// Form submission
function validateForm(event) {
    event.preventDefault();
    
    if (!document.getElementById('declaration').checked) {
        alert('Please accept the declaration to proceed');
        return false;
    }
    
    if (validateSection(document.querySelector(`.form-section[data-section="${currentSection}"]`))) {
        showSuccessModal();
    }
    
    return false;
}

// Success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const registrationId = generateRegistrationId();
    document.getElementById('registrationId').textContent = registrationId;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    form.reset();
    window.location.reload();
}

// Generate unique registration ID
function generateRegistrationId() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MU${year}${random}`;
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize form on load
document.addEventListener('DOMContentLoaded', initForm);
