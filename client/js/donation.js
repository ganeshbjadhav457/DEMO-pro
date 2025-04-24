// const DonationPage = (function () {
//     // Configuration
//     const CONFIG = {
//         UPI_ID: '9022765350@ybl',
//         PAYEE_NAME: 'Ganesh Jadhav',
//         IMPACT: {
//             100: "Feeds 5 street dogs for a day",
//             300: "Supports a feeding station for 3 days",
//             500: "Provides meals for 10 dogs for a week",
//             1000: "Sponsors a feeding station for a week"
//         }
//     };

//     // DOM Elements
//     const elements = {
//         amountOptions: null,
//         customAmountField: null,
//         customAmountInput: null,
//         donationForm: null,
//         qrContainer: null,
//         qrCanvas: null,
//         qrAmountDisplay: null,
//         impactDisplay: null,
//         mealsProvided: null,
//         dogsHelped: null,
//         daysCovered: null,
//         qrPaymentSection: null,
//         appPaymentSection: null,
//         paymentMethodRadios: null
//     };

//     // State
//     const state = {
//         selectedAmount: 0,
//         qrCodeInitialized: false,
//         paymentMethod: 'qr'
//     };

//     // Cache DOM elements
//     function cacheDOMElements() {
//         elements.amountOptions = document.querySelectorAll('.amount-option');
//         elements.customAmountField = document.getElementById('customAmountField');
//         elements.customAmountInput = document.getElementById('amount');
//         elements.donationForm = document.getElementById('donationForm');
//         elements.qrContainer = document.getElementById('qr-code-container');
//         elements.qrAmountDisplay = document.getElementById('qr-amount-display');
//         elements.mealsProvided = document.getElementById('meals-provided');
//         elements.dogsHelped = document.getElementById('dogs-helped');
//         elements.daysCovered = document.getElementById('days-covered');
//         elements.qrPaymentSection = document.getElementById('qrPaymentSection');
//         elements.appPaymentSection = document.getElementById('appPaymentSection');
//         elements.paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
//     }

//     // Set donation type from URL parameters if present
//     function setDonationTypeFromURL() {
//         const urlParams = new URLSearchParams(window.location.search);
//         const type = urlParams.get('type');
//         const messageElement = document.getElementById('donation-type-message');
        
//         if (messageElement && type) {
//             switch(type) {
//                 case 'one-time':
//                     messageElement.textContent = 'Your one-time contribution helps feed street dogs in need';
//                     break;
//                 case 'monthly':
//                     messageElement.textContent = 'Your monthly support provides consistent meals for street dogs';
//                     break;
//                 case 'sponsor':
//                     messageElement.textContent = 'Sponsor a feeding station and help sustain our operations';
//                     break;
//             }
//         }
//     }

//     // Update impact display based on selected amount
//     function updateImpact(amount) {
//         if (!isNaN(amount) && amount > 0) {
//             let impactText = '';
//             const amounts = Object.keys(CONFIG.IMPACT).map(Number).sort((a, b) => a - b);
            
//             for (let i = amounts.length - 1; i >= 0; i--) {
//                 if (amount >= amounts[i]) {
//                     impactText = CONFIG.IMPACT[amounts[i]];
//                     break;
//                 }
//             }
            
//             if (elements.mealsProvided && elements.dogsHelped && elements.daysCovered) {
//                 const meals = Math.floor(amount / 20);
//                 const dogs = Math.floor(meals / 10);
//                 const days = Math.floor(amount / 100);
                
//                 elements.mealsProvided.textContent = meals;
//                 elements.dogsHelped.textContent = dogs;
//                 elements.daysCovered.textContent = days;
//             }
//         }
//     }

//     // Load QRCode library dynamically
//     function loadQRCodeLibrary() {
//         return new Promise((resolve, reject) => {
//             if (window.QRCode) {
//                 resolve();
//                 return;
//             }
            
//             const script = document.createElement('script');
//             script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
//             script.onload = resolve;
//             script.onerror = reject;
//             document.head.appendChild(script);
//         });
//     }

//     // Setup UPI QR code
//     function setupUpiQrCode() {
//         if (!elements.qrContainer) return;
    
//         elements.qrContainer.innerHTML = '';
//         elements.qrCanvas = document.createElement('canvas');
//         elements.qrCanvas.id = 'qr-canvas';
//         elements.qrCanvas.width = 200;
//         elements.qrCanvas.height = 200;
        
