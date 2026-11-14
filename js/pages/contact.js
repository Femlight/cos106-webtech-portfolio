/**
 * Functional & Technical Requirements:
 *  - Fields: Name, Email Address, Phone Number, Message
 *  - JavaScript Validation Rules:
 *      1. No field is empty
 *      2. Email format is valid (standard pattern check)
 *      3. Phone number contains ONLY digits (no letters, spaces, or special characters)
 *  - Real-time feedback on input/blur
 *  - Clean error styling and success confirmation banner
 */

(function () {
  'use strict';

  // DOM Elements
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const subjectInput = document.getElementById('subject');
  const otherPurposeGroup = document.getElementById('otherPurposeGroup');
  const otherPurposeInput = document.getElementById('otherPurpose');
  const alertSuccess = document.getElementById('alertSuccess');
  const alertDanger = document.getElementById('alertDanger');
  const successSummary = document.getElementById('successSummary');

  /**
   * Validation Rules
   */
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  // Prompt requirement: "Phone number contains only digits"
  const DIGITS_ONLY_REGEX = /^\d+$/;

  /**
   * Set field error state with accessible helper message
   */
  function setFieldError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');

    let errorElem = group.querySelector('.error-msg');
    if (!errorElem) {
      errorElem = document.createElement('small');
      errorElem.className = 'error-msg';
      group.appendChild(errorElem);
    }
    errorElem.textContent = message;
    errorElem.style.display = 'block';
  }

  /**
   * Clear field error state
   */
  function clearFieldError(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.remove('has-error');
    input.removeAttribute('aria-invalid');

    const errorElem = group.querySelector('.error-msg');
    if (errorElem) {
      errorElem.textContent = '';
      errorElem.style.display = 'none';
    }
  }

  /**
   * Field validators
   */
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      setFieldError(nameInput, 'Full name cannot be empty.');
      return false;
    }
    if (val.length < 2) {
      setFieldError(nameInput, 'Please enter at least 2 characters for your name.');
      return false;
    }
    clearFieldError(nameInput);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setFieldError(emailInput, 'Email address cannot be empty.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      setFieldError(emailInput, 'Please enter a valid email address (e.g., student@university.edu).');
      return false;
    }
    clearFieldError(emailInput);
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    if (!val) {
      setFieldError(phoneInput, 'Phone number cannot be empty.');
      return false;
    }
    // Strict requirement: Phone number contains ONLY digits
    if (!DIGITS_ONLY_REGEX.test(val)) {
      setFieldError(phoneInput, 'Phone number must contain only digits (0-9). Remove spaces, dashes, or letters.');
      return false;
    }
    if (val.length < 10 || val.length > 15) {
      setFieldError(phoneInput, 'Phone number must be between 10 and 15 digits.');
      return false;
    }
    clearFieldError(phoneInput);
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      setFieldError(messageInput, 'Message cannot be empty.');
      return false;
    }
    if (val.length < 10) {
      setFieldError(messageInput, 'Please enter a message with at least 10 characters.');
      return false;
    }
    clearFieldError(messageInput);
    return true;
  }

  function updateOtherPurposeVisibility() {
    const isOther = subjectInput && subjectInput.value === 'other';
    if (!otherPurposeGroup || !otherPurposeInput) return;

    otherPurposeGroup.hidden = !isOther;
    otherPurposeInput.required = isOther;
    if (!isOther) {
      otherPurposeInput.value = '';
      clearFieldError(otherPurposeInput);
    }
  }

  function validateOtherPurpose() {
    if (!otherPurposeInput || subjectInput.value !== 'other') return true;

    if (!otherPurposeInput.value.trim()) {
      setFieldError(otherPurposeInput, 'Please specify your purpose of inquiry.');
      return false;
    }

    clearFieldError(otherPurposeInput);
    return true;
  }

  /**
   * Handle Form Submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    // Hide any previous alert messages
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertDanger) alertDanger.style.display = 'none';

    // Run all validations
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    const isOtherPurposeValid = validateOtherPurpose();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid && isOtherPurposeValid;

    if (!isFormValid) {
      if (alertDanger) {
        alertDanger.textContent = 'Please correct the errors in the highlighted fields before submitting.';
        alertDanger.style.display = 'block';
        alertDanger.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Focus first invalid input
      const firstInvalid = contactForm.querySelector('.has-error input, .has-error textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submittedName = nameInput.value.trim();
    const submittedEmail = emailInput.value.trim();
    const submittedPhone = phoneInput.value.trim();
    const submittedSubject = subjectInput
      ? subjectInput.value === 'other'
        ? otherPurposeInput.value.trim()
        : subjectInput.options[subjectInput.selectedIndex].text
      : 'Portfolio Contact';
    const submittedMessage = messageInput.value.trim();
    const formData = new FormData();
    formData.append('name', submittedName);
    formData.append('email', submittedEmail);
    formData.append('phone', submittedPhone);
    formData.append('subject', submittedSubject);
    formData.append('message', submittedMessage);

    fetch('https://formsubmit.co/ajax/j.aretola6883@miva.edu.ng', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Email service returned HTTP ${response.status}`);
        }

        if (alertSuccess) {
          if (successSummary) {
            successSummary.textContent = 'Message sent.';
          } else {
            alertSuccess.textContent = 'Message sent.';
          }
          alertSuccess.style.display = 'block';
          alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach((input) => clearFieldError(input));
      })
      .catch((error) => {
        console.error('Failed to send contact message:', error);
        if (alertDanger) {
          alertDanger.textContent = 'Unable to send the message right now. Please try again later.';
          alertDanger.style.display = 'block';
          alertDanger.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
  }

  /**
   * XSS Helper
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Initialize Event Listeners
   */
  function init() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);

    // Real-time validation on blur and input
    if (nameInput) {
      nameInput.addEventListener('blur', validateName);
      nameInput.addEventListener('input', () => {
        if (nameInput.closest('.form-group').classList.contains('has-error')) validateName();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', validateEmail);
      emailInput.addEventListener('input', () => {
        if (emailInput.closest('.form-group').classList.contains('has-error')) validateEmail();
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', validatePhone);
      phoneInput.addEventListener('input', () => {
        if (phoneInput.closest('.form-group').classList.contains('has-error')) validatePhone();
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', validateMessage);
      messageInput.addEventListener('input', () => {
        if (messageInput.closest('.form-group').classList.contains('has-error')) validateMessage();
      });
    }

    if (subjectInput) {
      subjectInput.addEventListener('change', updateOtherPurposeVisibility);
    }

    if (otherPurposeInput) {
      otherPurposeInput.addEventListener('blur', validateOtherPurpose);
      otherPurposeInput.addEventListener('input', () => {
        if (otherPurposeInput.closest('.form-group').classList.contains('has-error')) {
          validateOtherPurpose();
        }
      });
    }

    updateOtherPurposeVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
