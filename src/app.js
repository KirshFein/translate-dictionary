// Variables
const inputEng = document.querySelector('.eng-word'),
    inputRus = document.querySelector('.rus-word'),
    btnAddWord = document.querySelector('.addWords'),
    btnHideRusWords = document.querySelector('.showEngWords'),
    btnHideEngWords = document.querySelector('.showRusWords'),
    forms = document.querySelectorAll('.forms-val');

let containerWords = document.querySelector('.word-container'),
    words,
    layoutEngWords,
    layoutRusWords,
    btnsDelete;

// checking localStorage for data availability
localStorage.length < 1 ? words = [] : words = JSON.parse(localStorage.getItem('words'));

// saves and changes styles after browser restart
const hideWords = () => {
    if (localStorage.getItem('rusWords') === 'false') {
        document.querySelectorAll('.russian-word').forEach(item => item.style.display = 'none')
    } else {
        document.querySelectorAll('.russian-word').forEach(item => item.style.display = 'table-cell')
    }
    if (localStorage.getItem('engWords') === 'false') {
        document.querySelectorAll('.english-word').forEach(item => item.style.display = 'none')
    } else {
        document.querySelectorAll('.english-word').forEach(item => item.style.display = 'table-cell')
    }
};

// generate HTML layout
const viewWords = item => {
    containerWords.innerHTML += `
    <tr>
        <td class="english-word">${words[item].english}</td>
        <td class="russian-word">${words[item].russian}</td>
        <td>
            <button class="btn-setting delete-word">Delete</button>
        </td>
    </tr>
    `;
};

// We pass index in order to show data from localstorage
words.forEach((element, index) => {
    viewWords(index);
    hideWords();
});


// record data using the constructor to the localstorage,
// validate form if form empty,
// and pusher words
btnAddWord.addEventListener('click', () => {
    if (
        inputEng.value.length < 1 ||
        inputRus.value.length < 1 ||
        !isNaN(inputEng.value) ||
        !isNaN(inputRus.value)
    ) {
        for (let i of forms) {
            document.querySelector('.message-error').style.display = 'block';
            i.classList.add('error');
            setTimeout(() => {
                document.querySelector('.message-error').style.display = 'none';
                i.classList.remove('error');
            }, 4000);
        }
    } else {
        for (let i of forms) {
            i.classList.remove('error');
        }
        words.push(new PusherWords(inputEng.value, inputRus.value));
        localStorage.setItem('words', JSON.stringify(words));
        viewWords(words.length - 1);
        inputEng.value = null;
        inputRus.value = null;
    }
});

// constructor for writing words
function PusherWords(english, russian) {
    this.english = english;
    this.russian = russian;
}

// Delete word from HTML layout and localstorage
const deleteWord = element => {
    const elementLine = element.target.parentNode.parentNode.rowIndex;
    element.target.parentNode.parentNode.parentNode.remove();
    //delete element from array and localstorage
    words.splice(elementLine, 1);
    localStorage.removeItem('words');
    localStorage.setItem('words', JSON.stringify(words));
};

// Add listener for button delete
const listenDeleter = () => {
    // check that the array is not empty , and only then can you search for elements
    if (words.length > 0) {
        btnsDelete = document.querySelectorAll('.delete-word').forEach(item => {
            item.addEventListener('click', element => {
                deleteWord(element);
            });
        });
    }
};

listenDeleter();


// hides words in english to remember the translation through associations in russian
btnHideEngWords.addEventListener('click', () => {
    if (words.length > 0) {
        layoutEngWords = document.querySelectorAll('.russian-word').forEach(item => {
            if (item.style.display === 'none') {
                item.style.display = 'table-cell';
                localStorage.setItem('rusWords', JSON.stringify(true));
            } else {
                item.style.display = 'none';
                localStorage.setItem('rusWords', JSON.stringify(false));
            }
        });
    }
});

// hides words in russian to remember the translation through associations in english
btnHideRusWords.addEventListener('click', () => {
    if (words.length > 0) {
        layoutRusWords = document.querySelectorAll('.english-word').forEach(item => {
            if (item.style.display === 'none') {
                item.style.display = 'table-cell';
                localStorage.setItem('engWords', JSON.stringify(true));
            } else {
                item.style.display = 'none';
                localStorage.setItem('engWords', JSON.stringify(false));
            }
        });
    }
});
