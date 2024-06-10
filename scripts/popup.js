const injectCheckbox = document.getElementById('injection');
const codeCheckbox = document.getElementById('codevisible');
let injection, codeVisible = true;

// from https://stackoverflow.com/questions/6358673/javascript-checkbox-onchange
injectCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    injection = true;
  } else {
    injection = false;
  }
})

codeCheckbox.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      codeVisible = true;
    } else {
     codeVisible = false;
    }
  })