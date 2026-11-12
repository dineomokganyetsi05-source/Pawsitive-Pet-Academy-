'use strict';

const COURSES = [
    {
        id: 'canine-obedience',
        name: 'Canine Obedience Training',
        length: '6 Months',
        price: 1500,
        image: 'images/canine-obedience-training.jpeg',
        purpose: 'To teach effective dog obedience and behavioural training techniques.',
        content: ['Basic commands', 'Leash training', 'Behaviour correction', 'Positive reinforcement', 'Socialisation techniques'] 
    },
    {
        id: 'pet-grooming',
        name: 'Pet Grooming',
        length: '6 Months',
        price: 1500,
        image: 'images/pet-grooming.jpeg',
        purpose: 'To provide professional grooming skills for domestic pets.',
        content: ['Coat care', 'Bathing techniques', 'Nail trimming', 'Ear and eye cleaning', 'Grooming equipment']
    },
    {
        id: 'pet-business-management',
        name: 'Pet Business Management',
        length: '6 Months',
        price: 1500,
        image: 'images/pet-business-management.jpeg',
        purpose: 'To prepare learners to operate a successful pet-related business.',
        content: ['Customer service', 'Marketing', 'Business planning', 'Financial management', 'Legal requirements']
    },
    {
        id: 'puppy-care',
        name: 'Puppy Care',
        length: '6 Weeks',
        price: 750,
        image: 'images/puppy-care.jpeg',
        purpose: 'To provide new puppy owners with essential care knowledge.',
        content:  ['Feeding', 'Vaccinations', 'Toilet training', 'Exercise', 'Socialisation']
    },
    {
        id: 'pet-first-aid',
        name: 'Pet First Aid',
        length: '6 Weeks',
        price: 750,
        image: 'images/pet-first-aid.jpeg',
        purpose: 'To provide emergency first aid knowledge for pets.',
        content: ['Minor injuries', 'CPR basics', 'Poison awareness', 'Heatstroke', 'Emergency transport']
    },
    {
        id: 'basic-dog-walking',
        name: 'Basic Dog Walking',
        length: '6 Weeks',
        price: 750,
        image: 'images/basic-dog-walking.jpeg',
        purpose: 'To teach safe and professional dog walking practices.',
        content: ['Walking equipment', 'Handling multiple dogs', 'Safety procedures', 'Exercise routines']
    },
    {
        id: 'animal-behaviour',
        name: 'Animal Behaviour',
        length: '6 Months',
        price: 1500,
        image: 'images/animal-behaviour.jpeg',
        purpose: 'To understand common pet behaviours and improve communication with animals.',
        content: ['Animal psychology', 'Reading body language', 'Stress management', 'Behaviour modification', 'Enrichment activities']
    },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
 
function findCourse(id) {
    return COURSES.find(course => course.id === id) || null;
}

function formatRand(amount) {
    return 'R' + String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}

function discountRate(courseCount) {
    if (courseCount >= 4) return 0.15;
    if (courseCount === 3) return 0.10;
    if (courseCount === 2) return 0.05;
    return 0;
}
 
function calculateTotals(ids) {
    const items = ids.map(findCourse).filter(Boolean);
    const subtotal = items.reduce((sum, course) => sum + course.price, 0);
    const rate = discountRate(items.length);
    const discount = Math.round(subtotal * rate);
    return { items, subtotal, rate, discount, total: subtotal - discount };
}
 
function makeReference(prefix) {
    return prefix + ' - ' + Math.floor(10000 + Math.random() * 90000);
}

function showMessage(element, html, type) {
    if (!element) return;
    element.className = 'status' + (type === 'error' ? ' error' : '');
    element.innerHTML = html;
    element.hidden = false;
}
 
function hideMessage(element) {
    if (element) element.hidden = true;
}

const memoryStore = {};

function getStorage(name) {
    try {
        const storage = window[name];
        const testKey = '__ppa_test__';
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return storage;
    } catch (error) {
        return null;  
    }
}

const localStore = getStorage('localStorage');
const sessionStore = getStorage('sessionStorage');
const hasLocalStorage = localStore !== null;
const hasSessionStorage = sessionStore !== null;
 
function readSaved(storage, key, fallback) {
    try {
        const raw = storage ? storage.getItem(key) : memoryStore[key];
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeSaved(storage, key, value) {
    const raw = JSON.stringify(value);
    try {
        if (storage) storage.setItem(key, raw);
        else memoryStore[key] = raw;
        return true;
    } catch (error) {
        memoryStore[key] = raw;
        return false;
    }
}
 
function getSelection() {
    const saved = readSaved(localStore, 'ppa.selection', []);
     return Array.isArray(saved) ? saved.filter((id, i) => findCourse(id) && saved.indexOf(id) === i) : [];
}
 
function setSelection(ids) {
    writeSaved(localStore, 'ppa.selection', ids);
    refreshQuoteBadge();
}
 
function addToSelection(id) {
    const ids = getSelection();
    if (!ids.includes(id)) ids.push(id);
    setSelection(ids);
}
 
function removeFromSelection(id) {
    setSelection(getSelection().filter(existing => existing !== id));
}

function initDropdown() {
    const dropdown = $('.dropdown');
    if (!dropdown) return;
    const toggle = $('.dropdown-toggle', dropdown);
 
    const setOpen = open => {
        dropdown.classList.toggle('open', open);
         dropdown.classList.toggle('force-closed', !open);
        toggle.setAttribute('aria-expanded', String(open));
    };
 
    toggle.addEventListener('click', event => {
        event.stopPropagation();
        setOpen(!dropdown.classList.contains('open'));
    });

    dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('force-closed'));
 
    document.addEventListener('click', event => {
        if (!dropdown.contains(event.target)) setOpen(false);
    });
 
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && dropdown.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

 
function initCurrentPage() {
    const file = window.location.pathname.split('/').pop() || 'index.html';

    const parent = {
        'six-month.html': 'courses.html',
        'six-weeks.html': 'courses.html',
        'course-details.html': 'courses.html',
        'quote.html': 'calculate-fees.html',
        'confirmation.html': 'enquire.html'
    };

    const target = parent[file] || file;
 
    $$('nav a').forEach(link => {
        const href = link.getAttribute('href');
        const isDropdownLink = link.closest('.dropdown-menu');
        if (isDropdownLink ? href === file : href === target) {
            link.setAttribute('aria-current', 'page');
        }
    });

    $$('.tabs a').forEach(link => {
        if (link.getAttribute('href') === file) link.setAttribute('aria-current', 'page');
    });
}
 
function refreshQuoteBadge() {
    const link = $('nav ul > li > a[href="calculate-fees.html"]');
    if (!link) return;
    const old = $('.nav-badge', link);
    if (old) old.remove();
 
    const count = getSelection().length;
    if (count === 0) return;
 
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = count;
    badge.setAttribute('aria-label', count + (count === 1 ? ' course selected' : ' courses selected'));
    link.appendChild(badge);
}

function initCourseDetails() {
    const title = $('#course-title');
    if (!title) return;
 
    const section = $('.course-detail');
    const requested = new URLSearchParams(window.location.search).get('course');
    const course = findCourse(requested || 'animal-behaviour');

    if (!course) {
        section.innerHTML =
            '<div><p class="status error" role="alert">Sorry, we could not find that course.</p>' +
            '<a href="courses.html" class="button">View All Courses</a></div>';
        return;
    }
 
    document.title = course.name + ' | Pawsitive Pet Academy';
    title.textContent = course.name;
    $('#course-duration').textContent = course.length;
    $('#course-price').textContent = formatRand(course.price);
    $('#course-purpose').textContent = course.purpose;
 
    const list = $('#course-content');
    list.innerHTML = '';
    course.content.forEach(text => {
        const item = document.createElement('li');
        item.textContent = text;
        list.appendChild(item);
    });
 
    const image = $('#course-image');
    image.alt = course.name + ' training';
    setImage(image, course.image);
 
    $('#ask-question').href = 'enquire.html?course=' + encodeURIComponent(course.id);

     const addButton = $('#add-to-quote');
    const message = $('#course-status');
 
    const showButtonState = () => {
        const added = getSelection().includes(course.id);
        addButton.textContent = added ? 'Added To Quote \u2713' : 'Add To Quote';
        addButton.setAttribute('aria-pressed', String(added));
    };
    showButtonState();
 
    addButton.addEventListener('click', event => {
        event.preventDefault();
        const added = getSelection().includes(course.id);
 
        if (added) {
            removeFromSelection(course.id);
            showMessage(message, course.name + ' was removed from your quote.', 'info');
        } else {
            addToSelection(course.id);
            let text = course.name + ' was added to your quote. <a href="calculate-fees.html">View your quote</a>';
            if (!hasLocalStorage) {
                text += '<br>Your browser is blocking saved data, so your quote will be lost if you leave this page.';
            }
            showMessage(message, text, hasLocalStorage ? 'info' : 'error');
        }
        showButtonState();
    });
}

function discountMessage(count) {
    if (count === 0) return 'No courses selected yet. Choose a course to start your quote.';
 
    const label = count + (count === 1 ? ' course' : ' courses') + ' selected';
    const percent = Math.round(discountRate(count) * 100);
    if (count >= 4) return label + ' - ' + percent + '% unlocked. You have reached the maximum discount.';
 
    const next = Math.round(discountRate(count + 1) * 100);
    return label + ' - ' + percent + '% unlocked. Add 1 more for ' + next + '%.';
}
 
function initSelectionPage() {
    const tbody = $('#selection-rows');
    if (!tbody) return;
 
    const emptyMessage = $('#empty-message');
    const requestButton = $('#request-quote');
    const status = $('#selection-status');
 
    function render() {
        const totals = calculateTotals(getSelection());
 
        tbody.innerHTML = '';
        totals.items.forEach(course => {
            const row = document.createElement('tr');
            row.dataset.course = course.id;
 
            const name = document.createElement('td');
            name.textContent = course.name;
 
            const price = document.createElement('td');
            price.textContent = formatRand(course.price);
 
            const action = document.createElement('td');
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'remove-btn';
            remove.textContent = 'Remove';
            remove.setAttribute('aria-label', 'Remove ' + course.name + ' from your quote');
            action.appendChild(remove);
 
            row.append(name, price, action);
            tbody.appendChild(row);
        });
 
        emptyMessage.hidden = totals.items.length > 0;
 
        $$('.discount-bars span').forEach((bar, index) => {
            bar.classList.toggle('on', index < totals.items.length);
        });
 
        $('#discount-message').textContent = discountMessage(totals.items.length);
        $('#subtotal').textContent = formatRand(totals.subtotal);
        $('#discount-rate').textContent = Math.round(totals.rate * 100) + '%';
        $('#discount-amount').textContent = '-' + formatRand(totals.discount);
        $('#total').textContent = formatRand(totals.total);
 
        requestButton.setAttribute('aria-disabled', String(totals.items.length === 0));
    }

    tbody.addEventListener('click', event => {
        const button = event.target.closest('.remove-btn');
        if (!button) return;
        removeFromSelection(button.closest('tr').dataset.course);
        hideMessage(status);
        render();
    });

    requestButton.addEventListener('click', event => {
        const totals = calculateTotals(getSelection());
 
        if (totals.items.length === 0) {
            event.preventDefault();
            showMessage(status, 'Please add at least one course before requesting a quote. <a href="courses.html">Browse courses</a>', 'error');
            status.focus();
            return;
        }
 
        const saved = writeSaved(localStore, 'ppa.lastQuote', {
            reference: makeReference('PPA'),
            courses: totals.items.map(course => ({ id: course.id, name: course.name, price: course.price })),
            subtotal: totals.subtotal,
            percent: Math.round(totals.rate * 100),
            discount: totals.discount,
            total: totals.total
        });

        if (!saved) {
            event.preventDefault();
            showMessage(status, 'Sorry, your browser would not save the quote. Please allow site data and try again.', 'error');
        }
          });
 
    render();
}

function initQuotePage() {
    const tbody = $('#quote-rows');
    if (!tbody) return;
 
    const quote = readSaved(localStore, 'ppa.lastQuote', null);

    if (!quote || !Array.isArray(quote.courses)) {
        const note = $('#quote-note');
        showMessage(note, 'This is a sample quote. <a href="calculate-fees.html">Choose your courses</a> to get your own.', 'info');
        return;
    }
 
    $('#quote-ref').textContent = quote.reference;
 
    tbody.innerHTML = '';
    quote.courses.forEach(course => {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.textContent = course.name;
        const price = document.createElement('td');
        price.textContent = formatRand(course.price);
        row.append(name, price);
        tbody.appendChild(row);
    });
 
    $('#quote-total-label').textContent = quote.percent > 0 ? 'Total (' + quote.percent + '% off)' : 'Total';
    $('#quote-total').textContent = formatRand(quote.total);
}

const FIELD_RULES = {
    name(value) {
        const text = value.trim();
        if (!text) return 'Please enter your full name.';
        if (text.length < 2) return 'Your name must be at least 2 characters.';
        if (!/^[A-Za-z\u00C0-\u024F'\u2019.\- ]+$/.test(text)) return 'Your name can only contain letters, spaces, hyphens and apostrophes.';
        return '';
    },
    email(value) {
        const text = value.trim();
        if (!text) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) return 'Please enter a valid email address, like name@example.com.';
        return '';
    },
    phone(value) {
        const text = value.trim();
        if (!text) return '';  
        const digits = text.replace(/\D/g, '');
        if (!/^\+?[\d\s()\-]+$/.test(text) || digits.length < 9 || digits.length > 15) {
            return 'Please enter a valid phone number (9 to 15 digits).';
        }
        return '';
    },
    message(value) {
        const text = value.trim();
        if (!text) return 'Please tell us how we can help.';
        if (text.length < 10) return 'Please write at least 10 characters so we can help you properly.';
        if (text.length > 1000) return 'Please keep your message under 1000 characters.';
        return '';
    }
};
 
function initEnquiryForm() {
    const form = $('#enquiry-form');
    if (!form) return;
 
    const summary = $('#form-status');
    const courseSelect = $('#course');

    const requested = new URLSearchParams(window.location.search).get('course');
    if (requested && findCourse(requested)) courseSelect.value = requested;

    const fields = Object.keys(FIELD_RULES).map(id => {
        const input = document.getElementById(id);
        const error = document.createElement('span');
        error.className = 'field-error';
        error.id = id + '-error';
        input.setAttribute('aria-describedby', error.id);
        input.insertAdjacentElement('afterend', error);
        return { id, input, error };
    });
 
    function check(field) {
        const message = FIELD_RULES[field.id](field.input.value);
        field.error.textContent = message;
        field.input.classList.toggle('invalid', message !== '');
        field.input.setAttribute('aria-invalid', String(message !== ''));
        return message === '';
    }
 
    fields.forEach(field => {
        field.input.addEventListener('blur', () => check(field));
        field.input.addEventListener('input', () => {
            if (field.input.classList.contains('invalid')) check(field);
        });
    });
 
    form.addEventListener('submit', event => {
        const results = fields.map(field => ({ field, valid: check(field) }));
        const firstBad = results.find(result => !result.valid);
 
        if (firstBad) {
            event.preventDefault();
            showMessage(summary, 'Please fix the highlighted fields and try again.', 'error');
            firstBad.field.input.focus();
            return;
        }
 
        hideMessage(summary);
 
        if (!hasSessionStorage) return;
 
        event.preventDefault();
        const selected = courseSelect.value;
        writeSaved(sessionStore, 'ppa.lastEnquiry', {
            reference: makeReference('ENQ'),
            name: $('#name').value.trim(),
            email: $('#email').value.trim(),
            phone: $('#phone').value.trim(),
            course: selected ? (findCourse(selected) || {}).name || '' : ''
        });
        window.location.href = 'confirmation.html';
    });
}

function initConfirmationPage() {
    const reference = $('#enquiry-ref');
    if (!reference) return;
 
    let enquiry = readSaved(sessionStore, 'ppa.lastEnquiry', null);

    const params = new URLSearchParams(window.location.search);
    if (!enquiry && params.get('name')) {
        const course = findCourse(params.get('course') || '');
        enquiry = {
            reference: makeReference('ENQ'),
            name: params.get('name'),
            email: params.get('email') || '',
            phone: params.get('phone') || '',
            course: course ? course.name : ''
        };
        writeSaved(sessionStore, 'ppa.lastEnquiry', enquiry);
    }
 
    if (!enquiry) return; 

    reference.textContent = enquiry.reference;
    $('#detail-name').textContent = enquiry.name || '\u2014';
    $('#detail-email').textContent = enquiry.email || '\u2014';
    $('#detail-phone').textContent = enquiry.phone || '\u2014';
 
    const courseRow = $('#detail-course-row');
    if (enquiry.course) {
        $('#detail-course').textContent = enquiry.course;
        courseRow.hidden = false;
    }
}

function initFaq() {
    const questions = $$('main details');
    questions.forEach(question => {
        question.addEventListener('toggle', () => {
            if (!question.open) return;
            questions.forEach(other => {
                if (other !== question) other.open = false;
            });
        });
    });
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#A4E2F9"/>' +
    '<text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#2E5875">Image coming soon</text>' +
    '</svg>'
);
 
function setImage(image, source) {
    delete image.dataset.failed;
    image.src = source;
}
 
function initImageFallback() {
    $$('img').forEach(image => {
        const useFallback = () => {
            if (image.dataset.failed) return;
            image.dataset.failed = 'true';
            image.src = PLACEHOLDER_IMAGE;
        };
        image.addEventListener('error', useFallback);
        if (image.complete && image.naturalWidth === 0 && image.getAttribute('src')) useFallback();
    });
}

function safely(part) {
    try {
        part();
        return true;
    } catch (error) {
        console.error('Pawsitive site: ' + part.name + ' failed', error);
        return false;
    }
}
 
document.addEventListener('DOMContentLoaded', () => {
    const results = [
        safely(initDropdown),
        safely(initCurrentPage),
        safely(refreshQuoteBadge),
        safely(initCourseDetails),
        safely(initSelectionPage),
        safely(initQuotePage),
        safely(initEnquiryForm),
        safely(initConfirmationPage),
        safely(initFaq),
        safely(initImageFallback)
    ];

    if (results.every(Boolean)) document.documentElement.classList.add('js-ready');
});
