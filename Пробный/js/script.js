//Массивы для отображения поля. (в системе)

let field_xy = [//Поле игрока
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

let field_xy2 = [//Поле робота.
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

//Массивы для разришения что-то на противоположном поле.(в системе)

let field_CanShot= [//Поле игрока для проверки выстрела.
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

let field_CanShot2= [//Поле робота для проверки выстрела.
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

/*-----------------------------------------*/

//Массив, в котором хронятся данные: (0)Имя, (1)кол-во палуб или оставшихся палуб, а в дальнейшем Id div-ов, чтобы осуществить пометку убитого коробля. 

data_ship = [
    ["Ch",4],//Однопалубники
    ["Tr1",3],["Tr2",3],//Трёхпалубники
    ["db1",2],["db2",2],["db3",2], //Двухпалубники
    ["on1",1],["on2",1],["on3",1],["on4",1] //Однопалубники
]

data_ship2 = [
    ["Ch",4],//Однопалубники
    ["Tr1",3],["Tr2",3],//Трёхпалубники
    ["db1",2],["db2",2],["db3",2], //Двухпалубники
    ["on1",1],["on2",1],["on3",1],["on4",1] //Однопалубники
]

/*-----------------------------------------*/

//Переменные

Ship_Sum = 10


var dead_ship = 0
var dead_ship2 = 0

var triger = 0
var key_play = false

coord_xy = 0

Ship = 0


/*-----------------------------------------*/




//Моё виденье попаданий кораблей

// Можно - true, нельзя - false не знаю англиский

//var field = document.querySelector('.Field'); Класс


/*-----------------------------------------*/ 

//Берём из HTML те или иные элементы.


// Берём места, куда поместим 2 поля (визуально).
var wrapperBlock = document.getElementById("wrapperBlock");
var wrapperBlock2 = document.getElementById("wrapperBlock2");

// Поле с кнопками.
var Block_button = document.getElementById("Block_button")

/*-----------------------------------------*/ 

//Кнопки.


//Вызвать функцию "рандом", чтобы рандомно раставить корабли.
let Rand = document.getElementById("Random")
Rand.addEventListener('click', Random)

//Выбрать функцию "Раставить в ручную", чтобы игрок мог раставить корабли как ему нужно.
let Pos = document.getElementById("Position")
Pos.addEventListener('click', Position)

//Запустить игру.
let Play = document.getElementById("Play")
Play.addEventListener('click', Play_game)


/*-----------------------------------------*/ 

//Создаём 2 поля.

for(i=0;i<10;i++){
    
    // Поле 1 
    for(j=0;j<10;j++){
        var square = document.createElement("div");
        square.classList.add("square");
        square.id=i+";"+j;
        square.innerText = " ";
        wrapperBlock.appendChild(square)
    }
    // Поле 2
    for(j=0;j<10;j++){
        var square2 = document.createElement("div");
        square2.classList.add("square2");
        square2.id=i+";;"+j;
        square2.addEventListener('click',handleClick);
        square2.innerText = " ";
        wrapperBlock2.appendChild(square2)
    }
}

/*-----------------------------------------*/ 

//Функции пользователя.

function Random(){//Создание кораблей по методу рандома.
    key_play = true

    if(check_Fl()==true){}//Проверяем, был ли поле уже запонино.

    //Определяем расположение по вертикали или по горизонтали.ы
    // 0 - горизонталь; 1 - вертекаль
    //remove('active')
    //Добавить отчистку, если игрок решит заново пересгенерировать положение кораблей.
    for(r=0;r<Ship_Sum;r++){
        Name_Ship = data_ship[r][0]//Название корабля.
        dask = data_ship[r][1]//Кол-во палуб.
        let vr_coord =[]//Временый массив, мнимых координат корабля на поле.
        Wh_tf=true
        /* 
            Цикл while нужен, чтобы генерировать координаты и проверять(функция checkShipBoard), можно ли на этих координатах ставить корабль.
            Есла "да", то выполнится функция и прервётся цикл while.
            Если "нет", то цикл не завершится и заново будет генерировать координаты.
        */
        while(Wh_tf == true){
            var xy = Math.round(Math.random()) //Рандомное число от 0 до 1
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
                    
                    vr_coord[i] = [x,y]//Координаты временного массива.
                    y= y+1
                }
        
                
            }else{     // 1 - вертекаль
                min = 0 
                max = 9
                x = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
                y = Math.floor(Math.random() * (max - min + 1)) + min
                absl = max - dask+1
                alf = dask//Координаты временного массива.
        
                /*--------------------------------------------------------------------------------- */
        
                //Из первой координаты создаём уже сам корабль.
                for (i=0;i<alf;i++){
                    vr_coord[i] = [x,y]
                    x= x+1
                }    
            }
            if(checkShipBoard(vr_coord)==true){
                
                for(r1=0;r1<vr_coord.length;r1++){
                    x5=vr_coord[r1][0]
                    y5=vr_coord[r1][1]
                    document.getElementById(x5+";"+y5).classList.add("Ship_shadow")
                    field_xy[x5][y5] = Name_Ship
                }
                for(c=0;c<vr_coord.length;c++){ //Обводка вокруг корабля.
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
                    //console.log(vr_Check_Ship) //Координаты вокруг клетки.
            
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
                Wh_tf = false
            }

        }//Конец цикла while
        
    }//Конец цикла for
    

}

function Position(){
    key_play = false
    if(check_Fl()==true){}
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            document.getElementById(i+";"+j).addEventListener('click', Pos_ship)
            document.getElementById(i+";"+j).addEventListener("mouseover", Hover_on)
            document.getElementById(i+";"+j).addEventListener("mouseleave", Hover_off)
            document.getElementById(i+";"+j).addEventListener('contextmenu', Change_Pos)
        }
    }
    
}

function Play_game(){
    if(key_play == true){
        if(Random2()==true){
            Block_button.style.display = "none"
        }
    }
    if(Ship==9){
        if(Random2()==true){
            Block_button.style.display = "none"
        }
    }else{
        alert("Раставте корабли.")
    }
    

}


function handleClick(event){//Выстрел.
    // Берём id div-ва и разделяем на координаты Х и У.
    coords=event.srcElement.id.split(";;");
    x_coord=coords[0];
    y_coord=coords[1]; 
    // Берём id div-ва
    let att= document.getElementById(event.srcElement.id)
    


    /*--------------------------------------------*/
    if(field_CanShot2[x_coord][y_coord]==true){//Проверка на выстрел 
        field_CanShot2[x_coord][y_coord] = false
        
        //Проверка на попадания по карабл, и если он попал, то данные изменяются и переносятся в массив data_ship
        
        for(g = 0;g<10;g++){
            if(field_xy2[x_coord][y_coord]==data_ship[g][0]){//Если попал
                hp = data_ship2[g][1]
                hp = hp-1
                data_ship2[g][1] = hp
                data_ship2[g].push(att)
                att.style.backgroundColor = '#ffa1a1' //Цвет, что ты попал.

            }else if(field_xy2[x_coord][y_coord]==0 || field_xy2[x_coord][y_coord]==1){ //Промах.
                att.style.backgroundColor = '#b882ff' //Цвет, что ты промазал.
            }
            //Мертвяк.
            if (data_ship2[g][1]==0){
                for(k=2;k<data_ship2[g].length;k++){
                    stl= data_ship2[g][k]
                    stl.style.backgroundColor = '#3dffae'
                }
                dead_ship = dead_ship + 1
                data_ship2[g][1] = "dead"
                console.log(dead_ship)
                console.log(data_ship2[g])
            }    
        }
        
        if(Ship_Sum == dead_ship){
            setInterval(function(){
                let result2 = document.getElementById("Win_Lozz")
                result2.innerText = "Вы уничтожели все корабли.";
            }, 200);
        }
    }
      
}

function Pos_ship(event){
    if(Ship<10){
        coords2= event.srcElement.id.split(";")
        Name_Ship = data_ship[Ship][0]
        x_coord = Number(coords2[0])
        y_coord = Number(coords2[1])

        let vr_coord2 = []
        for(i=0;i<data_ship[Ship][1];i++){
            if(coord_xy==0){
                vr_coord2.push([x_coord,y_coord ])
                field_xy[x_coord][y_coord]=Name_Ship
                document.getElementById(x_coord+";"+y_coord).classList.add("Ship_shadow")
                y_coord=y_coord+1
            } else{
                vr_coord2.push([x_coord,y_coord ])
                field_xy[x_coord][y_coord]=Name_Ship
                document.getElementById(x_coord+";"+y_coord).classList.add("Ship_shadow")
                x_coord=x_coord+1
            }
        }
        for(c=0;c<vr_coord2.length;c++){ //Обводка вокруг корабля.
            let vr_Check_Ship =[]
            //Начальные координаты палубы корабля.
            x1=vr_coord2[c][0]
            y1=vr_coord2[c][1]
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
            
            //console.log(vr_Check_Ship) //Координаты вокруг клетки.

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
        Ship++
    }
    
}


function Change_Pos(event){
    event.preventDefault(); // Отменяем вызов стандартного контекстного меню браузера
    if(coord_xy == 0){
        coord_xy = 1
        console.log(coord_xy)
    }else{
        coord_xy = 0
        console.log(coord_xy)
    }
}

/*-----------------------------------------*/ 

//Функции робота.

function Random2(){//Создание кораблей по методу рандома.
    //Проверяем, был ли поле уже запонино. 0 - не было установленые корабли, 1 - уже установленны корабли, нужно их удалить их.
    //Определяем расположение по вертикали или по горизонтали.ы
    // 0 - горизонталь; 1 - вертекаль
    //remove('active')
    //Добавить отчистку, если игрок решит заново пересгенерировать положение кораблей.
    for(r=0;r<Ship_Sum;r++){
        Name_Ship = data_ship2[r][0]//Название корабля.
        dask = data_ship2[r][1]//Кол-во палуб.
        let vr_coord =[]//Временый массив, мнимых координат корабля на поле.
        Wh_tf=true
        /* 
            Цикл while нужен, чтобы генерировать координаты и проверять(функция checkShipBoard), можно ли на этих координатах ставить корабль.
            Есла "да", то выполнится функция и прервётся цикл while.
            Если "нет", то цикл не завершится и заново будет генерировать координаты.
        */
        while(Wh_tf == true){
            var xy = Math.round(Math.random()) //Рандомное число от 0 до 1
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
                    
                    vr_coord[i] = [x,y]//Координаты временного массива.
                    y= y+1
                }
        
                
            }else{     // 1 - вертекаль
                min = 0 
                max = 9
                x = Math.floor(Math.random() * (max - dask - min + 2)) + min;//Диапозон с учётом с размером корабля.
                y = Math.floor(Math.random() * (max - min + 1)) + min
                absl = max - dask+1
                alf = dask//Координаты временного массива.
        
                /*--------------------------------------------------------------------------------- */
        
                //Из первой координаты создаём уже сам корабль.
                for (i=0;i<alf;i++){
                    vr_coord[i] = [x,y]
                    x= x+1
                }    
            }
            if(checkShipBoard2(vr_coord)==true){
                
                for(r1=0;r1<vr_coord.length;r1++){
                    x5=vr_coord[r1][0]
                    y5=vr_coord[r1][1]
                    document.getElementById(x5+";;"+y5).classList.add("Ship_shadow")
                    field_xy2[x5][y5] = Name_Ship
                }
                for(c=0;c<vr_coord.length;c++){ //Обводка вокруг корабля.
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
                    //console.log(vr_Check_Ship) //Координаты вокруг клетки.
            
                    //Проверка координат, чтобы пометить поле возле корабля.
                    for(chk=0;chk<vr_Check_Ship.length;chk++){
                        x2= vr_Check_Ship[chk][0]
                        y2= vr_Check_Ship[chk][1]
                        if (x2>-1 && x2<10){ //9>=x2>=0
                            if (y2>-1 && y2<10){
                                if(field_xy2[x2][y2]==0){
                                    field_xy2[x2][y2] = 1
                                }
                            }
                            
                        }
                    }
            
                }
                Wh_tf = false
            }

        }//Конец цикла while
        
    }//Конец цикла for
    
    return true
}



