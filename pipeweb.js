// 1 cycle has five instructions
var Pipeline = function(stages){
	this.IF = stages['IF'];
	this.ID = stages['ID'];
	this.EX = stages['EX'];
	this.MEM = stages['MEM'];
	this.WB = stages['WB'];
	this.queue = null;	
};

var rInstructions = ["ADD", "ADDU", "SUB", "SUBU", "OR", "AND", "XOR"];
// 0 is available, 1 is occupied
var RegChart = {
	"$t0": 0, "$t1": 0, "$t2": 0, "$t3": 0, "$t4": 0, "$t5": 0,
	"$t6": 0, "$t7": 0, "$t8": 0, "$t9": 0, "$s0": 0, "$s1": 0,
	"$s2": 0, "$s3": 0, "$s4": 0, "$s5": 0, "$s6": 0, "$s7": 0,"$s8": 0, "$s9": 0};

var validRFormat = function(op, regs){
	// check if operation is valid r-format operation
	if ($.inArray(op, rInstructions) == -1){
		return false;
	}
	if (regs.length != 3){
			var ok = false;
	}
	for (var i = 0; i < 3; i++){
		if (RegChart[regs[i]] === undefined){
			return false;
		}
	}
	return true;
}

var validBEQFormat = function(op, regs){
	// check if operation is valid r-format operation
	if (op != "BEQ"){
		return false;
	}
	if (regs.length != 2){
			return false;
	}
	for (var i = 0; i < 2; i++){
		if (RegChart[regs[i]] === undefined){
			return false;
		}
	}
	return true;
}

var setRFormat = function(op, regs){
	var OpAndRegs = {};
	OpAndRegs["valid"] = true;
		
	// put in source and dest regs
	OpAndRegs['sourceRegs'] = regs.slice(1);
	OpAndRegs['destRegs'] = regs[0];

	OpAndRegs["operation"] = op;
	return OpAndRegs;
}

var setBEQFormat = function(op, regs){
	var OpAndRegs = {};
	OpAndRegs["valid"] = true;
		
	// put in source and dest regs
	OpAndRegs['sourceRegs'] = regs.slice(0,1);
	OpAndRegs['destRegs'] = null;

	OpAndRegs["operation"] = op;
	return OpAndRegs;
}

var validDataFormat = function(op, regs){
	// check if operation is valid r-format operation
	if (op != "SW" && op != "LW"){
		return false;
	}
	if (regs.length != 2){
			return false;
	}

	// parse out offset as number and dest reg in parens
	var regExp = /\(([^)]+)\)/;
	var matches = regExp.exec(regs[1]);
	// change reg[1] from Num(x) to x
	regs[1] = matches[1];

	
	for (var i = 0; i < 2; i++){
		if (RegChart[regs[i]] === undefined){
			return false;
		}
	}
	return true	;
}

var setDataFormat = function(op, regs){
	var OpAndRegs = {};
	OpAndRegs["valid"] = true;
		
	// put in source and dest regs
	if (op == "LW"){
		OpAndRegs['sourceRegs'] = [regs[1]];
		OpAndRegs['destRegs'] = regs[0];	
	}
	else{
		OpAndRegs['sourceRegs'] = [regs[0]];
		OpAndRegs['destRegs'] = regs[1];	
	}

	OpAndRegs["operation"] = op;
	return OpAndRegs;
}

// given input, figure out operation, source and destination registers
var ParseInstructionString = function(str){
	// get operation and registers
	var OpAndRegs = {};
	var operation = str.substr(0,str.indexOf(' ')); 


	var regs = str.substr(str.indexOf(' '));
	regs = regs.replace(/ /gi,"");
	regs = regs.split(",")
	
	// check if operation is valid r-format operation
	if (validRFormat(operation, regs)){
		return setRFormat(operation,regs);
	}

	if (validBEQFormat(operation, regs)){
		return setBEQFormat(operation,regs);
	}
	if (validDataFormat(operation, regs)){
		return setDataFormat(operation, regs);
	}

	// if load or store then check if valid first

	OpAndRegs["valid"] = false;
	return OpAndRegs;
}

	
// 1 instruction  has:
// -- a format
// -- maybe dest reg
// -- source reg(s)
var Instruction = function(input){

	var newInstruction = ParseInstructionString(input);

		// note the three equal signs so that null won't be equal to undefined
	if( newInstruction["valid"] == false ) {
	    return newInstruction;
	}
	else{
		this.operation = newInstruction['format'];
		this.sourceReg = newInstruction['sourceRegs'];
		this.destReg = newInstruction['destRegs'];
		return newInstruction;
	}	
};

// for list of dependencies
var DataDependency =function(reg, stage){
	this.reg = reg;
	this.stage = stage;
}


// 0 is available 1 is occupied
var StageAvailable = { "IF":0, "ID":0, "EX":0, "MEM":0, "WB":0}

// have this include more instructions
var InstructionMap = {"ADD": 'R', "LW": 'load', "SW": "Store"};


// each instruction has registers available in mem or wb, depending on their format
var FormatDetailMap = { "ARITHMETIC":"wb", "load":"wb","Store":"mem"};

var IFtoID = function(newStages){

	if (StageAvailable["ID"] == 0){
		
		if (StageAvailable["IF"] == 1){
			StageAvailable["IF"] = 0
			StageAvailable["ID"] = 1	
			newStages["ID"] = newStages["IF"];		
			newStages["IF"] = null;
		}
	}
	return newStages;					
}


