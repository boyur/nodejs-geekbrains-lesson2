var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin, // ввод из стандартного потока
  output: process.stdout // вывод в стандартный поток
});

rl.question('**> Игра "Орел и решка" <**\n' +
  'Введите 0 если орел или 1 если решка: ', function(answer) {
  var random = Math.ceil(Math.random()*2);

  if (answer == 0 || answer == 1) {
    if (random == answer) {
      console.log('Вы выйграли');
    } else {
      console.log('Вы проиграли');
    }
  } else {
    console.log('Вы ввели не верное значение');
  }
});