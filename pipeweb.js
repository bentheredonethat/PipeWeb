// 1 cycle has five instructions
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


// 0 is available 1 is occupied
var StageAvailable = { "IF":0, "ID":0, "EX":0, "MEM":0, "WB":0};

var forwardStageAvailable = { "IF":0, "ID":0, "EX":0, "MEM":0, "WB":0};

// have this include more instructions
var InstructionMap = {"ADD": 'R', "LW": 'load', "SW": "Store"};


// each instruction has registers available in mem or wb, depending on their format
var FormatDetailMap = { "ARITHMETIC":"wb", "load":"wb","Store":"mem"};



function calculateNewCycle(newInstruction ){

		// collection of new stages
		var newStages = stages;

		newStages = MEMtoWB(newStages, stages);		
		newStages = EXtoMEM(newStages);
		newStages =  IDtoEX(newStages);// move ID -> EX
		newStages = IFtoID(newStages);// moving from IF to ID
		newStages = toIF(newStages, newInstruction);	
	
		return new Pipeline(newStages);
}

function forwardcalculateNewCycle(newInstruction ){

		// collection of new stages
		var newStages = forwardstages;

		newStages = forwardMEMtoWB(newStages);		
		newStages = forwardEXtoMEM(newStages);
		newStages = forwardIDtoEX(newStages);// move ID -> EX
		newStages = forwardIFtoID(newStages);// moving from IF to ID
		newStages = forwardtoIF(newStages, newInstruction);	
	
		return new Pipeline(newStages);
}


function myCreateFunction(NOP) {
	$(document).ready(function () {
		var pipe;
		var forwardpipe;
		// If NOP is true, populate with NULL instruction
		if (NOP){
			pipe = calculateNewCycle(null);
			forwardpipe = forwardcalculateNewCycle(null);
		}
		// If there is user input, check if valid. 
		else
		{
			var inputString = document.getElementById("myText").value;
			var Instr1 = new Instruction(inputString);
			if (Instr1.valid == true){
				pipe = calculateNewCycle(Instr1);
				forwardpipe = forwardcalculateNewCycle(Instr1);
			}
			else{
				alert(inputString + " is not an accepted instruction \n :(")
			}
		}
		// Generate new table rows.
		cycleCounter  +=1;
	    var table = document.getElementById("myTable");	
	    var Forwardtable = document.getElementById("myForwardTable");	
	    PopulateTheTable(table,			cycleCounter, pipe);
	    PopulateTheTable(Forwardtable, 	cycleCounter, forwardpipe);
	
	});
}

// 
function PopulateTheTable(MyTable, cycleCounter, pipe) {
	 var row = MyTable.insertRow(-1);
	    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
		var cell2 = row.insertCell(2);
		var cell3 = row.insertCell(3);
		var cell4 = row.insertCell(4);
		var cell5 = row.insertCell(5);

		//var pipe = calculateNewCycle(Instr1);

		// Add some text to the new cells:
		cell0.innerHTML = cycleCounter;
		cell1.innerHTML =  null != pipe.IF ? pipe.IF.operation:"";
		cell2.innerHTML =  null != pipe.ID ? pipe.ID.operation:"";
		cell3.innerHTML =  null != pipe.EX ? pipe.EX.operation:"";
		cell4.innerHTML =  null != pipe.MEM? pipe.MEM.operation:"";
		cell5.innerHTML =  null != pipe.WB ? pipe.WB.operation:"";
}