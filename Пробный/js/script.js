//Создаём поле размером 330х330
//Клетка будет 33х33
let field_xy = [
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9],
    [0,1,2,3,4,5,6,7,8,9]
];
//document.getElementById('title')
/*
const body = document.body;
body.addEventListener('click', e => {
  console.log('clicked body');
});
*/

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
};

//el.setAttribute('id', 'my-id');

for (i=0;i<2;i++) {
    for (a=0;a<10;a++){
        var div = document.createElement("div");
        div.classList.add('cletca');
        console.log(div);
        document.getElementById("field").appendChild(div);
    }
    
};*/
var wrapperBlock = document.getElementById("wrapperBlock");
window.onload = function(){ //Функция которая создаёт поле 10х2 (10х10)
  for(var i=0; i<10; i++){
    var square = document.createElement("div");
    //square.id = c //Даём каждому div свой ID
    /*if(a<10){
        console.log("Координаты в массиве", c)
    };*/
    square.classList.add("square");
    square.innerText =" ";
    wrapperBlock.appendChild(square);
  }
}