/*-----------------------------------------*/ 

//Системные функции

function Delet(xd,yd){//Проверка и удаление кораблей, если они уже на поле.
    if (field_xy[xd][yd]==0){ // Нет в массиве ничего
        return 0
    } else{
        return 1 // Есть в массиве палуба или очертания вокруг корабля(1) 
    }
}

function check_Fl(){
    if(triger == 1){
        for(xd=0;xd<10;xd++){
            for(yd=0;yd<10;yd++){
                //Очищаем массив и поле.
                if(Delet(xd,yd)== 1){
                    field_xy[xd][yd] = 0 //Очистака массива по координатам
                    document.getElementById(xd+";"+yd).classList.remove("Ship_shadow") //Удаляем палубу на поле.
                }
            }
        }
    } else{
        triger= triger + 1
    }
    return true
}

function checkShipBoard(vr_coord){ //Проверяем можно ли поставить корабль
    
    Can=0
    for(i=0;i<vr_coord.length;i++){
        x4= vr_coord[i][0]
        y4= vr_coord[i][1]
        if(field_xy[x4][y4] == 0){
            Can=Can+1    
        } else {
            break;
        }
    }
    if(Can==vr_coord.length){
        return true;
    }else{
        return false;
    } 
    


}

function checkShipBoard2(vr_coord){ //Проверяем можно ли поставить корабль робота
    
    Can=0
    for(i=0;i<vr_coord.length;i++){
        x4= vr_coord[i][0]
        y4= vr_coord[i][1]
        if(field_xy2[x4][y4] == 0){
            Can=Can+1    
        } else {
            break;
        }
    }
    if(Can==vr_coord.length){
        return true;
    }else{
        return false;
    } 
    


}

