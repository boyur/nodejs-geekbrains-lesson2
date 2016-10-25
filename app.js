var readline = require('readline');
var fs = require('fs');



var rl = readline.createInterface({
  input: process.stdin, // ввод из стандартного потока
  output: process.stdout // вывод в стандартный поток
});

rl.write('**> Игра "Орел и решка" <**\n' +
'Для выхода напишите exit\n');

var recursiveAsyncReadLine = function () {

  rl.question('Введите 1 если орел или 2 если решка: ', function (answer) {

    var random = Math.ceil(Math.random()*2);

    if (answer == 'log') {
      console.log(readLog());
    }


    if (answer == 'exit') // Для выхода введите exit
      return rl.close(); // Закрываем консоль

    if (answer == 1 || answer == 2) {
      if (random == answer) {
        console.log('Вы выйграли\n');
        fs.appendFile('game.log', '2\n'); // Добавляем в логи
      } else {
        console.log('Вы проиграли\n');
        fs.appendFile('game.log', '1\n'); // Добавляем в логи
      }
    } else {
      console.log('Вы ввели не верное значение');
    }





    recursiveAsyncReadLine(); // Запускаем приложение еще раз (рекурсия)
  });
};

recursiveAsyncReadLine(); //Запуск приложения

// Анализатор логов
function readLog() {
  var list = [];
  var log = {count: 0, win: 0, loss:0, lossRow: 0, winRow: 0};
  fs.createReadStream('./game.log', {encoding: 'utf8'})
    .on('readable', function() {
      var str, chunk;
      while (chunk = this.read()) {
        str = ((list.pop() ||'') + chunk);
        list = list.concat(str.split('\n'));
      }
      list[list.length-1] += (this.read() || '');
    })
    .on('end',function() {

      log.count = list.length - 1;

      if (log.count == -1) {
        log.count = 0;
      }

      for (var i = 0; i < log.count; i++) {
        if (list[i] == '2') {
          log.win++;
        } else if(list[i] == '1') {
          log.loss++;
        }
      }

      var max = findMaxChain(list);

      console.log('\nКоличество партий: ' + log.count);
      console.log('Выйграл: ' + log.win);
      console.log('Проиграл: ' + log.loss);
      console.log('Максимальное кол-во партий: ' + max.length)
    });
}

function findMaxChain(arr) {

  // Максимальная цепочка
  var max = {};
  max.element = arr[0];
  max.length = 1;
  max.index = 0;

  // Текущая цепочка
  var current = {};
  current.element = arr[0];
  current.length = 1;
  current.index = 1;

  for (var i = 1; i < arr.length - 1; i++) {

    console.log('max: ', max);

    console.log('current: ', current);
    console.log('index: ', i);

    //Цепочка не закончилась
    if (arr[i] == current.element) {
      current.length++;
      console.log('Элементы одинаковые, кол-во:', current.length);
      continue;
    }

    // Цепочка закончилась, она больше максимальной
    if (current.length > max.length) {
      max = current;
      console.log('max = current: ', max);
    }

    console.log('max: ', max);

    // Новая цепочка
    current.element = arr[i];
    current.length = 1;
    current.index = i;

    console.log('max: ', max);
  }

  console.log('max final: ', max);

  // Если последняя цепочка максимальная
  if (current.length > max.length) {
    console.log('Последняя цепочка');
    max = current;
  }

  console.log('max final: ', max);

  return max;
}