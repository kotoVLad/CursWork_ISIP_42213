//Импортные файлы-функции.
const obj_c = require('./creat_field');


/*-----------------------------------------*/ 
//Режим игры.
var key_solo_play = false
var key_duo_play  = false

//Глобальные переменные.
Ship_Sum = 10


var time = 0

var dead_ship = 0
var dead_ship2 = 0

var triger = 0
var key_play = false
var key_f_pos = false
var key_pos = false

var hit=0
var hit_crest = 1
var hit_xy = false //0-горизонталь, 1-вертикаль

var check = 0

trig=true

coord_xy = 0

Ship = 0
var move = false
var move_pc = false//Бот

var move_user = false//Игрок 1
var move_user2 = false//Игрок 2

var move_pc_cycle = false
var Shelling_of_field = false

test_move = 0

/*-----------------------------------------*/ 

//Берём из HTML те или иные элементы.


// Берём места, куда поместим 2 поля (визуально).
var wrapperBlock = document.getElementById("wrapperBlock");
var wrapperBlock2 = document.getElementById("wrapperBlock2");

// Поле с кнопками.
var Block_button = document.getElementById("Block_button")

var Block_Win_Lozz = document.getElementById("Block_Win_Lozz") 


var move_label = document.getElementById("move_label")


/*-----------------------------------------*/ 

//Кнопки.

/*
//Вызвать функцию "рандом", чтобы рандомно раставить корабли.
let Rand = document.getElementById("Random")
Rand.addEventListener('click', Random)

//Выбрать функцию "Раставить в ручную", чтобы игрок мог раставить корабли как ему нужно.
let Pos = document.getElementById("Position")
Pos.addEventListener('click', Position)

//Запустить игру.
let Play = document.getElementById("Play")
Play.addEventListener('click', Play_game)


//Заново
let Again = document.getElementById("Again")
Again.addEventListener('click', Again_start)

//Выйти
let Log_out = document.getElementById("Log_out")
Log_out.addEventListener('click', Log_end)
*/

//Запустить режим соло игры.
let Solo_game = document.getElementById("solo_game");
Solo_game.addEventListener('click', solo_play);

/*-----------------------------------------*/ 

function solo_play(){
    //Убрать все окна.
    //block_game.style.display = 'none';
    document.getElementById("block_game").style.display = 'none';
    document.getElementById("web").style.display = 'none';
    //Создаём поле.
    obj_c.obj_creat.creat_solo()

    //Через время появляется окно с расстановкой кораблей.



    /*
    document.getElementById("Bord_ship").style.display = 'block';
    setTimeout(()=>{document.getElementById("Block_button").style.display = 'block'},1000)
    */
}