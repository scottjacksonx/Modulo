var systemDB;

function showAnswer(transaction, results) {
	if (results.rows.length != 0) {
		var record = results.rows.item(0);
		var lastAnswer = record['value'];
		document.getElementById("answer").innerHTML = lastAnswer;
	}
}

function showDividend(transaction, results) {
	if (results.rows.length != 0) {
		var record = results.rows.item(0);
		var lastDividend = record['value'];
		document.getElementById("dividend").value = lastDividend;
	}
}

function showDivisor(transaction, results) {
	if (results.rows.length != 0) {
		var record = results.rows.item(0);
		var lastDivisor = record['value'];
		document.getElementById("divisor").value = lastDivisor;
	}
}

function initDB()
{
	try {
	    if (!window.openDatabase) {
	        alert('not supported');
	    } else {
	        var shortName = 'moduloDB';
	        var version = '1.0';
	        var displayName = 'Last Modulo Answer';
	        var maxSize = 65536; // in bytes
	        var db = openDatabase(shortName, version, displayName, maxSize);
			systemDB = db;
			createTables(systemDB);
			
			systemDB.transaction(
				function (transaction) {
					transaction.executeSql('SELECT * FROM lastanswer;', [], showAnswer, killTransaction);
					transaction.executeSql('SELECT * FROM lastdividend;', [], showDividend, killTransaction);
					transaction.executeSql('SELECT * FROM lastdivisor;', [], showDivisor, killTransaction);
				}
			);
	    }
	} catch(e) {
	    // Error handling code goes here.
	    if (e == INVALID_STATE_ERR) {
	        // Version number mismatch.
			alert("Invalid database version.");
	    } else {
			alert("Unknown error "+e+".");
	    }
	    return;
	}
}

function createTables(db)
{

db.transaction(
    function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS lastanswer(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL);');
		transaction.executeSql('CREATE TABLE IF NOT EXISTS lastdividend(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL);');
		transaction.executeSql('CREATE TABLE IF NOT EXISTS lastdivisor(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL);');
    }
);
}

function killTransaction(transaction, error)
{
	alert('Oops. ' + error.message);
}


function addRecords(db)
{
	/* Store the value of the answer. */
	var answer = document.getElementById('answer').innerHTML;
	if (answer != "") {
		db.transaction(
			function (transaction) {
				transaction.executeSql('INSERT INTO lastanswer (value) VALUES ("' + answer + '");');
			}
		);
	}
	
	/* Store the value of the dividend. */
	var dividend = document.getElementById('dividend').value;
	if (dividend != "") {
		db.transaction(
			function (transaction) {
				transaction.executeSql('INSERT INTO lastdividend (value) VALUES ("' + dividend + '");');
			}
		);
	}
	
	/* Store the value of the divisor. */
	var divisor = document.getElementById('divisor').value;
	if (divisor != "") {
		db.transaction(
			function (transaction) {
				transaction.executeSql('INSERT INTO lastdivisor (value) VALUES ("' + divisor + '");');
			}
		);
	}
}

function nukeTables(db) {
	db.transaction(
		function (transaction){
			transaction.executeSql('DELETE FROM lastanswer;');
			transaction.executeSql('DELETE FROM lastdividend;');
			transaction.executeSql('DELETE FROM lastdivisor;');
		}
	);
}