//         elements.qrContainer.appendChild(elements.qrCanvas);
//         state.qrCodeInitialized = true;
//     }

//     // Generate or update QR code
//     function updateQRCode(amount) {
//         if (!state.qrCodeInitialized || !elements.qrCanvas || !window.QRCode) return;
        
//         amount = parseInt(amount);
//         if (isNaN(amount)) {
//             elements.qrContainer.innerHTML = '<p>Enter a valid amount to generate QR code</p>';
//             return;
//         }
        
//         const upiUrl = amount > 0 
//             ? `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${amount}&cu=INR&tn=Donation`
//             : `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&cu=INR&tn=Donation`;
        
//         try {
//             QRCode.toCanvas(
//                 elements.qrCanvas,
//                 upiUrl,
//                 {
//                     width: 200,
//                     margin: 1,
//                     color: {
//                         dark: '#000000',
//                         light: '#ffffff'
//                     },
//                     errorCorrectionLevel: 'H'
//                 },
//                 function (error) {
//                     if (error) {
//                         console.error('QR code generation error:', error);
//                         elements.qrContainer.innerHTML = '<p class="qr-error">QR code could not be generated</p>';
//                     } else if (elements.qrAmountDisplay) {
//                         elements.qrAmountDisplay.textContent = amount > 0 ? `₹${amount}` : '';
//                     }
//                 }
//             );
//         } catch (error) {
//             console.error('QR code generation exception:', error);
//             elements.qrContainer.innerHTML = '<p class="qr-error">Error generating QR code</p>';
//         }
//     }

//     // Handle amount selection
//     function setupAmountSelection() {
//         if (!elements.amountOptions || elements.amountOptions.length === 0) return;

//         elements.amountOptions.forEach(option => {
//             option.addEventListener('click', function() {
//                 elements.amountOptions.forEach(opt => opt.classList.remove('active', 'selected'));
//                 this.classList.add('active', 'selected');

//                 const isCustom = this.dataset.amount === 'custom';
//                 if (elements.customAmountField) {
//                     elements.customAmountField.style.display = isCustom ? 'block' : 'none';
//                 }

//                 if (!isCustom) {
//                     state.selectedAmount = parseInt(this.dataset.amount);
//                     updateImpact(state.selectedAmount);
//                     if (state.paymentMethod === 'qr') {
//                         updateQRCode(state.selectedAmount);
//                     }
//                 } else if (elements.customAmountInput) {
//                     elements.customAmountInput.focus();
//                     elements.customAmountInput.value = '';
//                     state.selectedAmount = 0;
//                     if (state.paymentMethod === 'qr') {
//                         updateQRCode(0);
//                     }
//                 }
//             });
//         });

//         if (elements.customAmountInput) {
//             let timeout;
//             elements.customAmountInput.addEventListener('input', function() {
//                 clearTimeout(timeout);
//                 timeout = setTimeout(() => {
//                     const amount = parseInt(this.value);
//                     if (!isNaN(amount)) {
//                         state.selectedAmount = amount;
//                         updateImpact(state.selectedAmount);
//                         if (state.paymentMethod === 'qr') {
//                             updateQRCode(state.selectedAmount);
//                         }
//                     } else if (state.paymentMethod === 'qr') {
//                         updateQRCode(0);
//                     }
//                 }, 500);
//             });
//         }

//         // Select first amount option by default
//         if (elements.amountOptions.length > 0) {
//             elements.amountOptions[0].click();
//         }
//     }

//     // Handle payment method selection
//     function setupPaymentMethodSelection() {
//         if (!elements.paymentMethodRadios || elements.paymentMethodRadios.length === 0) return;

//         elements.paymentMethodRadios.forEach(radio => {
//             radio.addEventListener('change', function() {
//                 state.paymentMethod = this.value;
//                 if (this.value === 'qr') {
//                     elements.qrPaymentSection.style.display = 'block';
//                     elements.appPaymentSection.style.display = 'none';
//                     updateQRCode(state.selectedAmount);
//                 } else {
//                     elements.qrPaymentSection.style.display = 'none';
//                     elements.appPaymentSection.style.display = 'block';
//                 }
//             });
//         });
//     }

//     // Handle form submission
//     function setupFormSubmission() {
//         if (!elements.donationForm) return;

//         elements.donationForm.addEventListener('submit', async function(e) {
//             e.preventDefault();
            
