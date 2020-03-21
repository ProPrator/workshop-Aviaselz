
// записываем в переменные входные данные из формы
const formSearch = document.querySelector('.form-search'),
    inputCitiesForm = document.querySelector('.input__cities-from'),
    DropdownCitiesForm = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDataDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket');
    otherCheapestTicket = document.getElementById('other-cheap-tickets');

// API key
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'fbef310310cb1c84ff97396f87a3e64d',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;   // кол-во билетов на другие даты показываемого на странице
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
            return fixItem.startsWith(input.value.toLowerCase()); // возвращаем значение в инпут
        });

        filterCity.forEach((item) => {                           // перебираем результирующий массив в цикле
            const li = document.createElement('li');             // создаём лишку
            li.classList.add('dropdown__city');                  // добавляем лишке класс
            li.textContent = item.name;                          // добавляем лишке название города
            list.append(li);                                     // показываем лишку
        });
    }
};

const getNameCity = (code) => {                                         // вывод названия города
    const objCity = city.find((item) => item.code == code)
    return objCity.name;
};

const getDate = (date) => {                                             // формирование даты
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day : 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getChanges = (num) => {                                            // проверка на пересадки
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками' ;
    } else {
        return 'Без пересадок';
    }
}

const getLinkAviaseles = (data) => {                                    // формируем ссылку для запроса на покупку билета
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;
    
    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month; 
    
    link += data.destination;

    return link + '1';    
};

const createCard = (data) => {                                          // формирование верстки карточки с информацией о рейсе
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviaseles(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {               // выводим в консоль билет на заданную дату
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {                      // выводим все билеты предложенные нам
    otherCheapestTicket.style.display = 'block';
    otherCheapestTicket.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    
    cheapTickets.sort((a, b) => a.value - b.value);   
    
    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapestTicket.append(ticket);
    }
    
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {                             // передаем в функцию данные после запроса
    const cheapTicketYear = JSON.parse(data).best_prices;         // парсим данные
    
    const cheapTicketDay = cheapTicketYear.filter((item) => {     // ищем билет на заданную дату
        return item.depart_date === date;
    })

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
    event.preventDefault();                                            // не обновлять страницу

   
    
    const cityFrom = city.find((item) => {                            
        return inputCitiesForm.value === item.name                    // ищем совпадения мнпута с массивом
    });
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name                      // ищем совпадения мнпута с массивом
    });

    const formData = {                                                // создаем обьект с
        from: cityFrom,                                               // код города 'откуда'     
        to: cityTo,                                                   // код города 'куда'
        when: inputDataDepart.value,                                  // дата
    };

    if (formData.from && formData.to) {    
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` +              // формируем гет запрос
            `&destination=${formData.to.code}&one_way=true`;    
        
        getData(calendar + requestData, (response) => {                   // вызываем функцию отправляющую запросс и получающую данные 
            renderCheap(response, formData.when);                           
        });
    } else {
        alert('Введите коректное название города!');
    }
});

getData(proxy + citiesApi, (data) => {                                // вызываем функцию
    city = JSON.parse(data).filter(item => item.name);
    city.sort(function (a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        } else 
        return 0;
      });                // парсим данные и записываем в массив
});

