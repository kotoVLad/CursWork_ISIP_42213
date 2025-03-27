//Hover на поле бота.
function Hover_maus_on(event){
    document.getElementById(event.srcElement.id).classList.add("hover_on2")
}
function Hover_maus_off(event){
    document.getElementById(event.srcElement.id).classList.remove("hover_on2")

}


//Hover на этапе растановки в ручную, визуально показывая, можно поставить корабль или нет.
function Hover_on(event){
    if(Ship<10 && key_f_pos==true){
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
            key_pos = true
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
            key_pos = false
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