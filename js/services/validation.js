/**
 * Form Validation Utilities
 * 
 * Provides client-side validation for email, password, and domain-specific fields.
 * Validation rules match backend requirements.
 */

export const validationRules = {
    // Email validation
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Email is required.' };
            }
            if (!validationRules.email.pattern.test(value)) {
                return { valid: false, message: validationRules.email.message };
            }
            return { valid: true };
        }
    },

    // Password validation
    password: {
        required: true,
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: true,
        message: 'Password does not meet security requirements.',
        validate: (value) => {
            if (!value || value.length === 0) {
                return { valid: false, message: 'Password is required.' };
            }
            if (value.length < validationRules.password.minLength) {
                return { 
                    valid: false, 
                    message: `Password must be at least ${validationRules.password.minLength} characters.` 
                };
            }
            if (validationRules.password.requireUppercase && !/[A-Z]/.test(value)) {
                return { 
                    valid: false, 
                    message: 'Password must contain at least one uppercase letter.' 
                };
            }
            if (validationRules.password.requireLowercase && !/[a-z]/.test(value)) {
                return { 
                    valid: false, 
                    message: 'Password must contain at least one lowercase letter.' 
                };
            }
            if (validationRules.password.requireNumber && !/\d/.test(value)) {
                return { 
                    valid: false, 
                    message: 'Password must contain at least one number.' 
                };
            }
            if (validationRules.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                return { 
                    valid: false, 
                    message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).' 
                };
            }
            return { valid: true };
        }
    },

    // Full name
    fullName: {
        required: true,
        minLength: 2,
        message: 'Full name is required (minimum 2 characters).',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Full name is required.' };
            }
            if (value.trim().length < validationRules.fullName.minLength) {
                return { 
                    valid: false, 
                    message: `Full name must be at least ${validationRules.fullName.minLength} characters.` 
                };
            }
            return { valid: true };
        }
    },

    // Purchase form fields
    invoiceNumber: {
        required: true,
        message: 'Invoice number is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Invoice number is required.' };
            }
            return { valid: true };
        }
    },

    vendorName: {
        required: true,
        message: 'Vendor name is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Vendor name is required.' };
            }
            return { valid: true };
        }
    },

    // Sales form fields
    customerName: {
        required: true,
        message: 'Customer name is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Customer name is required.' };
            }
            return { valid: true };
        }
    },

    // Amount validation (for purchases, sales, cash)
    amount: {
        required: true,
        minValue: 0.01,
        message: 'Amount must be greater than zero.',
        validate: (value) => {
            if (value === null || value === undefined || value === '') {
                return { valid: false, message: 'Amount is required.' };
            }
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return { valid: false, message: 'Amount must be a valid number.' };
            }
            if (numValue <= 0) {
                return { valid: false, message: 'Amount must be greater than zero.' };
            }
            return { valid: true };
        }
    },

    // GST percentage validation
    gstPercentage: {
        required: false,
        minValue: 0,
        maxValue: 100,
        message: 'GST percentage must be between 0 and 100.',
        validate: (value) => {
            if (value === null || value === undefined || value === '') {
                return { valid: true }; // Optional field
            }
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return { valid: false, message: 'GST must be a valid number.' };
            }
            if (numValue < 0 || numValue > 100) {
                return { valid: false, message: 'GST percentage must be between 0 and 100.' };
            }
            return { valid: true };
        }
    },

    // Invoice date
    invoiceDate: {
        required: true,
        message: 'Invoice date is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Invoice date is required.' };
            }
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return { valid: false, message: 'Please enter a valid date.' };
            }
            return { valid: true };
        }
    },

    // Transaction date
    transactionDate: {
        required: true,
        message: 'Transaction date is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Transaction date is required.' };
            }
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return { valid: false, message: 'Please enter a valid date.' };
            }
            return { valid: true };
        }
    },

    // Transaction type
    transactionType: {
        required: true,
        message: 'Transaction type is required.',
        validate: (value) => {
            if (!value || value.trim() === '') {
                return { valid: false, message: 'Transaction type is required.' };
            }
            return { valid: true };
        }
    }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {string|number} value - Value to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateField(fieldName, value) {
    const rule = validationRules[fieldName];
    if (!rule) {
        return { valid: true }; // No validation rule defined
    }
    return rule.validate(value);
}

/**
 * Validate multiple fields
 * @param {Object} fields - Object with fieldName: value pairs
 * @returns {Object} { valid: boolean, errors: { fieldName: message, ... } }
 */
export function validateForm(fields) {
    const errors = {};
    let isValid = true;

    Object.entries(fields).forEach(([fieldName, value]) => {
        const result = validateField(fieldName, value);
        if (!result.valid) {
            errors[fieldName] = result.message;
            isValid = false;
        }
    });

    return { valid: isValid, errors };
}

/**
 * Add visual feedback for validation errors on form fields
 * @param {HTMLElement} formElement - Form element
 * @param {Object} errors - Errors object from validateForm
 */
export function displayValidationErrors(formElement, errors) {
    // Clear previous errors
    formElement.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
        const errorMsg = field.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });

    // Display new errors
    Object.entries(errors).forEach(([fieldName, message]) => {
        const input = formElement.querySelector(`[name="${fieldName}"]`);
        if (input) {
            const fieldContainer = input.closest('.form-field') || input.parentElement;
            fieldContainer.classList.add('error');

            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = message;
            fieldContainer.appendChild(errorMsg);
        }
    });
}

/**
 * Clear all validation error displays
 * @param {HTMLElement} formElement - Form element
 */
export function clearValidationErrors(formElement) {
    formElement.querySelectorAll('.form-field').forEach(field => {
        field.classList.remove('error');
        const errorMsg = field.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
}