var toIF = function(newStages, newInstruction){
	// if there are instructions waiting then:

	// if you can move into IF
	if (StageAvailable["IF"] == 0){

		// is stuff waiting already?
		if (pipelineQueue.length > 0){
			// put new instruction into pipeline	
			newStages["IF"] = pipelineQueue[0];
			newStages["IF"].registers.forEach(function(reg){
				RegChart[reg] = 1;
				
			});
		
			// then pop
			delete pipelineQueue[0];
			pipelineQueue.push(newInstruction);	

			StageAvailable["IF"] = 1

		}
		// nope so move new instruction in
		else{
			// is there a new instruction?
			if (newInstruction != null){
				StageAvailable["IF"] = 1;
			}
			newStages["IF"] = newInstruction;
		}
	}
	else{
		// if IF not available but instruction is waiting
		if (newInstruction.operation != ""){ pipelineQueue.push(newInstruction); }
	}
	return newStages;	
}


// check if load in ex or mem
var loadFormatStall = function(newStages){
	
	if (
		(newStages["EX"] != null && newStages["EX"].operation == "LW") ||
		(newStages["MEM"] != null && newStages["MEM"].operation == "LW") ||
		(newStages["WB"] != null && newStages["WB"].operation == "LW")
	){
		return true;
	}
		
	return false;
}

// check if load in ex or mem
var storeFormatStall = function(newStages){
	if (newStages["MEM"] != null && newStages["MEM"].operation == "SW"){
		return true;
	}
	return false;
}


// check if load in ex or mem
var coldStartOrEmpty = function(newStages){
	if (newStages["EX"] == null && newStages["MEM"] == null && newStages["WB"] == null){
		return true;
	}
	return false;
}


var IDtoEX = function(newStages){
	// move ID -> EX
	var ok = true;


	if (newStages["ID"] != null){ // not null

		newStages["ID"].sourceRegs.forEach(function(entry){
			if (RegChart[entry] == 1){
				ok = false;
			}
		});
	}
	if (ok){
		
		newStages["EX"]	= newStages["ID"];
		newStages["ID"]	= null;
		StageAvailable["EX"] = StageAvailable["ID"];
		StageAvailable["ID"] = 0;

		if (newStages["EX"] != null){ 
			RegChart[newStages["EX"].destRegs] = 1;
		}

	}			

	// else not ok so stall
	return newStages;
}

var EXtoMEM = function(newStages){

	//  move from EX -> MEM
	if (StageAvailable["MEM"] == 0){
		newStages["MEM"] = newStages["EX"];
		newStages["EX"] = null;

		StageAvailable["MEM"] = StageAvailable["EX"];
		StageAvailable["EX"] = 0;
	}

	return newStages;
}


var MEMtoWB = function(newStages, stages){

	// HANDLING WB

	// make destination register now available
	if (newStages["WB"] != null){
		RegChart[newStages["WB"].destRegs] = 0;
	}
	StageAvailable["WB"] = 0;
	newStages["WB"] = null;


	// MEM -> WB

	if (newStages["MEM"] != null){
		
		if (newStages["MEM"].operation == "SW"){
			RegChart[newStages["WB"].destReg] = 0;		
		} 


		newStages["WB"] = newStages["MEM"];
		newStages["MEM"] = null;
		StageAvailable["MEM"] = 0;
		StageAvailable["WB"] = 1;
	
	}
	return newStages;

}

function calculateNewCycle(newInstruction ){

		// collection of new stages
		var newStages = stages;


		
		newStages = MEMtoWB(newStages, stages);

		
		newStages = EXtoMEM(newStages);
		
		// move ID -> EX
		newStages =  IDtoEX(newStages);

		// moving from IF to ID
		newStages = IFtoID(newStages);

		newStages = toIF(newStages, newInstruction);	
	

		return new Pipeline(newStages);

}


function myCreateFunction() {
	$(document).ready(function () {


		var inputString = document.getElementById("myText").value;
		var Instr1 = new Instruction(inputString);
		if (Instr1.valid == true){
			cycleCounter  +=1;
		    table = document.getElementById("myTable");	
		    row = table.insertRow(-1);
		    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var cell0 = row.insertCell(0);
			var cell1 = row.insertCell(1);
			var cell2 = row.insertCell(2);
			var cell3 = row.insertCell(3);
			var cell4 = row.insertCell(4);
			var cell5 = row.insertCell(5);

			var pipe = calculateNewCycle(Instr1);

			// Add some text to the new cells:
			cell0.innerHTML = cycleCounter;
			cell1.innerHTML =  null != pipe.IF ? pipe.IF.operation:"";
			cell2.innerHTML =  null != pipe.ID ? pipe.ID.operation:"";
			cell3.innerHTML =  null != pipe.EX ? pipe.EX.operation:"";
			cell4.innerHTML =  null != pipe.MEM? pipe.MEM.operation:"";
			cell5.innerHTML =  null != pipe.WB ? pipe.WB.operation:"";
		}
		else{
			alert(inputString + " is not an accepted instruction \n :(")
		}
	});
}


function EmptyInputCreateFunction() {
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

		var input = "";

		cycleCounter  +=1;
		var inputArray = input.split(" ");
		var op = inputArray[0]
		inputArray.shift()
		var Instr1 = "";

		var pipe = calculateNewCycle(null);

		// Add some text to the new cells:
		cell0.innerHTML = cycleCounter;
		cell1.innerHTML =  null != pipe.IF ? pipe.IF.operation:"";
		cell2.innerHTML =  null != pipe.ID ? pipe.ID.operation:"";
		cell3.innerHTML =  null != pipe.EX ? pipe.EX.operation:"";
		cell4.innerHTML =  null != pipe.MEM? pipe.MEM.operation:"";
		cell5.innerHTML =  null != pipe.WB ? pipe.WB.operation:"";

	});
}

