const injectCheckbox = document.getElementById('injection');
const codeCheckbox = document.getElementById('codevisible');

// from https://stackoverflow.com/questions/6358673/javascript-checkbox-onchange
injectCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    // do injection stuff
  } else {
   // do not do injection stuff
  }
})

codeCheckbox.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      // do code visible stuff
    } else {
     // do not do code visible stuff
    }
  })