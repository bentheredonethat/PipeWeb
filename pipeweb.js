// structure of objects

// 1 cycle has:
// --up to to five instructions
// --possibly some dependencies
function Cycle(){
	this.dependencies = {};
	this.IF = null;
	this.ID = null;
	this.EX = null;
	this.MEM = null;
	this.WB = null;
	Cycle.prototype.constructor = function(stages, dependencies){
		IF = stages['IF'];
		ID = stages['ID'];
		EX = stages['EX'];
		MEM = stages['MEM'];
		WB = stages['WB'];
		this.dependencies = dependencies;
	};
};

// 1 instruction  has:
// -- a format
// -- some registers associated with fields (rs, rt, etc.)
// -- register operation 
function Instruction(){
	this.format = null;
	this.registers= {};
	this.operation = null;
	Instruction.prototype.constructor = function(format, registers, operation){
		this.format = format;
		this.registers = registers;
		this.operation = operation;
	};
};

// 1 register has:
// -- name associated with value
// -- e.g. "$zero" : 0
function Register(){
	this.name = null;
	this.value = null;
    Register.prototype.constructor = function(name, value){
    	this.name = name;
    	this.value = value;
    };
};



function myCreateFunction() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(-1);
    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
var cell5 = row.insertCell(4);

// Add some text to the new cells:
cell1.innerHTML = "NEW CELL1";
cell2.innerHTML = "NEW CELL2";
cell3.innerHTML = "NEW CELL3";
cell4.innerHTML = "NEW CELL4";
cell5.innerHTML = "NEW CELL5";


var input = document.getElementById("myText").value;
        alert(input);
}



