/* ── Const ───────────────────────────────────────────── */
const form = document.querySelector('.form-container');
const submitBtn = document.querySelector('button[type="submit"]');
const resetBtn = document.querySelector('button[type="reset"]');
const nameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
/* ── Helper functions ───────────────────────────────────────────── */
function showError(input) {
    let group = input.closest('.form-group');
    input.classList.add('error');
    let msg = group.querySelector('.error-message');
    if (msg) msg.classList.add('visible');
}
function showValid(input) {
    let group = input.closest('.form-group');
    input.classList.remove('error');
    let msg = group.querySelector('.error-message');
    if (msg) msg.classList.remove('visible');
    /* Swap the required marker for a checkmark */
    let marker = group.querySelector('.required-marker');
    if (marker) {
        marker.innerHTML = '<span class="check-icon"></span>';
    }
}
function clearState(input) {
    input.classList.remove('error');
    let group = input.closest('.form-group');
    let msg = group.querySelector('.error-message');
    if (msg) msg.classList.remove('visible');
    let marker = group.querySelector('.required-marker');
    if (marker) {
        marker.textContent = '*';
    }
}
function clearError(input) {
    input.classList.remove('error');
    let group = input.closest('.form-group');
    let msg = group.querySelector('.error-message');
    if (msg) msg.classList.remove('visible');
}
function clearRadioError() {
    let genderGroup = document.querySelector('.radio-group').closest('.form-group');
    genderGroup.classList.remove('error');
    let msg = genderGroup.querySelector('.error-message');
    if (msg) msg.classList.remove('visible');
}
function validateName() {
    /* .trim() removes invisible spaces at start/end so
    "   " doesn't count as a real name */
    let value = nameInput.value.trim();
    let group = nameInput.closest('.form-group');
    let msg = group.querySelector('.error-message');
    if (value === '') {
        msg.textContent = 'Nice try. We still need your name.';
        showError(nameInput);
        return false;
    }
    if (value.length > 50) {
        msg.textContent = 'We love the enthusiasm, but 50 characters max.';
        showError(nameInput);
        return false;
    }
    showValid(nameInput);
    return true;
}
function validateEmail() {
    let value = emailInput.value.trim();
    /* Checks for this format: [anything]@[anything].[anything]
    [^\s@]+ means one or more characters that are not a space or @ */
    const emailPattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '' || !emailPattern.test(value)) {
        showError(emailInput);
        return false;
    }
    showValid(emailInput);
    return true;
}
function validatePhone() {
    let value = phoneInput.value.trim();
    /* Vietnamese mobile numbers are always 10 digits starting with 0.
    /^(\+84|84|0)\d{9}$/ means: start with 0 or the country code +84, then exactly 9 more digits. */
    const phonePattern= /^(\+84|84|0)\d{9}$/;
    if (value === '') {
        showError(phoneInput);
        return false;
    }
    if (!phonePattern.test(value)) {
        showError(phoneInput);
        return false;
    }
    showValid(phoneInput);
    return true;
}
function validateGender() {
    let selected = document.querySelector('input[name="gender"]:checked');
    let group = document.querySelector('.radio-group').closest('.form-group');
    let msg = group.querySelector('.error-message');
    let marker = group.querySelector('.required-marker');
    if (!selected) {
        group.classList.add('error');
        if (msg) msg.classList.add('visible');
        if (marker) marker.textContent = '*';
        return false;
    }
    group.classList.remove('error');
    if (msg) msg.classList.remove('visible');
    if (marker) {
        marker.innerHTML = '<span class="check-icon"></span>';
    }
    return true;
}
/* Converts any mix of upper/lowercase into proper name formatting.
1. toLowerCase()  — flatten everything to lowercase first
2. split(' ')     — break the string into an array of words
3. map()          — run a function on each word in the array
4. charAt(0)      — grab the first character of the word
5. toUpperCase()  — capitalize just that first character
6. slice(1)       — grab the rest of the word (from index 1 onward)
7. join(' ')      — stitch the words back into one string          */
function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}
/* ─── Validate inputs ───────────────────────────── */
/* When a field is focused:
   - Clear its own full state
   - Strip errors from all other fields, but keep their checkmarks */
