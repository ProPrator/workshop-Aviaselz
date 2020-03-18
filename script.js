
// записываем в переменные входные данные из формы
const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    DropdownCitiesForm = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDataDepart = document.querySelector('.input__date-depart');

// формируем массив с городами 
const city = ['Одесса','Киев','Харьков','Москва','Симферополь',
    'Краснодар','Калининград','Минск','Львов','Ростов-на-Дону',
    'Санкт-Петербург','Челябинск'];

    const showCity = (input, list) => {                             // создаём функцию
        list.textContent = '';                                      // обнуляем переменную которая хранит в текст выподающего меню
    
        if (input.value !== '') {                                   //если инпут пустой
            console.log('input empty');                             // вывод в консоль
    
            const filterCity = city.filter((item) => {              // создаем переменную
                const fixItem = item.toLowerCase();                 // в которую ложим елементы массива
                return fixItem.includes(input.value.toLowerCase()); // которые совпадают с текстом инпута
            });
    
            filterCity.forEach((item) => {                           // перебираем результирующий массив в цикле
                const li = document.createElement('li');             // создаём лишку
                li.classList.add('dropdown__city');                  // добавляем лишке класс
                li.textContent = item;                               // добавляем лишке название города
                list.append(li);                                     // показываем лишку
            });
        }
    };

inputCitiesForm.addEventListener('input', () => {                     // событие при наборе символов в инпуте 'откуда'
    showCity(inputCitiesForm, DropdownCitiesForm)                     // вызов функции
});

DropdownCitiesForm.addEventListener('click', (event) => {             // событие при клике на выпадающем списке 'откуда'
    const target = event.target;                                      // вносим в переменную место нажатия
    if (target.tagName.toLowerCase() === 'li') {                      // проверяем, нажали ли мы на лишку
        inputCitiesForm.value = target.textContent;                   // присваиваем тексту инпута значение лишки
        DropdownCitiesForm.textContent = '';                          // обнуляем значения выпадающего меню
    }
})

inputCitiesTo.addEventListener('input', () => {                       // событие при наборе символов в инпуте 'куда'
    showCity(inputCitiesTo, dropdownCitiesTo)                         // вызов функции
});

dropdownCitiesTo.addEventListener('click', (event) => {               // событие при клике на выпадающем списке 'куда'
    const target = event.target;                                      // вносим в переменную место нажатия
    if (target.tagName.toLowerCase() === 'li') {                      // проверяем, нажали ли мы на лишку
        inputCitiesTo.value = target.textContent;                     // присваиваем тексту инпута значение лишки
        dropdownCitiesTo.textContent = '';                            // обнуляем значения выпадающего иеню
    }
});