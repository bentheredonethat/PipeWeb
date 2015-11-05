// structure of objects

// 1 cycle has:
// --up to to five instructions
// --possibly some dependencies
var Cycle = function(stages, dependencies){
	this.IF = stages['IF'];
	this.ID = stages['ID'];
	this.EX = stages['EX'];
	this.MEM = stages['MEM'];
	this.WB = stages['WB'];
	this.dependencies = dependencies;
	
};

// 1 instruction  has:
// -- a format
// -- some registers associated with fields (rs, rt, etc.)
// -- register operation 
var Instruction = function(instruction, registers){
	this.registers= registers;
	this.operation = instruction;
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

var input = document.getElementById("myText").value;
var inputArray = input.split(" ");
var Instr1 = new Instruction(inputArray[0],inputArray.shift());
alert(Instr1.operation);

// Add some text to the new cells:
cell1.innerHTML = Instr1.operation;
cell2.innerHTML = "NEW CELL2";
cell3.innerHTML = "NEW CELL3";
cell4.innerHTML = "NEW CELL4";
cell5.innerHTML = "NEW CELL5";
}