function Chek_pos(vr_coord){
    Can = 0
    Can_Fl = 0
    for(i=0;i<vr_coord.length;i++){
        kx= vr_coord[i][0]
        ky= vr_coord[i][1]
        if(ky>-1 && ky<10){
            if(kx>-1 && kx<10){
                Can++
            }
        }
    }
    if(Can==vr_coord.length){
        for(j=0;j<vr_coord.length;j++){
            kx2= vr_coord[j][0]
            ky2= vr_coord[j][1]
            if(field_xy[kx2][ky2]==0){
                Can_Fl++
            }else{
                break
            }
        }
    }
    if(Can_Fl==vr_coord.length){
        return true
    } else {
        return false
    }
}

function Hover_on(event){
    if(Ship<10){
        coords=event.srcElement.id.split(";");
        x_coord=coords[0];
        y_coord=coords[1];
        let vr_coord=[]
        if(coord_xy==0){//x y+
            x= x_coord
            y= y_coord
            for(i=0;i<data_ship[Ship][1];i++){
                vr_coord.push([x,y])
                y++
            }
        }
        if(coord_xy==1){//x+ y
            x= x_coord
            y= y_coord
            for(i=0;i<data_ship[Ship][1];i++){
                vr_coord.push([x,y])
                x++
            }
        }
        if(Chek_pos(vr_coord)==true){
            for (k=0;k<vr_coord.length;k++){
                a= vr_coord[k][0]
                b= vr_coord[k][1]
                document.getElementById(a+";"+b).classList.add("Hover_on")
            }
        }else{
            for (k=0;k<vr_coord.length;k++){
                a= vr_coord[k][0]
                b= vr_coord[k][1]
                if(a>-1 && a<10){
                    if(b>-1&& b<10){
                        document.getElementById(a+";"+b).classList.add("Hover_on_red")
                    }
                }
            }
        }
    }
    
    //document.getElementById(event.srcElement.id).classList.add("Hover_on")
}
function Hover_off(event){
    if(Ship<10){
        coords=event.srcElement.id.split(";");
        x_coord=coords[0];
        y_coord=coords[1];
        let vr_coord2=[]
        if(coord_xy==0){//x y+
            x= x_coord
            y= y_coord
            for(i=0;i<data_ship[Ship][1];i++){
                vr_coord2.push([x,y])
                y++
            }

        }
        if(coord_xy==1){//x+ y
            x= x_coord
            y= y_coord
            for(i=0;i<data_ship[Ship][1];i++){
                vr_coord2.push([x,y])
                x++
            }
        }
    }
    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            elm= document.getElementById(i+";"+j)
            if(elm.classList.contains("Hover_on_red")){
                elm.classList.remove("Hover_on_red")
            }
            if(elm.classList.contains("Hover_on")){
                elm.classList.remove("Hover_on")
            }
        }
    }
    
    
    //document.getElementById(event.srcElement.id).classList.remove("Hover_on")
}