//             if (state.selectedAmount <= 0) {
//                 showAlert('Please select or enter a valid donation amount', 'error');
//                 return;
//             }

//             // Collect form data
//             const formData = {
//                 donorName: document.getElementById('donor-name').value,
//                 email: document.getElementById('donor-email').value,
//                 phone: document.getElementById('donor-phone').value,
//                 amount: state.selectedAmount,
//                 donationType: document.querySelector('input[name="donationType"]:checked')?.value || 'one-time',
//                 paymentMethod: state.paymentMethod,
//                 upiId: document.getElementById('upi-id')?.value || '',
//                 receiptRequested: document.querySelector('input[name="receipt"]')?.checked || false,
//                 anonymous: document.querySelector('input[name="anonymous"]')?.checked || false
//             };

//             try {
//                 // Send donation data to backend
//                 const response = await fetch('http://localhost:5000/api/donations', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formData)
//                 });

//                 const data = await response.json();

//                 if (!response.ok) {
//                     throw new Error(data.message || 'Donation submission failed');
//                 }

//                 if (state.paymentMethod === 'app') {
//                     // Open UPI app for payment
//                     const upiUrl = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${state.selectedAmount}&cu=INR&tn=Donation`;
//                     window.location.href = upiUrl;
                    
//                     // Fallback for if the UPI URL scheme doesn't work
//                     setTimeout(() => {
//                         window.location.href = `https://upayi.link/pay/?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${state.selectedAmount}&cu=INR&tn=Donation`;
//                     }, 250);
//                 } else {
//                     // For QR code payment, just show success message
//                     showAlert('Donation submitted successfully! Please scan the QR code to complete payment.', 'success');
//                 }

//             } catch (error) {
//                 console.error('Donation submission error:', error);
//                 showAlert(error.message || 'Failed to process donation. Please try again.', 'error');
//             }
//         });
//     }

//     // Show alert function
//     function showAlert(message, type) {
//         const existingAlert = document.querySelector('.form-alert');
//         if (existingAlert) {
//             existingAlert.remove();
//         }
        
//         const alert = document.createElement('div');
//         alert.className = `form-alert form-alert-${type}`;
//         alert.textContent = message;
        
//         const form = document.querySelector('form');
//         if (form) {
//             form.parentNode.insertBefore(alert, form);
//         } else {
//             document.body.appendChild(alert);
//         }
        
//         setTimeout(() => {
//             alert.remove();
//         }, 5000);
//     }

//     // Initialize the page
//     function init() {
//         try {
//             cacheDOMElements();
//             setDonationTypeFromURL();
            
//             setupUpiQrCode();
//             setupAmountSelection();
//             setupPaymentMethodSelection();
//             setupFormSubmission();
            
//             if (state.paymentMethod === 'qr') {
//                 loadQRCodeLibrary()
//                     .then(() => updateQRCode(state.selectedAmount))
//                     .catch(error => {
//                         console.error('Failed to load QR code library:', error);
//                         if (elements.qrContainer) {
//                             elements.qrContainer.innerHTML = '<p class="qr-error">Payment option unavailable</p>';
//                         }
//                     });
//             }
//         } catch (error) {
//             console.error('Initialization error:', error);
//         }
//     }

//     return {
//         init: init
//     };
// })();

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     DonationPage.init();
// });



