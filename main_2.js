'use strict';
/*jslint devel: true */

var player1 = {
  name: 'Vasya',
  symbol: 'X',
  isMan: true
}

var player2 = {
  name: 'Verter',
  symbol: '0',
  isMan: true
}

//----------------------------------------------------------------------------
//----Флаг хода сигнализирует, что ход был
var moveFlag = {
  pressedFieldId: 'empty',
  isMoved: false,
};


function humanMoveHandler(id) {
  if (document.getElementById(id).value == '') {
    moveFlag.isMoved = true;
    moveFlag.pressedFieldId = id;
  } else console.log('Поле занято! Для хода выберите пустое.');
}

//-------------------------------------------------------------------------------
//-----Класс игровой логики: контроль поля, чередование игроков, фиксация ходов
var gamePlay = {
  gameField: [['E', 'E', 'E'],
              ['E', 'E', 'E'],
              ['E', 'E', 'E']],

  activePlayer: player1,
  enotherPlayer: player2,
  
  endOfGame: false,

  makeMove: function () {
    var row = parseInt(moveFlag.pressedFieldId[1]);
    var col = parseInt(moveFlag.pressedFieldId[0]);

    document.getElementById(moveFlag.pressedFieldId).value = this.activePlayer.symbol;
    this.gameField[col][row] = this.activePlayer.symbol;
    moveFlag.isMoved = false; //сбрасываем флаг хода
    console.log(this.gameField.toString());
  },

  isActivPlayerWinner: function () {
    
    //--Проверяем на победу строки
    var count=0;
    for(var row=0; row<3; row++){  
      for(var col=0; col<3; col++){
        if(this.gameField[row][col]==this.activePlayer.symbol) count++; 
      }
      if(count==3) { console.log('Строки'); return true;}
      count=0;
    }
    
    //--Проверяем на победу колонки
    count=0;
    for(col=0; col<3; col++){  
      for(row=0; row<3; row++){
        if(this.gameField[row][col]==this.activePlayer.symbol) count++; 
      }
      if(count==3){ console.log('Колонки'); return true;}
      if(count==3) { console.log('Строки'); return true;}
      count=0;
    }
    
    //--Проверяем на победу левую диагональ
    count=0;
    for(row=0, col=0; row<3; row++, col++){
      if(this.gameField[row][col]==this.activePlayer.symbol) count++; 
    }
    if(count==3) { console.log('Лев. диагональ'); return true;}
    
    //--Проверяем на победу правую диагональ
    count=0;
    for(row=0, col=2; row<3; row++, col--){
      if(this.gameField[row][col]==this.activePlayer.symbol) count++;
    }
    if(count==3) { console.log('Прав. диагональ'); return true;}
    
    return false;
  },

  changeActivPlayer: function () {
    var a = this.enotherPlayer;
    this.enotherPlayer = this.activePlayer;
    this.activePlayer = a;
  },
  
  randomMove: function () {
    
  },

  //----Игровая логика
  play: function () {
    if (!moveFlag.isMoved) return; //Если хода нет, завершаем игровую логику

    this.makeMove();
    
    if (this.isActivPlayerWinner()){
      console.log('Поздравляем, ' + this.activePlayer.name + '! Ты победил!');
      this.endOfGame=true;
    }

    this.changeActivPlayer();
    
    if(this.activPlayer.isMan) return
    
    this.randomMove()
  },
};


//Инициализация игры, когда загрузится окно
window.onload = function () {

  setInterval("gamePlay.play()", 100);
};
