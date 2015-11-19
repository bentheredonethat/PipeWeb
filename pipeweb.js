// structure of objects



// 1 cycle has:
// --up to to five instructions
// --possibly some dependencies
var Pipeline = function(stages){
	this.IF = stages['IF'];
	this.ID = stages['ID'];
	this.EX = stages['EX'];
	this.MEM = stages['MEM'];
	this.WB = stages['WB'];
	this.queue = null;	
};

// 1 instruction  has:
// -- a format
// -- some registers associated with fields (rs, rt, etc.)
// -- register type -s arithmetic/load/store etc. 
var Instruction = function(format, registers){
	this.operation = format;
	this.registers= registers;
};

// for list of dependencies
var DataDependency =function(reg, stage){
	this.reg = reg;
	this.stage = stage;
}

var InstrFormatMap = {

};


function calculateNewDependencies(newInstruction, oldDependencies){
// check if any of the registers in the new instruction
// are nearby in old dependencies

var newDependencies = [];


// list of booleans for each potentially new register
// to put in dependencies list
var potentialNewDependencies = [];
newInstruction.registers.forEach(function(current){
	potentialNewDependencies.push(0);
});

// check if any registers in new Instr. are in oldDep, so as not to add them



return newDependencies;
}

// 0 is available 1 is occupied
var StageAvailable = { "IF":0, "ID":0, "EX":0, "MEM":0, "WB":0}

// 0 is available, 1 is occupied
var RegChart = {
	"$t0": 0, "$t1": 0, "$t2": 0, "$t3": 0, "$t4": 0, "$t5": 0,
	"$t6": 0, "$t7": 0, "$t8": 0, "$t9": 0, "$s0": 0, "$s1": 0,
	"$s2": 0, "$s3": 0, "$s4": 0, "$s5": 0, "$s6": 0, "$s7": 0,"$s8": 0, "$s9": 0};

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
			if (newInstruction.operation != ""){
				newStages["IF"] = newInstruction;
				StageAvailable["IF"] = 1;
			}
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

	if (
		coldStartOrEmpty(newStages) ||
		(storeFormatStall(newStages) == false && loadFormatStall(newStages) == false)
	){
		newStages["EX"]	= newStages["ID"];
		newStages["ID"]	= null;
		StageAvailable["EX"] = StageAvailable["ID"];
		StageAvailable["ID"] = 0;
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

	// make each register now available
	if (newStages["WB"] != null){
		newStages["WB"].registers.forEach(function(reg){
			RegChart[reg] = 0;
		});	
	}
	StageAvailable["WB"] = 0;
	newStages["WB"] = null;


	// MEM -> WB

	if (newStages["MEM"] != null){
		
		if (newStages["MEM"].operation == "SW"){
			newStages["MEM"].registers.forEach(function(reg){
			RegChart[reg] = 0;
		});			
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
		var op = inputArray[0]
		inputArray.shift()
		var Instr1 = new Instruction(op,inputArray);

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



