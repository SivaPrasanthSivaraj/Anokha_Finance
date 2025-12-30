// API Base URL - change this if deploying to a different server
const API_BASE = window.location.origin;

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('screenshot');
const fileLabel = document.getElementById('fileLabel');
const imagePreview = document.getElementById('imagePreview');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const messageDiv = document.getElementById('message');
const eventDayBadge = document.getElementById('eventDayBadge');

// Load event info on page load
async function loadEventInfo() {
    try {
        const response = await fetch(`${API_BASE}/api/event-info`);
        const data = await response.json();
        
        if (data.success) {
            // Format date nicely
            const dateObj = new Date(data.eventDate + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Show current date
            const currentDateEl = document.getElementById('currentDate');
            currentDateEl.textContent = formattedDate;
            
            // Show event day badge
            const dayLabel = data.eventDay === 0 ? 'Day 0 (Other Day)' : `Event Day ${data.eventDay}`;
            eventDayBadge.textContent = `📅 ${dayLabel}`;
            
            // Change badge color for Day 0
            if (data.eventDay === 0) {
                eventDayBadge.style.background = 'linear-gradient(135deg, #64748b, #475569)';
            }
        } else {
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN');
            eventDayBadge.textContent = '📅 Event Active';
        }
    } catch (error) {
        console.error('Error loading event info:', error);
        document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN');
        eventDayBadge.textContent = '📅 Event Active';
    }
}

// File input change handler
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        // Update label
        fileLabel.querySelector('.upload-text').textContent = file.name;
        fileLabel.querySelector('.upload-icon').textContent = '✓';
        fileLabel.style.borderColor = 'var(--success-color)';
        fileLabel.style.background = 'rgba(16, 185, 129, 0.05)';
        
        // Show image preview for image files
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.classList.add('show');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.remove('show');
        }
    }
});

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}

// Reset form
function resetForm() {
    uploadForm.reset();
    fileLabel.querySelector('.upload-text').textContent = 'Tap to select screenshot';
    fileLabel.querySelector('.upload-icon').textContent = '📸';
    fileLabel.style.borderColor = 'var(--border-color)';
    fileLabel.style.background = 'var(--background)';
    imagePreview.classList.remove('show');
    imagePreview.innerHTML = '';
}

// Set loading state
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Form submit handler
uploadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Hide previous messages
    messageDiv.classList.add('hidden');
    
    // Get form data
    const formData = new FormData(uploadForm);
    
    // Validate file
    const file = fileInput.files[0];
    if (!file) {
        showMessage('Please select a screenshot to upload', 'error');
        return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showMessage('File size must be less than 10MB', 'error');
        return;
    }
    
    // Show loading state
    setLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            const dayText = data.eventDay === 0 ? 'today' : `Day ${data.eventDay}`;
            showMessage(data.message || `Screenshot uploaded successfully to ${dayText}! ✓`, 'success');
            resetForm();
            
            // Reload event info in case day changed
            loadEventInfo();
        } else {
            showMessage(data.message || 'Upload failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});

// Load event info on page load
loadEventInfo();

// Add touch feedback for mobile
if ('ontouchstart' in window) {
    submitBtn.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    submitBtn.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
}
