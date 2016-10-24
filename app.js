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
        fs.appendFile('game.log', '1\n'); // Добавляем в логи
      } else {
        console.log('Вы проиграли\n');
        fs.appendFile('game.log', '0\n'); // Добавляем в логи
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

      for (var i = 0; i < log.count; i++) {
        if (list[i] == '1') {
          log.win += 1;
        } else {
          log.loss += 1;
        }
      }

      console.log('\nКоличество партий: ' + (list.length - 1));
      console.log('Выйграл: ' + log.win);
      console.log('Проиграл: ' + log.loss);
    });
}