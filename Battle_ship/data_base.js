const mysql = require('mysql2');

const connection_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwer',
    database: 'battle_ship_user'
});

connection_db.connect((err)=>{
    if(err) throw err;
    console.log("Connect data base")
})

//id_user => User-700001

function createUser(nick,login, hashedPassword, callback) {

    const query = 'INSERT INTO user (Nick, Login, Password) VALUES (?, ?, ?)';
    connection_db.query(query, [nick,login, hashedPassword], callback);
}

function findUserByUsername(login, callback) {
    const query = 'SELECT * FROM user WHERE Login = ?';
    connection_db.query(query, [login], callback);
}

function addwin(id,callback){
    const query = 'UPDATE user SET Win = Win+1 WHERE id = ?'
    connection_db.query(query, [id], callback);
}
function addloss(id,callback){
    const query = 'UPDATE user SET Loss = Loss+1 WHERE id = ?'
    connection_db.query(query, [id], callback);
}
module.exports={ 
    connection_db, 
    createUser,
    findUserByUsername,
    addwin,
    addloss
}