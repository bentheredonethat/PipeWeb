// structure of objects

// 1 cycle has:
// --up to to five instructions
// --possibly some dependencies
var Pipeline = function(stages, dependencies){
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
var Instruction = function(instruction, registers, stage, num){
	this.num = num;
	this.registers= registers;
	this.operation = instruction;
	this.stage = stage;
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

var cycleCounter = 1;
var inputArray = input.split(" ");
var Instr1 = new Instruction(inputArray[0],inputArray.shift(), "pre", cycleCounter);

// collection of stages
var stages= {
	"IF" : Instr1,
	"ID": null,
	"EX": null,
	"MEM": null,
	"WB": null	
};

// var dependencies
var dependencies = null;

// start cycle
var pipe = new Pipeline(stages, dependencies,cycleCounter);

var KeepGoing = 0;
$.each(stages, function(index, value){
	if (typeof value != null){
		alert(value);
		KeepGoing = 1;
	}
});

// Add some text to the new cells:
cell1.innerHTML =  null != pipe.IF ? pipe.IF.operation:"";
cell2.innerHTML =  null != pipe.ID ? pipe.ID.operation:"";
cell3.innerHTML =  null != pipe.EX ? pipe.EX.operation:"";
cell4.innerHTML =  null != pipe.MEM? pipe.MEM.operation:"";
cell5.innerHTML =  null != pipe.WB ? pipe.WB.operation:"";

// move each stage
stages["WB"] = stages["MEM"];
stages["MEM"] = stages["EX"];
stages["EX"] = stages["ID"];
stages["ID"] = stages["IF"];
stages["ID"] = null;


}



