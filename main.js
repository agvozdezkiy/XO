'use strict';
/*jslint devel: true */

//******************************************
//------ХТМЛ окошка для настройки игры
var setupWindowHTML = "<div class=\"whiteBack\">\
  <div style=\"height: 30vh\"></div>\
  <div id=\"setupWindow\" class=\"setupWindow\">\
    <div class=\"setupHead\">\
      <p style=\"margin: 0px\">Настройки</p>\
    </div>\
    <div style=\"height: 10px\"></div>\
    <div class=\"setPlayer1\">\
      <p>Игрок 1</p>\
      <input id=\"name1\" type=\"text\" size=\"10\" placeholder=\"Иван\" class=\"marginBottom10\">\
      <select id=\"isMan1\" style=\"width: auto\">\
        <option value=\"true\">Человек</option>\
        <option value=\"false\">Робот</option>\
      </select>\
    </div>\
    <div class=\"setPlayer2\">\
      <p>Игрок 2</p>\
      <input id=\"name2\" type=\"text\" size=\"10\" placeholder=\"R2D2\" class=\"marginBottom10\">\
      <select id=\"isMan2\" style=\"width: auto\">\
        <option value=\"true\">Человек</option>\
        <option value=\"false\" selected>Робот</option>\
      </select>\
    </div>\
    <input class=\"submit\" type=\"submit\" value=\"Принять\" onclick=\"acceptSettings()\">\
  </div>\
</div>"

//------ХТМЛ окошка для объявления результата игры
var resultWindowHTML = "<div class=\"whiteBack\">\
  <div style=\"height: 30vh\"></div>\
  <div id=\"resultWindow\" class=\"resultWindow\">\
    <div class=\"setupHead\">\
      <p style=\"margin: 0px\">Партия окончена!</p>\
    </div>\
    <p id=\"result\"></p>\
    <input class=\"submit\" type=\"submit\" value=\"Ок\" onclick=\"closeResultWindow()\">\
  </div>\
</div>"

//*************************************************
//------Классы игроков
var player1 = {
  name: 'Иван',
  symbol: 'X',
  isMan: true,
}

var player2 = {
  name: 'R2D2',
  symbol: '0',
  isMan: false,
}

//****************************************************
//----Флаг хода сигнализирует, что сделан ход
var moveFlag = {
  pressedFieldId: 'empty',
  isMoved: false,
};


