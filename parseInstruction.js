var rInstructions = ["ADD", "ADDU", "SUB", "SUBU", "OR", "AND", "XOR", "NOR", "SLT", "SLTU"];
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
	if (regs.length != 3){
			return false;
	}
	for (var i = 0; i < 2; i++){
		if (RegChart[regs[i]] === undefined){
			return false;
		}
	}
	// check if label 
	if (RegChart[regs[2]] != undefined){
		return false;
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