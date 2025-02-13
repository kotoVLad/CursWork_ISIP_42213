
//Массив, куда помещаются корабли.
let field_xy = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,"Ch","Ch","Ch","Ch"],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

let field_CanShot= [
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,],
    [true,true,true,true,true,true,true,true,true,true,]
]
//Корабли и их ХП (кол-во целых палуб.)

//Массив, в котором хронятся данные: (0)Имя, (1)кол-во палуб или оставшихся палуб, а в дальнейшем Id div-ов, чтобы осуществить пометку убитого коробля. 
data_ship = [
    ["on1",1],["on2",1],["on3",1],["on4",1], //Однопалубники
    ["db1",2],["db2",2],["db3",2], //Двухпалубники
    ["Tr1",3],["Tr2",3],//Трёхпалубники
    ["Ch",4]//Однопалубники
]
//Массив для регистрации попадания по кораблю.
let hit_ship = [
    [],[],[],[], //0-3   - Однопалубники
    [],[],[],    //4-6   - Двухпалубники
    [],[],       // 7-8  - Трёхпалубники
    [],          // 9    - Однопалубники
];




//Однопалубники
let on1 = 1
let on2 = 1
let on3 = 1
let on4 = 1
//Трёхпалубники
let db1 = 2
let db2 = 2
let db3 = 2
//Двухпалубники
let Tr1 = 3
let Tr2 = 3
//Однопалубники
let Ch = 4;

/*-----------------------*/ 

var b = 0;
var hit= 0;

let dead_ship = [];





//Моё виденье попаданий кораблей
/*let hit_ship = [
    // Координаты Попадания (КП) могут быть в разном порядек, не важно как начать бить корабль
    [id_N, id_N, id_N] // трёхпалублин и его КП
    [id_N, id_N, id_N, id_N] // чётырёхпалубник и его КП
    и тд.
]; 
*/

/* //Цикл, который выполнит действие, а после проверит.
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);
*/


// Можно - true, нельзя - false не знаю англиский
//var field = document.querySelector('.Field'); Класс

/*var div = document.createElement("div");
div.style.width = "100px";
div.style.height = "100px";
div.style.background = "red";
div.style.color = "white";
div.innerHTML = "Hello";
console.log(div);
document.getElementById("field").appendChild(div);*/
/*for (i=0;i<10;i++) {
    var div = document.createElement("div");
    div.style.width = "33px";
    div.style.height = "33px";
    div.style.background = "red";
    div.style.color = "white";
    div.innerHTML = "Hello";
    console.log(div);
    document.getElementById("field").appendChild(div);
};*/

//el.setAttribute('id', 'my-id');

/*for (i=0;i<2;i++) {
    for (a=0;a<10;a++){
        var div = document.createElement("div");
        div.classList.add('cletca');
        console.log(div);
        document.getElementById("field").appendChild(div);
    }
    
};*/

var wrapperBlock = document.getElementById("wrapperBlock");

window.onload = function(){

   for(i=0;i<10;i++){
    
        // создаем строку  
        for(j=0;j<10;j++){
            var square = document.createElement("div");
            square.classList.add("square");
            square.id=i+";"+j;
            square.addEventListener('click',handleClick);
            square.innerText = " ";
            wrapperBlock.appendChild(square)
        }
  }
}


function handleClick(event){
    // Берём id div-ва и разделяем на координаты Х и У.
    coords=event.srcElement.id.split(";");
    x_coord=coords[0];
    y_coord=coords[1]; 

    // Берём id div-ва
    let att= document.getElementById(event.srcElement.id)

    /*--------------------------------------------*/
    if(field_CanShot[x_coord][y_coord]==true){
        field_CanShot[x_coord][y_coord] = false//Проверка на выстрел 
        
        //Проверка на попадания по карабл, и если он попал, то данные изменяются и переносятся в массив data_ship
        
        for(g = 0;g<10;g++){
            if(field_xy[x_coord][y_coord]==data_ship[g][0]){//Если попал
                hp = data_ship[g][1]
                console.log(att)
                hp = hp-1
                hit = hit + 1
                data_ship[g][1] = hp
                data_ship[g].push(att)
                att.style.backgroundColor = '#ffa1a1' //Цвет, что ты попал.

            }if (field_xy[x_coord][y_coord]==0){ //Промах.
                att.style.backgroundColor = '#b882ff' //Цвет, что ты промазал.
            }
            if (data_ship[g][1]==0){
                for(k=2;k<data_ship.length;k++){
                    stl= data_ship[g][k]
                    stl.style.backgroundColor = '#3dffae'
                }
            }    
        }
        
        if(hit == 7){
            setInterval(function(){
                let result2 = document.getElementById("Win_Lozz")
                result2.innerText = "Вы уничтожели все корабли.";
            }, 200);
        }
    }
    
    /*if(field_CanShot[x_coord][y_coord]==true){//Проверка на выстрел 
        field_CanShot[x_coord][y_coord] = false
        
        // Регестрация попадания.

        if(field_xy[x_coord][y_coord]=="Tr1"){
            hit_ship[7].push(att)
            att.style.backgroundColor = '#ffa1a1'
            Tr1 = Tr1 - 1
            hit = hit + 1
        
        } else if(field_xy[x_coord][y_coord]=="Ch"){
            
            hit_ship[9].push(att)
            att.style.backgroundColor = '#ffa1a1'
            Ch = Ch - 1
            hit = hit + 1
        
        }
        else {
            att.style.backgroundColor = '#b882ff'
        }

        //--------------------------------------------
        
        //Проверка при потопление корабля.
        if (Tr1==0){
            for(var arr = 0; arr < 3; arr++){
                stl = hit_ship[7][arr];
                stl.style.backgroundColor = '#3dffae'
            }
        }
        if (Ch==0){
            for(var arr = 0; arr < 4; arr++){
                stl = hit_ship[9][arr];
                stl.style.backgroundColor = '#3dffae'
            }
        }

        //--------------------------------------------

        //Результат при потапление кораблей
        if (hit==7){
            //Таймер, перед объевлением. 
            setInterval(function(){
                let result2 = document.getElementById("Win_Lozz")
                result2.innerText = "Вы уничтожели все корабли.";
            }, 200);
        }
    }*/
        
}


