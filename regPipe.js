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
		if (newInstruction != null){ pipelineQueue.push(newInstruction); }
	}
	return newStages;	
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
var MEMtoWB = function(newStages){

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
			RegChart[newStages["MEM"].destRegs] = 0;		
		} 


		newStages["WB"] = newStages["MEM"];
		newStages["MEM"] = null;
		StageAvailable["MEM"] = 0;
		StageAvailable["WB"] = 1;
	
	}
	return newStages;
}