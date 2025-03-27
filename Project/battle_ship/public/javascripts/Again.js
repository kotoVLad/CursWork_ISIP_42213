//Полная отчистака и заново начать играть.

function Again_start(){
    Again_1()//Очищаем переменные
    Again_2()//Возращаем обратно изначальные значения
    check_Fl_full()// Очищаем 2 поля.
    move_label.innerText= " "
    Block_Win_Lozz.style.display = "none"
    Block_button.style.display = "block"
    Play.style.display="none"
}
function Again_1(){
    key_solo_play = false
    key_duo_play  = false

    time = 0

    dead_ship = 0

    triger = 0
    key_play = false
    key_f_pos = false
    key_pos = false

    hit=0
    hit_crest = 1
    hit_xy = false //0-горизонталь, 1-вертикаль

    check = 0

    triger = 0 
    Ship=0

    trig=true

    coord_xy = 0

    move = false
    move_pc = false//Бот

    move_user = false//Игрок 1
    move_user2 = false//Игрок 2

    move_pc_cycle = false
    Shelling_of_field = false

    test_move = 0
}
function Again_2(){
    //Очистка.
    hit_bot.length = 0
    shell_field.length = 0
    data_ship.length = 0
    data_ship2.length = 0

    //Возращаем прежние данные.
    data_ship.push(
        ["Ch",4],["Tr1",3],["Tr2",3],["db1",2],["db2",2],
        ["db3",2], ["on1",1],["on2",1],["on3",1],["on4",1]
    )
    data_ship2.push(
        ["Ch",4],["Tr1",3],["Tr2",3],["db1",2],["db2",2],
        ["db3",2], ["on1",1],["on2",1],["on3",1],["on4",1]
    )
}
function check_Fl_full(){
    for(xd=0;xd<10;xd++){
        for(yd=0;yd<10;yd++){

            field_xy[xd][yd] = 0
            field_xy2[xd][yd] = 0

            field_CanShot[xd][yd] = true
            field_CanShot2[xd][yd] = true

            cletka = document.getElementById(xd+";"+yd)

            if(cletka.classList.contains("Ship_shadow")){cletka.classList.remove("Ship_shadow")}
            if(cletka.classList.contains("miss")){cletka.classList.remove("miss")}
            if(cletka.classList.contains("hit")){cletka.classList.remove("hit")}
            if(cletka.classList.contains("dead")){cletka.classList.remove("dead")}

            cletka2 = document.getElementById(xd+";;"+yd)
            if(cletka2.classList.contains("Ship_shadow")){cletka2.classList.remove("Ship_shadow")}
            if(cletka2.classList.contains("miss")){cletka2.classList.remove("miss")}
            if(cletka2.classList.contains("hit")){cletka2.classList.remove("hit")}
            if(cletka2.classList.contains("dead")){cletka2.classList.remove("dead")}
        }
    }
    dead_ship2=0
    
}