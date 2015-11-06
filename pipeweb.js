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

// for list of dependencies
var DataDependency =function(reg, stage){
	this.reg = reg;
	this.stage = stage;
}

function calculateNewDependencies(newInstruction, oldDependencies){
// check if any of the registers in the new instruction
// are nearby in old dependencies


// list of booleans for each potentially new register
// to put in dependencies list
var potentialNewDependencies = [];
newInstruction.registers.forEach(function(current){
	potentialNewDependencies.push(0);
});

// check if any registers in new Instr. are in oldDep, so as not to add them


}

function calculateNewCycle(newInstruction, oldDependencies ){

		// collection of new stages
		var newStage = stages;

		// TO DO update stages according to dependencies from last cycle

		// move stages
		newStage["WB"] = stages["MEM"];
		newStage["MEM"] = stages["EX"];
		newStage["EX"] = stages["ID"];
		newStage["ID"] = stages["IF"];
		newStage["IF"] = newInstruction;

		// update dependencies
		var newDependencies = oldDependencies;
		// TO DO update new dependencies from old dependencies

		return new Pipeline(newStage, newDependencies);

}


function myCreateFunction() {
	$(document).ready(function () {
	    table = document.getElementById("myTable");
	    row = table.insertRow(-1);
	    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);

		var input = document.getElementById("myText").value;

		cycleCounter  +=1;
		var inputArray = input.split(" ");
		var Instr1 = new Instruction(inputArray[0],inputArray.shift(), "pre", cycleCounter);

		var pipe = calculateNewCycle(Instr1, dependencies);

		// Add some text to the new cells:
		cell0.innerHTML = cycleCounter;
		cell1.innerHTML =  null != pipe.IF ? pipe.IF.operation:"";
		cell2.innerHTML =  null != pipe.ID ? pipe.ID.operation:"";
		cell3.innerHTML =  null != pipe.EX ? pipe.EX.operation:"";
		cell4.innerHTML =  null != pipe.MEM? pipe.MEM.operation:"";
		cell5.innerHTML =  null != pipe.WB ? pipe.WB.operation:"";

	});


}



