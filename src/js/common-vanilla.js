(function (window, document, undefined) {

    // Кэшируем списки
    var ul = document.querySelectorAll('ul'),
        firstList = ul[0],
        secondList = ul[1],
        thirdList = ul[2];

    var dragEl = null;

    // Кэшируем блок списков и дефолтное состояние
    var page = document.querySelector('.page'),
        addList = document.querySelector('.add-list'),
        rows = 1,
        lists = 3;

    // Добавляет копию элемента из третьего списка в первый
    var addToThirstList = function (content) {
        var li = document.createElement('li');
        
        li.setAttribute('draggable', 'true');
        li.innerHTML = content;
        
        firstList.appendChild(li);

        return false;
    };

    // Handle Dragstart
    function handleDragStart (e) {

        if (e && e.target && e.target.tagName === 'LI') {

            // Сделаем оригинальный элемент визуально чуть тускнее, что выделить его
            e.target.style.opacity = 0.4;

            // Передадим переменной dragEl ссылку на передаваемый объект
            dragEl = e.target;

            // В качестве передаваемых данных выставим содержимое элемента
            e.dataTransfer.setData('text/html', e.target.innerHTML);
        }
        return false;
    }

    // Handle Dragover
    function handleDragOver(e) {
        
        // Отменяем действие по дефолту. Необходимо для перемещения элемента
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    // Handle Drop
    function handleDrop(e) {

        if (e && e.target && e.target.tagName === 'LI') {

            // Предотвращение редиректа в некоторых браузерах
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            // Если объект не возвращается на место
            if (dragEl !== e.target) {

                // То на старое место вставляем контент от нового места
                dragEl.innerHTML = e.target.innerHTML;

                // А на новое место от перемещаемого объекта
                e.target.innerHTML = e.dataTransfer.getData('text/html');
            }

            // Если мы вставили объект во второй список
            if (e.target.parentNode === secondList) {
                
                // То подсветим этот список
                secondList.classList.add('added-2nd');

            // Если мы вставили объект в третий список    
            } else if (e.target.parentNode === thirdList) {

                // То подсветим его
                thirdList.classList.add('added-3rd');

                // И добавим копию перемещаемого объекта в первый список
                addToThirstList(e.dataTransfer.getData('text/html'));
            }
        }
        return false;
    }

    // Handle Dragenter
    function handleDragEnter(e) {

        if (e && e.target && e.target.tagName === 'LI') {

            // this объект над которым находится перемещаемый элемент
            e.target.classList.add('over');
        }
        return false;
    }

    // Handle Dragleave
    function handleDragLeave(e) {

        if (e && e.target && e.target.tagName === 'LI') {
            
            // this предыдущий объект, над которым был перемещаемый элемент
            e.target.classList.remove('over');
        }
        return false;
    }

    // Handle Dragend
    function handleDragEnd(e) {

        if (e && e.target && e.target.tagName === 'LI') {
            e.target.style.opacity = 1;
    
            [].map.call(document.querySelectorAll('.page li'), function (el) {
                el.classList.remove('over')
            });
        
            // Отключаем рамки и фон у списков 2, 3
            window.setTimeout(function () {
                secondList.classList.remove('added-2nd');   
                thirdList.classList.remove('added-3rd');
            }, 2000);
        } 

        return false; 
    }

    // Обработчик добавления списков
    function addListHandler () {
        var list = document.createElement('ul'),
            item = document.createElement('li'),
            row;

        list.classList.add('column', 'column_xs-4');

        item.setAttribute('draggable', true);
        item.textContent = 'List Item';

        list.appendChild(item);

        // Если строка заполнена добавляем новую
        if (lists % 3 === 0) {
            rows += 1;
            
            row = document.createElement('div');
            row.classList.add('row', 'g-clf')
            
            row.appendChild(list);
            page.appendChild(row);

        // Иначе находим последнюю строку и добавляем список в нее
        } else {
            row = document.querySelector('.page .row:last-child');
            row.appendChild(list);
        }

        lists += 1;
    }

    // Вешаем обработчики событий
    page.addEventListener('dragstart', handleDragStart, false);
    page.addEventListener('dragenter', handleDragEnter, false);
    page.addEventListener('dragover', handleDragOver, false);
    page.addEventListener('drop', handleDrop, false);
    page.addEventListener('dragleave', handleDragLeave, false);
    page.addEventListener('dragend', handleDragEnd, false);

    // Обработчик для добавления списка
    addList.addEventListener('click', addListHandler, false);

}(window, window.document));