const DonationPage = (function () {
    // Configuration
    const CONFIG = {
        UPI_ID: '9022765350@ybl',
        PAYEE_NAME: 'Ganesh Jadhav',
        IMPACT: {
            100: "Feeds 5 street dogs for a day",
            300: "Supports a feeding station for 3 days",
            500: "Provides meals for 10 dogs for a week",
            1000: "Sponsors a feeding station for a week"
        }
    };

    // DOM Elements
    const elements = {
        amountOptions: null,
        customAmountField: null,
        customAmountInput: null,
        donationForm: null,
        qrContainer: null,
        qrCanvas: null,
        qrAmountDisplay: null,
        impactDisplay: null,
        mealsProvided: null,
        dogsHelped: null,
        daysCovered: null,
        qrPaymentSection: null,
        appPaymentSection: null,
        paymentMethodRadios: null
    };

    // State
    const state = {
        selectedAmount: 0,
        qrCodeInitialized: false,
        paymentMethod: 'qr'
    };

    // Cache DOM elements
    function cacheDOMElements() {
        elements.amountOptions = document.querySelectorAll('.amount-option');
        elements.customAmountField = document.getElementById('customAmountField');
        elements.customAmountInput = document.getElementById('amount');
        elements.donationForm = document.getElementById('donationForm');
        elements.qrContainer = document.getElementById('qr-code-container');
        elements.qrAmountDisplay = document.getElementById('qr-amount-display');
        elements.mealsProvided = document.getElementById('meals-provided');
        elements.dogsHelped = document.getElementById('dogs-helped');
        elements.daysCovered = document.getElementById('days-covered');
        elements.qrPaymentSection = document.getElementById('qrPaymentSection');
        elements.appPaymentSection = document.getElementById('appPaymentSection');
        elements.paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    }

    // Set donation type from URL parameters if present
    function setDonationTypeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const messageElement = document.getElementById('donation-type-message');
        
        if (messageElement && type) {
            switch(type) {
                case 'one-time':
                    messageElement.textContent = 'Your one-time contribution helps feed street dogs in need';
                    break;
                case 'monthly':
                    messageElement.textContent = 'Your monthly support provides consistent meals for street dogs';
                    break;
                case 'sponsor':
                    messageElement.textContent = 'Sponsor a feeding station and help sustain our operations';
                    break;
            }
        }
    }

    // Update impact display based on selected amount
    function updateImpact(amount) {
        if (!isNaN(amount) && amount > 0) {
            let impactText = '';
            const amounts = Object.keys(CONFIG.IMPACT).map(Number).sort((a, b) => a - b);
            
            for (let i = amounts.length - 1; i >= 0; i--) {
                if (amount >= amounts[i]) {
                    impactText = CONFIG.IMPACT[amounts[i]];
                    break;
                }
            }
            
            if (elements.mealsProvided && elements.dogsHelped && elements.daysCovered) {
                const meals = Math.floor(amount / 20);
                const dogs = Math.floor(meals / 10);
                const days = Math.floor(amount / 100);
                
                elements.mealsProvided.textContent = meals;
                elements.dogsHelped.textContent = dogs;
                elements.daysCovered.textContent = days;
            }
        }
    }

    // Load QRCode library dynamically
    function loadQRCodeLibrary() {
        return new Promise((resolve, reject) => {
            if (window.QRCode) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Setup UPI QR code
    function setupUpiQrCode() {
        if (!elements.qrContainer) return;
    
        elements.qrContainer.innerHTML = '';
        elements.qrCanvas = document.createElement('canvas');
        elements.qrCanvas.id = 'qr-canvas';
        elements.qrCanvas.width = 200;
        elements.qrCanvas.height = 200;
        
        elements.qrContainer.appendChild(elements.qrCanvas);
        state.qrCodeInitialized = true;
    }

    // Generate or update QR code
    function updateQRCode(amount) {
        if (!state.qrCodeInitialized || !elements.qrCanvas || !window.QRCode) return;
        
        amount = parseInt(amount);
        if (isNaN(amount)) {
            elements.qrContainer.innerHTML = '<p>Enter a valid amount to generate QR code</p>';
            return;
        }
        
        const upiUrl = amount > 0 
            ? `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${amount}&cu=INR&tn=Donation`
            : `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&cu=INR&tn=Donation`;
        
        try {
            QRCode.toCanvas(
                elements.qrCanvas,
                upiUrl,
                {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    },
                    errorCorrectionLevel: 'H'
                },
                function (error) {
                    if (error) {
                        console.error('QR code generation error:', error);
                        elements.qrContainer.innerHTML = '<p class="qr-error">QR code could not be generated</p>';
                    } else if (elements.qrAmountDisplay) {
                        elements.qrAmountDisplay.textContent = amount > 0 ? `₹${amount}` : '';
                    }
                }
            );
        } catch (error) {
            console.error('QR code generation exception:', error);
            elements.qrContainer.innerHTML = '<p class="qr-error">Error generating QR code</p>';
        }
    }

    // Handle amount selection
    function setupAmountSelection() {
        if (!elements.amountOptions || elements.amountOptions.length === 0) return;

        elements.amountOptions.forEach(option => {
            option.addEventListener('click', function() {
                elements.amountOptions.forEach(opt => opt.classList.remove('active', 'selected'));
                this.classList.add('active', 'selected');

                const isCustom = this.dataset.amount === 'custom';
                if (elements.customAmountField) {
                    elements.customAmountField.style.display = isCustom ? 'block' : 'none';
                }

                if (!isCustom) {
                    state.selectedAmount = parseInt(this.dataset.amount);
                    updateImpact(state.selectedAmount);
                    if (state.paymentMethod === 'qr') {
                        updateQRCode(state.selectedAmount);
                    }
                } else if (elements.customAmountInput) {
                    elements.customAmountInput.focus();
                    elements.customAmountInput.value = '';
                    state.selectedAmount = 0;
                    if (state.paymentMethod === 'qr') {
                        updateQRCode(0);
                    }
                }
            });
        });

        if (elements.customAmountInput) {
            let timeout;
            elements.customAmountInput.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    const amount = parseInt(this.value);
                    if (!isNaN(amount)) {
                        state.selectedAmount = amount;
                        updateImpact(state.selectedAmount);
                        if (state.paymentMethod === 'qr') {
                            updateQRCode(state.selectedAmount);
                        }
                    } else if (state.paymentMethod === 'qr') {
                        updateQRCode(0);
                    }
                }, 500);
            });
        }

        // Select first amount option by default
        if (elements.amountOptions.length > 0) {
            elements.amountOptions[0].click();
        }
    }

    // Handle payment method selection
    function setupPaymentMethodSelection() {
        if (!elements.paymentMethodRadios || elements.paymentMethodRadios.length === 0) return;

        elements.paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                state.paymentMethod = this.value;
                if (this.value === 'qr') {
                    elements.qrPaymentSection.style.display = 'block';
                    elements.appPaymentSection.style.display = 'none';
                    updateQRCode(state.selectedAmount);
                } else {
                    elements.qrPaymentSection.style.display = 'none';
                    elements.appPaymentSection.style.display = 'block';
                }
            });
        });
    }

    // Handle form submission
    function setupFormSubmission() {
        if (!elements.donationForm) return;

        elements.donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (state.selectedAmount <= 0) {
                showAlert('Please select or enter a valid donation amount', 'error');
                return;
            }

            const formData = {
                donorName: document.getElementById('donor-name').value,
                email: document.getElementById('donor-email').value,
                phone: document.getElementById('donor-phone').value,
                amount: state.selectedAmount,
                donationType: document.querySelector('input[name="donationType"]:checked')?.value || 'one-time',
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'qr',
                upiId: document.getElementById('upi-id')?.value || '',
                receiptRequested: document.querySelector('input[name="receipt"]')?.checked || false,
                anonymous: document.querySelector('input[name="anonymous"]')?.checked || false
            };

            try {
                 const response = await fetch('http://localhost:5000/api/donations', {
                 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Donation submission failed');
                }

                // Show appropriate message based on payment method
                if (formData.paymentMethod === 'qr') {
                    showAlert('Thank you! Your QR code donation is complete.', 'success');
                } else {
                    showAlert('Donation submitted! Please complete the UPI payment.', 'success');
                    // Redirect to UPI app
                    const upiUrl = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${state.selectedAmount}&cu=INR&tn=Donation`;
                    window.location.href = upiUrl;
                    
                    // Fallback
                    setTimeout(() => {
                        window.location.href = `https://upayi.link/pay/?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.PAYEE_NAME)}&am=${state.selectedAmount}&cu=INR&tn=Donation`;
                    }, 250);
                }

            } catch (error) {
                console.error('Donation submission error:', error);
                showAlert(error.message || 'Failed to process donation. Please try again.', 'error');
            }
        });
    }

    // Show alert function
    function showAlert(message, type) {
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `form-alert form-alert-${type}`;
        alert.textContent = message;
        
        const form = document.querySelector('form');
        if (form) {
            form.parentNode.insertBefore(alert, form);
        } else {
            document.body.appendChild(alert);
        }
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Initialize the page
    function init() {
        try {
            cacheDOMElements();
            setDonationTypeFromURL();
            
            setupUpiQrCode();
            setupAmountSelection();
            setupPaymentMethodSelection();
            setupFormSubmission();
            
            if (state.paymentMethod === 'qr') {
                loadQRCodeLibrary()
                    .then(() => updateQRCode(state.selectedAmount))
                    .catch(error => {
                        console.error('Failed to load QR code library:', error);
                        if (elements.qrContainer) {
                            elements.qrContainer.innerHTML = '<p class="qr-error">Payment option unavailable</p>';
                        }
                    });
            }
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    return {
        init: init
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    DonationPage.init();
});
