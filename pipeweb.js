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
var InstructionMap = {"ADD": 'R', "LW": 'Load', "SW": "Store"};


// each instruction has registers available in mem or wb, depending on their format
var FormatDetailMap = { "ARITHMETIC":"wb", "load":"wb","Store":"mem"};

function calculateNewCycle(newInstruction ){

		// collection of new stages
		var newStages = stages;


		// HANDLING WB
		// make each register now available
		if (newStages["WB"] != null){
			newStages["WB"].registers.forEach(function(reg){
				RegChart[reg] = 0;
			});
		}
		
		//HANDLING MEM -> WB
		// wb never stalls, so mem never stalls :)

		// update stage table
		StageAvailable["WB"] = StageAvailable["MEM"];
		 

		

		// if store format now in wb, then update destination register in reg table
		if (newStages["MEM"] != null){
			if (InstructionMap[newStages["MEM"].format] == 'mem'){
				newStages["MEM"].registers.forEach(function(reg){
				RegChart[reg] = 0;
			});
			}
		}

		newStages["WB"] = stages["MEM"]; 


		// check if:
		//		the registers in EX are available		
		var okToMove = true;
		if (newStages["EX"] != null){
			stages["EX"].registers.forEach(function(reg){
				if (RegChart[reg] == 1){
					okToMove = false;
					alert("stall!");
				}
			});
			//		EX as a stage is available
			if (StageAvailable["MEM"] == 1){
				okToMove = false;
				alert("stall!");
			}
		}
		
		// is mem available? if not stay in EX


		//  move from EX -> MEM
		if (okToMove == true){
			newStages["MEM"] = stages["EX"];
			// 	so now we update stage table
			StageAvailable["MEM"] = StageAvailable["EX"];
		}

		if (newStages["ID"] != null){
			// check if:
			// 		registers are avaible
			stages["ID"].registers.forEach(function(reg){
				if (RegChart[reg] == 1){
					okToMove = false;
					alert("stall!");
				}
			});
			//		EX is avilable
			if (StageAvailable["EX"] == 1){
				okToMove = false;
				alert("stall!");
			}
		}
		
		

		// move ID -> EX
		if (okToMove){
			//		update stage table
			StageAvailable["EX"] = StageAvailable["ID"];
			newStages["EX"] = stages["ID"];
		}


		// moving from IF to ID

			if (newStages["IF"] != null){
				// newStages["IF"].registers.forEach(function(reg){
				// 	if (RegChart[reg] == 1){
				// 		okToMove = false;
				// 	}
				// });
				if (StageAvailable["ID"] == 1){
					okToMove = false;
					alert("stall!");
				}
				// if (StageAvailable["IF"] == 1){
				// 	okToMove = false;
				// }
			}
			if (okToMove == true){
				newStages["ID"] = stages["IF"];	
				if (StageAvailable["IF"] == 1 && StageAvailable["ID"] == 0){
					StageAvailable["IF"] = 0
					StageAvailable["ID"] = 1	
				}
				
			}

		
		// if there are instructions waiting then:
		if (pipelineQueue.length > 0){
			// put new instruction into pipeline	
			newStages["IF"] = pipelineQueue[0];
			stages["IF"].registers.forEach(function(reg){
				RegChart[reg] = 1;
				
			});
		
			// then pop
			delete pipelineQueue[0];
			pipelineQueue.push(newInstruction);	
		}
		else{
			newStages["IF"] = newInstruction;
			stages["IF"].registers.forEach(function(reg){
				RegChart[reg] = 1;
				
			});	
		}
		
		StageAvailable["IF"] = 1
		

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



