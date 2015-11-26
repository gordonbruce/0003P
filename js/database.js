var dbShell;

function phoneReady() {
  //First, open our db
  dbShell = window.openDatabase("Entregapp", 2, "Entregapp", 1000000);
  //run transaction to create initial tables
  dbShell.transaction(setupTable,dbErrorHandler,getEntries);
}

//I just create our initial table - all one of em
function setupTable(tx){
  tx.executeSql("CREATE TABLE IF NOT EXISTS entregappusers(id INTEGER PRIMARY KEY,username,password,empresa_id,filial_id,user_id,ativo,updated)");
}

//I handle getting entries from the db
function getEntries() {
dbShell.transaction(function(tx) {
tx.executeSql("select id, username, password, empresa_id, filial_id,user_id, ativo,updated from entregappusers order by username desc",[],renderEntries,dbErrorHandler);
}, dbErrorHandler);
}

function renderEntries(tx,results){
  doLog("render entries");
  if (results.rows.length == 0) {
  $("#mainContent").html("<p>You currently do not have any notes.</p>");
  } else {
  var s = "";
  for(var i=0; i<results.rows.length; i++) {
  s += "<li><a href='edit.html?id="+results.rows.item(i).id + "'>" + results.rows.item(i).username + "</a></li>";
  }
  $("#noteTitleList").html(s);
  $("#noteTitleList").listview("refresh");
  }
}

function saveNote(entregappusers, cb) {
//Sometimes you may want to jot down something quickly....
if(entregappusers.title == "") entregappusers.title = "[No Title]";
dbShell.transaction(function(tx) {
if(entregappusers.id == "") tx.executeSql("insert into entregappusers(username,password,empresa_id,filial_id,user_id,ativo,updated) values(?,?,?,?,?,?,?)",[entregappusers.username,entregappusers.password,entregappusers.empresa_id,entregappusers.filial_id, entregappusers.user_id,entregappusers.ativo,new Date()]);
else tx.executeSql("update entregappusers set username=?, password=?,empresa_id=?, filial_id=?, user_id=?,ativo=?,updated=? where id=?",[entregappusers.username,entregappusers.password,entregappusers.empresa_id,entregappusers.filial_id, entregappusers.user_id,entregappusers.ativo,new Date(), entregappusers.id]);
}, dbErrorHandler,cb);
}