//****************************************************
//-----Класс игровой логики: контроль поля, чередование игроков, фиксация ходов
var gamePlay = {
  gameField: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'], //Массив игрового поля

  activePlayer: player1,
  enotherPlayer: player2,

  endOfGame: true,
  noMoves: false,

  intervalID: 0,

  //-Пишет символ походившего игрока в массив игрового поля
  makeMove: function () {
    canvasHandler.writeSymbol(moveFlag.pressedFieldId, this.activePlayer.symbol, 'black');
    this.gameField[moveFlag.pressedFieldId] = this.activePlayer.symbol;
    moveFlag.isMoved = false; //сбрасываем флаг хода
  },
  
  //-Ищет случайну свободную клетку для хода и объявляет ход
  findRandomMove: function () {
    var noEmpty = 0;
    var count = Math.round(Math.random() * 8);

    while (this.gameField[count] != 'E') {
      if (++count == 9) count = 0;
      if (++noEmpty == 9) {
        //this.noMoves=true;
        break;
      }
    }

    moveFlag.pressedFieldId = count;
    moveFlag.isMoved = true;
  },

  //-Ищет победный ход и объявляет его, если есть
  findWinningMove: function (player) {
    //---Перебираем в горизонтали
    for (var count = 0; count < 9; count += 3) {
      if (this.gameField[count] == player.symbol && this.gameField[count + 1] == player.symbol && this.gameField[count + 2] == 'E') {
        moveFlag.pressedFieldId = count + 2;
        moveFlag.isMoved = true;
        return;
      }

      if (this.gameField[count] == player.symbol && this.gameField[count + 1] == 'E' && this.gameField[count + 2] == player.symbol) {
        moveFlag.pressedFieldId = count + 1;
        moveFlag.isMoved = true;
        return;
      }

      if (this.gameField[count] == 'E' && this.gameField[count + 1] == player.symbol && this.gameField[count + 2] == player.symbol) {
        moveFlag.pressedFieldId = count + 0;
        moveFlag.isMoved = true;
        return;
      }
    }

    //---Перебираем в вертикали
    for (count = 0; count < 3; count++) {
      if (this.gameField[count] == player.symbol && this.gameField[count + 3] == player.symbol && this.gameField[count + 6] == 'E') {
        moveFlag.pressedFieldId = count + 6;
        moveFlag.isMoved = true;
        return;
      }

      if (this.gameField[count] == player.symbol && this.gameField[count + 3] == 'E' && this.gameField[count + 6] == player.symbol) {
        moveFlag.pressedFieldId = count + 3;
        moveFlag.isMoved = true;
        return;
      }

      if (this.gameField[count] == 'E' && this.gameField[count + 3] == player.symbol && this.gameField[count + 6] == player.symbol) {
        moveFlag.pressedFieldId = count + 0;
        moveFlag.isMoved = true;
        return;
      }
    }

    //---Верхняя диагональ
    if (this.gameField[0] == player.symbol && this.gameField[4] == player.symbol && this.gameField[8] == 'E') {
      moveFlag.pressedFieldId = 8;
      moveFlag.isMoved = true;
      return;
    }

    if (this.gameField[0] == player.symbol && this.gameField[4] == 'E' && this.gameField[8] == player.symbol) {
      moveFlag.pressedFieldId = 4;
      moveFlag.isMoved = true;;
      return;
    }

    if (this.gameField[0] == 'E' && this.gameField[4] == player.symbol && this.gameField[8] == player.symbol) {
      moveFlag.pressedFieldId = 0;
      moveFlag.isMoved = true;
      return;
    }

    //---Нижняя диагональ
    if (this.gameField[0] == player.symbol && this.gameField[4] == player.symbol && this.gameField[8] == 'E') {
      moveFlag.pressedFieldId = 8;
      moveFlag.isMoved = true;
      return;
    }

    if (this.gameField[0] == player.symbol && this.gameField[4] == 'E' && this.gameField[8] == player.symbol) {
      moveFlag.pressedFieldId = 4;
      moveFlag.isMoved = true;
      return;
    }

    if (this.gameField[0] == 'E' && this.gameField[4] == player.symbol && this.gameField[8] == player.symbol) {
      moveFlag.pressedFieldId = 0;
      moveFlag.isMoved = true;
      return;
    }
  },

  //-Проверяет не победил ли походивший игрок
  isActivePlayerWinner: function () {

    //--Проверяем на победу строки
    var count = 0;
    for (var count = 0; count < 9; count += 3) {
      if (this.gameField[count] == this.activePlayer.symbol && this.gameField[count + 1] == this.activePlayer.symbol && this.gameField[count + 2] == this.activePlayer.symbol) {
        console.log('Строки');
        return true;
      }
    }

    //--Проверяем на победу колонки
    for (count = 0; count < 3; count++) {
      if (this.gameField[count] == this.activePlayer.symbol && this.gameField[count + 3] == this.activePlayer.symbol && this.gameField[count + 6] == this.activePlayer.symbol) {
        console.log('Колонки');
        return true;
      }
    }

    //--Проверяем на победу верхнюю диагональ
    if (this.gameField[0] == this.activePlayer.symbol && this.gameField[4] == this.activePlayer.symbol && this.gameField[8] == this.activePlayer.symbol) {
      console.log('Лев. диагональ');
      return true;
    }

    //--Проверяем на победу нижнюю диагональ
    count = 0;
    if (this.gameField[2] == this.activePlayer.symbol && this.gameField[4] == this.activePlayer.symbol && this.gameField[6] == this.activePlayer.symbol) {
      console.log('Прав. диагональ');
      return true;
    }

    return false;
  },

  //-Меняет игроков
  changeActivePlayer: function () {
    var a = this.enotherPlayer;
    this.enotherPlayer = this.activePlayer;
    this.activePlayer = a;
  },
  
  //-Есть ли свободные ячейки поля
  hasEmptyCells: function(){
    var count=0;
    while (this.gameField[count] != 'E') {
      if (++count == 9)
        return false;
    }
    return true;  
  },

  //----Игровая логика
  play: function () {
    
    if(this.noMoves)
      drawResultWindow('Ничья! Ходов больше нет!');
    
    if (!moveFlag.isMoved) return; //Если хода нет, завершаем игровую логику

    this.makeMove();

    if (this.isActivePlayerWinner()) {
      drawResultWindow(this.activePlayer.name + ' победил!');
      this.endOfGame = true;
    }
    
    if(!this.hasEmptyCells()) {
      this.endOfGame=true;
      this.noMoves=true;
      return;
    }

    this.changeActivePlayer(this.activPlayer);

    if (this.activePlayer.isMan) return;


    this.findWinningMove(this.activePlayer);
    if (!moveFlag.isMoved) this.findWinningMove(this.enotherPlayer);
    if (!moveFlag.isMoved) this.findRandomMove();
  },

  //-обнуляем игровое поле
  clearField: function () {
    for (var i = 0; i < 9; i++)
      this.gameField[i] = 'E';
  },
}

