(function (window, document, $, undefined) {

    // Кэшируем списки
    var ul = $('ul'),
        firstList = ul[0],
        secondList = ul[1],
        thirdList = ul[2];

    var dragEl = null;

    var page = $('.page'),
        addList = $('.add-list'),
        rows = 1,
        lists = 3;

    // Добавляет копию элемента из третьего списка в первый
    var addToThirstList = function (content) {
        var li = $('<li/>');
        
        li.attr('draggable', 'true');
        li.html(content);
        
        $(firstList).append(li);

        return false;
    };

    // Handle Dragstart
    function handleDragStart (e) {
        
        // Сделаем оригинальный элемент визуально чуть тускнее, что выделить его
        $(this).css('opacity', 0.4);

        // Передадим переменной dragEl ссылку на передаваемый объект
        dragEl = $(this);

        // В качестве передаваемых данных выставим содержимое элемента
        e.originalEvent.dataTransfer.setData('text/html', $(this).html());
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

        // Предотвращение редиректа в некоторых браузерах
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        // Если объект не возвращается на место
        if (dragEl !== $(this)) {

            // То на старое место вставляем контент от нового места
            dragEl.html($(this).html());

            // А на новое место от перемещаемого объекта
            $(this).html(e.originalEvent.dataTransfer.getData('text/html'));
        }

        // Если мы вставили объект во второй список
        if (this.parentNode === secondList) {
            
            // То подсветим этот список
            $(secondList).addClass('added-2nd');

        // Если мы вставили объект в третий список    
        } else if (this.parentNode === thirdList) {

            // То подсветим его
            $(thirdList).addClass('added-3rd');

            // И добавим копию перемещаемого объекта в первый список
            addToThirstList(e.originalEvent.dataTransfer.getData('text/html'));
        }

        return false;
    }

    // Handle Dragenter
    function handleDragEnter(e) {

        // $(this) объект над которым находится перемещаемый элемент
        $(this).addClass('over');
    }

    // Handle Dragleave
    function handleDragLeave(e) {

        // $(this) предыдущий объект, над которым был перемещаемый элемент
        $(this).removeClass('over');
    }

    // Handle Dragend
    function handleDragEnd(e) {
        $(this).css('opacity', 1);
    
        $('li', ul).removeClass('over');
    
        // Отключаем рамки и фон у списков 2, 3
        window.setTimeout(function () {
            $(secondList).removeClass('added-2nd');   
            $(thirdList).removeClass('added-3rd');
        }, 2000);
    }

    function addListHandler () {
        var list = $('<ul/>', {
                class: 'column column_xs-4'
            }),
            item = $('<li/>', {
                text: 'List Item',
                draggable: true
            }),
            row;

        list.append(item);

        if (lists % 3 === 0) {
            rows += 1;
            
            row = $('<div/>', {
                class: 'row g-clf'
            });
            
            row.append(list);
            page.append(row);
        } else {
            row = $('.row:last', page);
            row.append(list);
        }

        lists += 1;

    }

    // Вешаем обработчики событий
    page.on('dragstart', 'li', handleDragStart);
    page.on('dragenter', 'li', handleDragEnter);
    page.on('dragover', 'li', handleDragOver);
    page.on('drop', 'li', handleDrop);
    page.on('dragleave', 'li', handleDragLeave);
    page.on('dragend', 'li', handleDragEnd);

    // Обработчик для добавления списка
    addList.on('click', addListHandler);

}(window, window.document, jQuery));