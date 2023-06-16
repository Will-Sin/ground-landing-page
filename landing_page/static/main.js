

// Drop Down

const inputFieldDropDown = document.querySelector('.chosen-value');
const dropdown = document.querySelector('.value-list');
const dropdownArray = [... document.querySelectorAll('li')];
console.log(typeof dropdownArray)
let valueArray = [];
dropdownArray.forEach(item => {
  valueArray.push(item.textContent);
});

const closeDropdown = () => {
  dropdown.classList.remove('open');
}

inputFieldDropDown.addEventListener('input', () => {
  dropdown.classList.add('open');
  let inputValue = inputFieldDropDown.value.toLowerCase();
  let valueSubstring;
  if (inputValue.length > 0) {
    for (let j = 0; j < valueArray.length; j++) {
      if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
        dropdownArray[j].classList.add('closed');
      } else {
        dropdownArray[j].classList.remove('closed');
      }
    }
  } else {
    for (let i = 0; i < dropdownArray.length; i++) {
      dropdownArray[i].classList.remove('closed');
    }
  }
});

dropdownArray.forEach(item => {
  item.addEventListener('click', (evt) => {
    inputFieldDropDown.value = item.textContent;
    dropdownArray.forEach(dropdown => {
      dropdown.classList.add('closed');
    });
  });
})

inputFieldDropDown.addEventListener('focus', () => {
   inputFieldDropDown.placeholder = 'Type to filter';
   dropdown.classList.add('open');
   dropdownArray.forEach(dropdown => {
     dropdown.classList.remove('closed');
   });
});

inputFieldDropDown.addEventListener('blur', () => {
   inputField.placeholder = 'Select state';
  dropdown.classList.remove('open');
});

document.addEventListener('click', (evt) => {
  const isDropdown = dropdown.contains(evt.target);
  const isInput = inputFieldDropDown.contains(evt.target);
  if (!isDropdown && !isInput) {
    dropdown.classList.remove('open');
  }
});