//*****************************************************
//----Класс рисования в канвасе. Контроль поля на экране.

var canvasHandler = {
  popUpWindow: 'non', //-Открыто ли всплывающее окно
  
  //-Устанавливат размер ячеек поля
  setCellSize: function (id, sellSize) {
    var context = document.getElementById(id).getContext('2d');
    context.canvas.width = sellSize;
    context.canvas.height = sellSize;
  },

  //-Получает размер ячеек на экране
  getCellSize: function () {

    var fieldDiv = document.getElementById('fieldDiv');
    var width = (fieldDiv.offsetWidth < fieldDiv.offsetHeight) ? fieldDiv.offsetWidth : fieldDiv.offsetHeight;
    return 0.3 * (width - 60);
  },

  //-Меняер размер игрового поля
  resizeGameField: function () {
    var mainDiv = document.getElementById('mainDiv');
    mainDiv.style.width = (window.innerWidth > window.innerHeight) ? window.innerHeight + 'px' : window.innerWidth + 'px';
    mainDiv.style.margin = 'auto';

    var fieldDiv = document.getElementById('fieldDiv');
    fieldDiv.style.height = window.innerHeight - document.getElementById('responsive-menu').offsetHeight - document.getElementById('responsive-footer').offsetHeight + 'px';

    document.getElementById('table').style.width = (fieldDiv.offsetWidth < fieldDiv.offsetHeight) ? fieldDiv.style.width : fieldDiv.style.height;

    document.getElementById('table').style.margin = 'auto';
  },
  
  //Рисует крест или ноль в клетке поля
  writeSymbol: function (id, symbol, color) {
    var context = document.getElementById(id).getContext('2d');
    var canvasWidth = document.getElementById(id).offsetWidth;
    var canvasHeight = document.getElementById(id).offsetHeight;
    var radius;

    var borderWidth = Math.round(canvasWidth / 100 * 20);
    var borderHeight = Math.round(canvasHeight / 100 * 20);

    context.strokeStyle = color;
    context.lineWidth = 10;
    context.lineCap = 'square'; //'round';

    switch (symbol) {
      case 'X':
        context.beginPath();
        context.moveTo(borderWidth, borderHeight);
        context.lineTo(canvasWidth - borderWidth, canvasHeight - borderHeight);
        context.moveTo(canvasWidth - borderWidth, borderHeight);
        context.lineTo(borderWidth, canvasHeight - borderHeight);
        context.stroke();
        break;

      case '0':
        radius = (canvasWidth < canvasHeight) ? canvasWidth / 2 - borderWidth : canvasHeight / 2 - borderHeight;
        context.beginPath();
        context.arc(canvasWidth / 2, canvasHeight / 2, radius, 0, 2 * Math.PI);
        context.stroke();
        break;
    }
  },

  //-Удаляет символ из игровой клетки
  clearSymbol: function (id) {
    var canvas = document.getElementById(id).getContext('2d');
    var canvasWidth = document.getElementById(id).width;
    var canvasHeight = document.getElementById(id).height;
    canvas.clearRect(0, 0, canvasWidth, canvasHeight);
  },

  //-чистит игровое поле
  clearScreen: function () {
    for (var i = 0; i < 9; i++)
      this.clearSymbol(i);

    gamePlay.clearField();
  }
}

//*****************************************************
//----Функции обработки событий

//-Рисует окно с результатом игры
function drawResultWindow(result) {
  document.getElementById('forWindows').innerHTML = window.resultWindowHTML;
  document.getElementById('result').innerHTML = result;
  canvasHandler.popUpWindow = 'resultWindow';
  resizeResultWindow();

  clearInterval(gamePlay.intervalID);
}

//-Закрывает (удаляет) окно с результатом игры
function closeResultWindow() {
  document.getElementById('forWindows').innerHTML = '';
  canvasHandler.popUpWindow = 'non';
  console.log("Закрыли окно результатов!");
}

