'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var btnShowPass = document.querySelector('.js-show-pass');
  var inputPass = document.querySelector('.js-password');
  btnShowPass.addEventListener('change', function () {
    if (btnShowPass.checked) {
      inputPass.type = 'text';
    } else {
      inputPass.type = 'password';
    }
  });
});