nameInput.addEventListener('focus', function() {
    clearState(nameInput);
    clearError(emailInput);
    clearError(phoneInput);
    clearRadioError();
});
emailInput.addEventListener('focus', function() {
    clearError(nameInput);
    clearState(emailInput);
    clearError(phoneInput);
    clearRadioError();
});
phoneInput.addEventListener('focus', function() {
    clearError(nameInput);
    clearError(emailInput);
    clearState(phoneInput);
    clearRadioError();
});
/* "blur" fires the moment the user clicks away from an input field. */
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
phoneInput.addEventListener('blur', validatePhone);
/* Radio buttons need a different event — 'change'
fires whenever the user picks a new option. */
document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
    radio.addEventListener('change', validateGender);
});
/* ─── CTA button event ───────────────────────────────── */
submitBtn.addEventListener('click', function(event) {
    /* Stop the browser's default behavior (page reload) */
    event.preventDefault();
    let isValidName = validateName();
    let isValidEmail = validateEmail();
    let isValidPhone = validatePhone();
    let isValidGender = validateGender();
    if (isValidName && isValidEmail && isValidPhone && isValidGender) {
        showSuccessScreen();
    }
});
/* ─── Reset button event ────────────────────────────────── */
resetBtn.addEventListener('click', function() {
    /* 1. Clear values from all fields */
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
        radio.checked = false;
    });
    document.querySelectorAll('input[name="hobbies[]"]').forEach(function(cb) {
        cb.checked = false;
    });
    document.getElementById('bio').value = '';
    /* 2. Clear all validation states and markers */
    clearState(nameInput);
    clearState(emailInput);
    clearState(phoneInput);
    let genderGroup= document.querySelector('.radio-group').closest('.form-group');
    genderGroup.classList.remove('error');
    let msg = genderGroup.querySelector('.error-message');
    let marker = genderGroup.querySelector('.required-marker');
    if (msg) msg.classList.remove('visible');
    if (marker) marker.textContent = '*';
});
/* ─── Success Screen ──────────────────────────────── */
function showSuccessScreen() {
    /* 1. Collect all submitted values */
    let name = toTitleCase(nameInput.value.trim());
    let email = emailInput.value.trim();
    let phone = phoneInput.value.trim();
    let genderMap = { '1': 'Nam', '0': 'Nữ', '2': 'Khác' };
    let genderVal = document.querySelector('input[name="gender"]:checked').value;
    let gender = genderMap[genderVal];
    let checkedBoxes = document.querySelectorAll('input[name="hobbies[]"]:checked');
    let hobbies = Array.from(checkedBoxes).map(function(cb) {
        return cb.closest('.checkbox-label').textContent.trim();
    });
    let hobbiesText = hobbies.length > 0 ? hobbies.join(', ') : 'Không có';
    let bio = document.getElementById('bio').value.trim() || 'Không có';
    /* 2. Hide the form */
    form.style.display = 'none';
    /* 3. Build the success card with all submitted values */
    const successDiv = document.createElement('div');
    successDiv.className = 'success-screen';
    successDiv.innerHTML =
        '<p class="success-icon">🎓</p>' +
        '<h2 class="success-title">Registration Complete. We’re Impressed!</h2>' +
        '<p class="success-body">Your Official Academic Record (So Far):</p>' +
        '<ul class="success-data">' +
        '<li><span class="data-label">Họ và tên</span><span class="data-value">' + name + '</span></li>' +
        '<li><span class="data-label">Email</span><span class="data-value">' + email + '</span></li>' +
        '<li><span class="data-label">Điện thoại</span><span class="data-value">' + phone + '</span></li>' +
        '<li><span class="data-label">Giới tính</span><span class="data-value">' + gender + '</span></li>' +
        '<li><span class="data-label">Sở thích</span><span class="data-value">' + hobbiesText + '</span></li>' +
        '<li><span class="data-label">Giới thiệu</span><span class="data-value">' + bio + '</span></li>' +
        '</ul>';
    document.querySelector('main').appendChild(successDiv);
}

