
// записываем в переменные входные данные из формы
const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    DropdownCitiesForm = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDataDepart = document.querySelector('.input__date-depart');

// API key
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'fbef310310cb1c84ff97396f87a3e64d',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';
// формируем массив с городами 
let city = [];
// описание функций
const getData = (url, callback) => {
    const request = new XMLHttpRequest();                       // создаем объект для отправки Http запросов

    request.open('GET', url);                                   // конфигурируем запрос

    request.addEventListener('readystatechange', () => {        // событие отлавливает изменение в состояние объекта запроса
        if (request.readyState !== 4 ) return;                  // если статус подключения равен 4 выходим из функции

        if (request.status === 200 ) {                          // если статус подключения равен 200 
            callback(request.response);                         // возвращаем данные
        } else {                                                // иначе
            console.error(request.status);                      // в консоль выводим ошибку со статусом подключения
        }
    });

    request.send();                                             // отправляем запрос
};

const showCity = (input, list) => {                             // создаём функцию
    list.textContent = '';                                      // обнуляем переменную которая хранит в текст выподающего меню

    if (input.value !== '') {                                   // если инпут пустой
        const filterCity = city.filter((item) => {              // перебираем массив и ищем совпадения
            const fixItem = item.name.toLowerCase();            // присваеваем переменной совпадение 
            return fixItem.includes(input.value.toLowerCase()); // возвращаем значение в инпут
        });

        filterCity.forEach((item) => {                           // перебираем результирующий массив в цикле
            const li = document.createElement('li');             // создаём лишку
            li.classList.add('dropdown__city');                  // добавляем лишке класс
            li.textContent = item.name;                          // добавляем лишке название города
            list.append(li);                                     // показываем лишку
        });
    }
};

const renderCheapDay = (cheapTicket) => {                         // выводим в консоль билет на заданную дату
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {                       // выводим все билеты предложенные нам
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {                             // передаем в функцию данные после запроса
    const cheapTicketYear = JSON.parse(data).best_prices;         // парсим данные
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {     // ищем билет на заданную дату
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);                                  
    renderCheapYear(cheapTicketYear);                               
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
formSearch.addEventListener('submit', (event) => {                    // обработчик событий при нажатии на кнопку отправки формы
    event.preventDefault()                                            // не обновлять страницу
    
    const cityFrom = city.find((item) => {                            
        return inputCitiesForm.value === item.name                    // ищем совпадения мнпута с массивом
    });
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name                      // ищем совпадения мнпута с массивом
    });

    const formData = {                                                // создаем обьект с
        from: cityFrom.code,                                          // код города 'откуда'     
        to: cityTo.code,                                              // код города 'куда'
        when: inputDataDepart.value,                                  // дата
    }
    
    const requestData = '?depart_date=' + formData.when +             // формируем гет запрос
        '&origin=' + formData.from + 
        '&destination=' + formData.to + 
        '&one_way=true';
    
    getData(calendar + requestData, (response) => {                   // вызываем функцию отправляющую запросс и получающую данные 
        renderCheap(response, formData.when);                           
    });
});

getData(proxy + citiesApi, (data) => {                                // вызываем функцию
    city = JSON.parse(data).filter(item => item.name);                // парсим данные и записываем в массив
});

