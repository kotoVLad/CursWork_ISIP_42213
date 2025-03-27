let obj_creat={
    creat_solo(){
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
                square2.addEventListener("mouseover", Hover_maus_on)
                square2.addEventListener("mouseout", Hover_maus_off)
                square2.id=i+";;"+j;
                square2.addEventListener('click',handleClick);
                square2.innerText = " ";
                wrapperBlock2.appendChild(square2)
            }
        }
    },
    creat_duo(){
        for(i=0;i<10;i++){
            // Поле 1 
            for(j=0;j<10;j++){
                var square = document.createElement("div");
                square.classList.add("square");
                square.id=i+";"+j;
                square.addEventListener('click',handleClick2);
                square.addEventListener("mouseover", Hover_maus_on)
                square.addEventListener("mouseout", Hover_maus_off)
                square.innerText = " ";
                wrapperBlock.appendChild(square)
            }
            // Поле 2
            for(j=0;j<10;j++){
                var square2 = document.createElement("div");
                square2.classList.add("square2");
                square2.id=i+";;"+j;
                square2.addEventListener('click',handleClick);
                square2.addEventListener("mouseover", Hover_maus_on)
                square2.addEventListener("mouseout", Hover_maus_off)
                square2.innerText = " ";
                wrapperBlock2.appendChild(square2)
            }
        }
    }
}

export default obj_creat