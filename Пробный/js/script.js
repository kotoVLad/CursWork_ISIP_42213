
//Массив, куда помещаются корабли.
let field_xy = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
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
let Position_ship = [
    [],[],[],[], //0-3   - Однопалубники
    [],[],[],    //4-6   - Двухпалубники
    [],[],       // 7-8  - Трёхпалубники
    [],          // 9    - Однопалубники
];



/*
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
*/
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
let Rand = document.getElementById("Random")
Rand.addEventListener('click', Random)
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

function Random(){
    //Определяем расположение по вертикали или по горизонтали.ы
    // 0 - горизонталь; 1 - вертекаль

    //Добавить отчистку, если игрок решит заново пересгенерировать положение кораблей.

    var xy = Math.round(Math.random()) //Рандомное число от 0 до 1
    
    dask = data_ship[9][1]//Тут будут уже сами корабли подставлятьчя через цикл**.
    let vr_coord =[]
    if (xy==0){ // 0 - горизонталь
        min = 0
        max = 9
        x = Math.floor(Math.random() * (max - min + 1)) + min
        y = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
        absl = max - dask+1 //Максимум по координатам, котором можно поставить корабль,
                            //чтобы не зайти за поле.
        alf = dask//Временный массив координат кораблей.
        
        /*--------------------------------------------------------------------------------- */

        //Из первой координаты создаём уже сам корабль.
        for (i=0;i<alf;i++){
            console.log("Горизонтальная")
            field_xy[x][y] = data_ship[9][0] //Тут будут уже сами корабли подставлятьчя через цикл**.
            vr_coord[i] = [x,y]//Координаты временного массива.
            y= y+1
            //Проверяем координаты временого массива, если одна из них налезает на 1 или др, то генерируется заново.

           //^^Почти всё тоже саммое, но уже для вертикальных^^
        }

        
    } else{     // 1 - вертекаль
        console.log("Вертекаль")
        min = 0 
        max = 9
        x = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
        y = Math.floor(Math.random() * (max - min + 1)) + min
        absl = max - dask+1
        alf = dask//Координаты временного массива.

        /*--------------------------------------------------------------------------------- */

        //Из первой координаты создаём уже сам корабль.
        for (i=0;i<alf;i++){
            field_xy[x][y] = data_ship[9][0]
            vr_coord[i] = [x,y]
            x= x+1
        }
        

        /*-------------------------------------------------------------------------------- */

        //Обводка.
        
    }
    for(c=0;c<vr_coord.length;c++){
        let vr_Check_Ship =[]
        //Начальные координаты палубы корабля.
        x1=vr_coord[c][0]
        y1=vr_coord[c][1]
        y1=y1+1 //Сдвиг вправо 1 раз.
        vr_Check_Ship.push([x1,y1])
        x1=x1+1//Сдвиг вниз 1 раз.
        vr_Check_Ship.push([x1,y1])
        for(t=0;t<2;t++){//Сдвиг влево 2 раза.
            y1=y1-1
            vr_Check_Ship.push([x1,y1])
        }
        for(tg=0;tg<2;tg++){//Сдвиг вверх 2 раза
            x1=x1-1
            vr_Check_Ship.push([x1,y1])
        }
        for(th=0;th<2;th++){//Сдвиг право 2 раза
            y1=y1+1
            vr_Check_Ship.push([x1,y1])
        }
        console.log(vr_Check_Ship) //Координаты вокруг клетки.

        //Проверка координат, чтобы пометить поле возле корабля.
        for(chk=0;chk<vr_Check_Ship.length;chk++){
            x2= vr_Check_Ship[chk][0]
            y2= vr_Check_Ship[chk][1]
            if (x2>-1 && x2<10){ //9>=x2>=0
                if (y2>-1 && y2<10){
                    if(field_xy[x2][y2]==0){
                        field_xy[x2][y2] = 1
                    }
                }
                
            }
        }

    }
    console.log("Поле",field_xy) 

}

function Position_Creat(){
    //Сюда приходят данные из 
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
                console.log(data_ship[g])
                att.style.backgroundColor = '#ffa1a1' //Цвет, что ты попал.

            }else{ //Промах.
                att.style.backgroundColor = '#b882ff' //Цвет, что ты промазал.
            }
            //Мертвяк.
            if (data_ship[g][1]==0){
                for(k=2;k<data_ship[g].length;k++){
                    
                    stl= data_ship[g][k]
                    //console.log(data_ship[g])
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
      
}


