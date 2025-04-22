document.addEventListener('DOMContentLoaded', function() {
    const volunteerForm = document.getElementById('volunteerForm');
    
    if (volunteerForm) {
        initializeVolunteerForm();
    }
});

function initializeVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    const locationSelect = document.getElementById('location');
    const otherLocationGroup = document.getElementById('other-location-group');
    
    // Show/hide other location field based on selection
    locationSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherLocationGroup.style.display = 'block';
        } else {
            otherLocationGroup.style.display = 'none';
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Add required indicators
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label) {
            label.classList.add('required');
        }
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(formValues)) {
        return;
    }
    
    // Prepare data for submission
    const submissionData = {
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        location: formValues.location === 'other' ? formValues['other-location'] : formValues.location,
        availability: Array.from(form.querySelectorAll('input[name="availability"]:checked')).map(el => el.value),
        experience: formValues.experience,
        motivation: formValues['why-volunteer']
    };
    
    try {
        // Send volunteer application to backend
        const response = await fetch('http://localhost:5000/api/volunteers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Volunteer application failed');
        }

        // Show success message
        showAlert('Thank you for your volunteer application! We will contact you soon.', 'success');
        
        // Reset form
        form.reset();
    } catch (error) {
        console.error('Volunteer application error:', error);
        showAlert(error.message || 'Failed to submit volunteer application. Please try again.', 'error');
    }
}

function validateForm(data) {
    // Check required fields
    if (!data.name || !data.email || !data.phone || !data.location || !data['why-volunteer']) {
        showAlert('Please fill in all required fields', 'error');
        return false;
    }
    
    // Validate email format
    if (!validateEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }
    
    // Check if "other" location is selected but not filled
    if (data.location === 'other' && !data['other-location']) {
        showAlert('Please specify your location', 'error');
        return false;
    }
    
    // Check at least one availability is selected
    const availabilityChecked = document.querySelectorAll('input[name="availability"]:checked').length > 0;
    if (!availabilityChecked) {
        showAlert('Please select at least one availability option', 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAlert(message, type) {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `form-alert form-alert-${type}`;
    alert.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert before form
    const form = document.getElementById('volunteerForm');
    if (form) {
        form.parentNode.insertBefore(alert, form);
    } else {
        document.body.appendChild(alert);
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}