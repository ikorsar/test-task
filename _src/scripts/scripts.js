'use strict';

document.addEventListener('DOMContentLoaded', function() {
    const btnShowPass = document.querySelector('.js-show-pass');
    const inputPass = document.querySelector('.js-password');

    btnShowPass.addEventListener('change', function() {
        if (btnShowPass.checked) {
            inputPass.type = 'text';
        } else {
            inputPass.type = 'password';
        }
    });
});