//-Меняет размер окна с результатом
function resizeResultWindow() {
  var win = document.getElementById('resultWindow');
  if (window.innerWidth < 300) {
    win.style.width = (window.innerWidth - 20) + 'px';
    win.style.textAllign = 'center';
  }
}

//-Рисует окно настроек игры
function drawSetupWindow() {
  document.getElementById("forWindows").innerHTML = window.setupWindowHTML;
  canvasHandler.popUpWindow = 'setupWindow';
  resizeSetupWindow();
  clearInterval(gamePlay.intervalID);
}

//-Меняет размер окна настроек
function resizeSetupWindow() {
  var win = document.getElementById("setupWindow");
  if (window.innerWidth < 458) {
    win.style.width = (window.innerWidth - 20) + 'px';
    win.style.textAllign = 'center';
    win.querySelector('div.setPlayer1').style.borderStyle = 'none';
    win.querySelector('div.setPlayer1').style.float = 'none';
    win.querySelector('div.setPlayer2').style.borderStyle = 'none';
    win.querySelector('div.setPlayer2').style.float = 'none';
  }
}

//-Стартует игру и делает первый ход, если первый игрок робот
function startGame() {
  gamePlay.endOfGame = false;
  gamePlay.noMoves = false;
  moveFlag.isMoved = false;
  canvasHandler.clearScreen();
  gamePlay.intervalID = setInterval("gamePlay.play()", 2);

  if (!gamePlay.activePlayer.isMan)
    gamePlay.findRandomMove();
}

//-Реакция на кнопку "принять настройки"
function acceptSettings() {
  gamePlay.activePlayer = player1;
  gamePlay.activePlayer.name = (document.getElementById('name1').value == '') ? 'Вася' : document.getElementById('name1').value;
  gamePlay.activePlayer.isMan = (document.getElementById('isMan1').value == 'true') ? true : false;

  gamePlay.enotherPlayer = player2;
  gamePlay.enotherPlayer.name = (document.getElementById('name2').value == '') ? 'R2D2' : document.getElementById('name2').value;
  gamePlay.enotherPlayer.isMan = (document.getElementById('isMan2').value == 'true') ? true : false;

  document.getElementById('forWindows').innerHTML = '';
  canvasHandler.popUpWindow = 'non';
  gamePlay.endOfGame = true;
  //canvasHandler.clearScreen();
}

//-Человеческий ход. Реакция на левый тычек мыши
function humanMoveHandler(id) {
  if (gamePlay.endOfGame){
    console.log('Нажмите СТАРТ!');
    return;
  }
  
  if (gamePlay.gameField[parseInt(id)] == 'E') {
    moveFlag.isMoved = true;
    moveFlag.pressedFieldId = parseInt(id);
  } else console.log('Поле занято! Для хода выберите пустое.');
}

//-Подсказка. Реакция на указатель над ячейкой поля.
function mouseOverHandler(id) {
  if (gamePlay.endOfGame) return;
  if (gamePlay.gameField[parseInt(id)] == 'E') {
    canvasHandler.writeSymbol(id, gamePlay.activePlayer.symbol, '#CECECE');
  }
}

//-Убираем подсказку если указатель "ушел"
function mouseOutHandler(id) {
  if (gamePlay.endOfGame) return;
  if (gamePlay.gameField[parseInt(id)] == 'E') {
    canvasHandler.clearSymbol(id);
  }
}

//-Реакция на изменение размеров окна браузера
function onResize() {

  canvasHandler.resizeGameField();

  var cellSize = canvasHandler.getCellSize();

  for (var i = 0; i < 9; i++) {
    canvasHandler.setCellSize(i, cellSize);
    if (gamePlay.gameField[i] != 'E')
      canvasHandler.writeSymbol(i, gamePlay.gameField[i], 'black');
  }

  if (canvasHandler.popUpWindow == 'setupWindow') resizeSetupWindow();
  if (canvasHandler.popUpWindow == 'resultWindow') resizeResultWindow();
}

//Инициализация игры, когда загрузится окно
window.onload = function () {

  canvasHandler.resizeGameField();

  var cellSize = canvasHandler.getCellSize();

  for (var i = 0; i < 9; i++) {
    canvasHandler.setCellSize(i, cellSize);
  }

  window.addEventListener('resize', onResize);
};
