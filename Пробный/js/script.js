//Создаём поле размером 330х330
//Клетка будет 33х33

let field_x = ['А','Б','В','Г','Д','Е','Ё','Ж','З','И'];
let field_y = [0,1,2,3,4,5,6,7,8,9];
let field_xy = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];
var a = 0;
var b = 0;

//var field = document.querySelector('.Field');

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
            // создаем столбцы
            if(field_xy[i][j]==1){
                square.classList.add("square_fill");    
            }else  square.classList.add("square");
            square.id=i+";"+j;
            //.setAttribute('id', 'my-id');
            square.addEventListener('click',handleClick);
            square.innerText = " ";
            wrapperBlock.appendChild(square)
        }
  }

    //   for(var i=0; i<100; i++){
    // var square = document.createElement("div");
    // // if(a<10){
    // //     c= field_x[a]+field_y[b]
    // //     console.log(c)
    // //     a= a+1
    // // }; if(a==10){
    // //     a= a-10
    // //     b= b+1
    // // }
    // // field_xy.push({
    // //     name: c
    // // });
    // /*if(a<10){
    //     console.log("Координаты в массиве", c)
    // };*/
    // square.classList.add("square");
    // square.id="cell_"+i;
    // //.setAttribute('id', 'my-id');
    // square.addEventListener('click',handleClick);
    // square.innerText = " ";
    // wrapperBlock.appendChild(square);
  }  

function handleClick(event){
     // На каком элементе (div) произошёл Клик (событие) (отслеживаем имя идентификатора)
    coords=event.srcElement.id.split(";");
    x_coord=coords[0];
    y_coord=coords[1];

     if(field_xy[x_coord][y_coord]==1){
        alert("Попал");
    } else alert("Мимо");


     // На каком элементе (div) произошёл Клик (событие) (отслеживаем имя класса элемента)
    // if(event.srcElement.classList.contains('square_fill')){
    //  alert("Попал");
    // } else alert("Мимо");
    
}


