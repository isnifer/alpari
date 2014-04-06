(function (window, document, $, undefined) {

    // Кэшируем списки
    var ul = $('ul'),
        firstList = ul[0],
        secondList = ul[1],
        thirdList = ul[2];

    var dragEl = null;

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

    // Вешаем обработчики событий
    $('ul').on('dragstart', 'li', handleDragStart);
    $('ul').on('dragenter', 'li', handleDragEnter);
    $('ul').on('dragover', 'li', handleDragOver);
    $('ul').on('drop', 'li', handleDrop);
    $('ul').on('dragleave', 'li', handleDragLeave);
    $('ul').on('dragend', 'li', handleDragEnd);

}(window, window.document, jQuery));