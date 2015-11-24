# PipeWeb
Web Application that will illustrate pipeline diagrams in either a pipelined or single-cycle MIPS processor

#parser (done)
parser for instructions
	this should be the first thing we work on
	basically it checks if an entered instruction is valid
		- if its not valid, then send alert or something to let user know (also dont put it into the pipeline)
		- i.e. LW $s1 $s2 $s3 is ok not but LW $s1, 8($s2) is ok
		- also we should make the registers comma delimited (or CLEARLY demonstrate examples with input, showing no commas)
		- support simple r-formats, beq (just two source reg's), lw and sw in its parsing

# stalls w/o forwarding
handle producer vs. consumer in the stalls
	-- so add $s1 $s2 $s2 is not stalled by LW $s1, but add $s1 $s2 $s2 is stalled by lw $s2 $s1 $s1
	-- this will also allow us to start working on forwarding 


# then do stalls with forwarding
1. hook up table to old methods
2. make new methods
3. hook these up to table
