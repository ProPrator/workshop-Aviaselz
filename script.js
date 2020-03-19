
// записываем в переменные входные данные из формы
const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    DropdownCitiesForm = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDataDepart = document.querySelector('.input__date-depart');

// формируем массив с городами 
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'fbef310310cb1c84ff97396f87a3e64d',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];
// описание функций
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4 ) return;

        if (request.status === 200 ) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCity = (input, list) => {                             // создаём функцию
    list.textContent = '';                                      // обнуляем переменную которая хранит в текст выподающего меню

    if (input.value !== '') {                                   //если инпут пустой
        const filterCity = city.filter((item) => {  
            const fixItem = item.name.toLowerCase();            // в которую ложим елементы массива
            return fixItem.includes(input.value.toLowerCase()); // которые совпадают с текстом инпута
        });

        filterCity.forEach((item) => {                           // перебираем результирующий массив в цикле
            const li = document.createElement('li');             // создаём лишку
            li.classList.add('dropdown__city');                  // добавляем лишке класс
            li.textContent = item.name;                          // добавляем лишке название города
            list.append(li);                                     // показываем лишку
        });
    }
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {                  // проверяем, нажали ли мы на лишку
        input.value = target.textContent;                         // присваиваем тексту инпута значение лишки
        list.textContent = '';                                    // обнуляем значения выпадающего меню
    }
};

// обработчики событий
inputCitiesForm.addEventListener('input', () => {                     // событие при наборе символов в инпуте 'откуда'
    showCity(inputCitiesForm, DropdownCitiesForm)                     // вызов функции
});

inputCitiesTo.addEventListener('input', () => {                       // событие при наборе символов в инпуте 'куда'
    showCity(inputCitiesTo, dropdownCitiesTo)                         // вызов функции
});

DropdownCitiesForm.addEventListener('click', (event) => {             // событие при клике на выпадающем списке 'откуда'
                                          
    selectCity(event, inputCitiesForm, DropdownCitiesForm);
});

dropdownCitiesTo.addEventListener('click', (event) => {               // событие при клике на выпадающем списке 'куда'                                     
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);    
    
    });
