var forwardIFtoID = function(newStages){

	if (forwardStageAvailable["ID"] == 0){
		
		if (forwardStageAvailable["IF"] == 1){
			forwardStageAvailable["IF"] = 0
			forwardStageAvailable["ID"] = 1	
			newStages["ID"] = newStages["IF"];		
			newStages["IF"] = null;
		}
	}
	return newStages;					
}

var forwardtoIF = function(newStages, newInstruction){
	// if there are instructions waiting then:

	// if you can move into IF
	if (forwardStageAvailable["IF"] == 0){

		// is stuff waiting already?
		if (forwardpipelineQueue.length > 0){
			// put new instruction into pipeline	
			newStages["IF"] = forwardpipelineQueue[0];
			newStages["IF"].registers.forEach(function(reg){
				forwardRegChart[reg] = 1;
				
			});
		
			// then pop
			delete forwardpipelineQueue[0];
			forwardpipelineQueue.push(newInstruction);	

			forwardStageAvailable["IF"] = 1

		}
		// nope so move new instruction in
		else{
			// is there a new instruction?
			if (newInstruction != null){
				forwardStageAvailable["IF"] = 1;
			}
			newStages["IF"] = newInstruction;
		}
	}
	else{
		// if IF not available but instruction is waiting
		if (newInstruction.operation != ""){ forwardpipelineQueue.push(newInstruction); }
	}
	return newStages;	
}

var forwardIDtoEX = function(newStages){
	// move ID -> EX
	var ok = true;


	if (newStages["ID"] != null){ // not null

		newStages["ID"].sourceRegs.forEach(function(entry){
			if (forwardRegChart[entry] == 1){
				ok = false;
			}
		});
	}
	if (ok){
		
		newStages["EX"]	= newStages["ID"];
		newStages["ID"]	= null;
		forwardStageAvailable["EX"] = forwardStageAvailable["ID"];
		forwardStageAvailable["ID"] = 0;

		if (newStages["EX"] != null){ 
			forwardRegChart[newStages["EX"].destRegs] = 1;
		}

	}			

	// else not ok so stall
	return newStages;
}
var forwardEXtoMEM = function(newStages){

	// FORWARDING FOR BEQ, R-FORMATS
	if (newStages["EX"] != null && 
		(
			newStages["EX"].operation == "BEQ" || 
			$.inArray(newStages["EX"].operation, rInstructions) != -1
		)
	)	
	{
			forwardRegChart[newStages["EX"].destRegs] = 0;		
	}


	//  move from EX -> MEM
	if (forwardStageAvailable["MEM"] == 0){
		newStages["MEM"] = newStages["EX"];
		newStages["EX"] = null;

		forwardStageAvailable["MEM"] = forwardStageAvailable["EX"];
		forwardStageAvailable["EX"] = 0;
	}

	return newStages;
}
var forwardMEMtoWB = function(newStages){

	// HANDLING WB

	// make destination register now available
	if (newStages["WB"] != null){
		forwardRegChart[newStages["WB"].destRegs] = 0;
	}
	forwardStageAvailable["WB"] = 0;
	newStages["WB"] = null;


	// MEM -> WB

	if (newStages["MEM"] != null){
		
		if (newStages["MEM"].operation == "SW"){
			forwardRegChart[newStages["MEM"].destRegs] = 0;		
		} 

		// FORWARDING FOR LW
		if (newStages["MEM"].operation == "LW"){
			forwardRegChart[newStages["MEM"].destRegs] = 0;		
		}


		newStages["WB"] = newStages["MEM"];
		newStages["MEM"] = null;
		forwardStageAvailable["MEM"] = 0;
		forwardStageAvailable["WB"] = 1;
	
	}
	return newStages;
}