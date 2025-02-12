
//Массив, куда помещаются корабли.
let field_xy = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,"Tr1",0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,0,"Ch","Ch","Ch","Ch"],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];


//Корабли и их ХП (кол-во целых палуб.)
//Однопалубники
let on1 = 1
let on2 = 1
let on3 = 1
let on4 = 1
//Двухпалубники
let db1 = 2
let db2 = 2
let db3 = 2
//Трёхпалубники
let Tr1 = 3
let Tr2 = 3
//Однопалубники
let Ch = 4;

/*-----------------------*/ 

var b = 0;
var hit= 0;

let dead_ship = [];

//Массив для регистрации попадания по кораблю.
let hit_ship = [
    [],[],[],[], //0-3   - Однопалубники
    [],[],[],    //4-6   - Двухпалубники
    [],[],       // 7-8  - Трёхпалубники
    [],          // 9    - Однопалубники
];



//Моё виденье попаданий кораблей
/*let hit_ship = [
    // Координаты Попадания (КП) могут быть в разном порядек, не важно как начать бить корабль
    [id_N, id_N, id_N] // трёхпалублин и его КП
    [id_N, id_N, id_N, id_N] // чётырёхпалубник и его КП
    и тд.
]; 
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

    /*--------------------------------------------*/
    
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

    /*--------------------------------------------*/

    //Результат при потапление кораблей
    if (hit==7){
        //Таймер, перед объевлением. 
        setInterval(function(){
            let result2 = document.getElementById("Win_Lozz")
            result2.innerText = "Вы уничтожели все корабли.";
        }, 200);
    }
}


