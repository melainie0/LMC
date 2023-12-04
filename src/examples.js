export const examples = {
	"Addition": [
		"// Input two numbers, sum them, and output the result",
		"        INP",
		"        STA FIRST",
		"        INP",
		"        ADD FIRST",
		"        OUT",
		"        HLT",
		"FIRST   DAT 0",
	].join("\n"),
	"Max": [
		"// Implements max(a, b) -> returns the higher value of the two.",
		"        INP",
		"        STA FIRST",
		"        INP",
		"        STA SECOND",
		"// Subtract second - first, and if positive second must be greater",
		"        SUB FIRST",
		"        BRP GREATER",
		"// Otherwise, output first and skip over printing second",
		"        LDA FIRST",
		"        OUT",
		"        BRA END",
		"",
		"// Output second",
		"GREATER LDA SECOND",
		"        OUT",
		"",
		"END     HLT",
		"",
		"// Variables",
		"FIRST   DAT 0",
		"SECOND  DAT 0",
	].join("\n"),
	"Multiply": [
		"// Multiplies two numbers, val1 and val2, together",
		"",
		"// Take in two inputs",
		"        INP",
		"        STA VAL1",
		"        INP",
		"        STA VAL2",
		"",
		"// If val2 is 0, branch to the end",
		"LOOP    BRZ END",
		"// Add val1 to product and store back in product",
		"        LDA PRODUCT",
		"        ADD VAL1",
		"        STA PRODUCT",
		"// decrement val2 by one",
		"        LDA VAL2",
		"        SUB ONE",
		"        STA VAL2",
		"// Loop back to the top of the loop",
		"        BRA LOOP",
		"",
		"// When the loop is finished, output the product",
		"END     LDA PRODUCT",
		"        OUT",
		"        HLT",
		"",
		"// Variables",
		"VAL1    DAT 0",
		"VAL2    DAT 0",
		"PRODUCT DAT 0",
		"",
		"// Constant 1",
		"ONE     DAT 1",
	].join("\n"),
	"Divide": [
		"// Input two values",
		"      INP",
		"      STA VAL1",
		"      INP",
		"      STA VAL2",
		"      ",
		"// Loop, subtracting the val2 and counting iterations",
		"",
		"LOOP  LDA VAL1",
		"      SUB VAL2",
		"// Stop looping when the subtraction result is negative",
		"      BRP BODY",
		"      BRA DONE",
		"",
		"BODY  STA VAL1",
		"      LDA COUNT",
		"      ADD ONE",
		"      STA COUNT",
		"      BRA LOOP",
		"",
		"// After looping, print the count and the remainder (left in val1)",
		"DONE  LDA COUNT",
		"      OUT",
		"      LDA VAL1",
		"      BRZ END",
		"      OUT",
		"END   HLT",
		"",
		"// Variables",
		"VAL1  DAT 0",
		"VAL2  DAT 0",
		"COUNT DAT 0",
		"// Constant 1",
		"ONE   DAT 1",
	].join("\n"),
	"ASCII": [
		"// Loop through and print all printable ASCII characters",
		"// Similar to 0..N example, but from 33..127",
		"",
		"// Compare FPRINT and LPRINT, branch to end if FPRINT is greater or equal",
		"TOP     LDA FPRINT",
		"        SUB LPRINT",
		"        BRP END",
		"",
		"// Print character from ASCII code",
		"        LDA FPRINT",
		"        OTC",
		"// Increment FPRINT and loop",
		"        ADD ONE",
		"        STA FPRINT",
		"        BRA TOP",
		"",
		"END     HLT",
		"",
		"// Variable FPRINT counts starting from 33",
		"FPRINT  DAT 33",
		"// Constant LPRINT is the last printable character + 1",
		"LPRINT  DAT 127",
		"// Constant 1",
		"ONE     DAT 1",
	].join("\n"),
	"Hello World": [
		"// Prints the string \"Hello, World!\" to the output",
		"// Loop, checking if the OFFSET is less than LENGTH",
		"BEGIN   LDA LENGTH",
		"        SUB OFFSET",
		"        BRZ END",
		"        BRP PRINT",
		"        BRA END",
		"",
		"// Offset from START by OFFSET to extract the character",
		"// The same as START[OFFSET] in high-level languages",
		"PRINT   LDA OFFSET",
		"// LOA = Load Offset To Accumulator",
		"        LOA START",
		"// OTC = Output accumulator as character (e.g. 65 -> A)",
		"        OTC",
		"        LDA OFFSET",
		"        ADD ONE",
		"        STA OFFSET",
		"        BRA BEGIN",
		"",
		"END     HLT",
		"",
		"// Variable",
		"OFFSET  DAT 0",
		"// Constant: Encode \"Hello, World!\" as character codes, one byte after the other",
		"START   DAT 72",
		"        DAT 101",
		"        DAT 108",
		"        DAT 108",
		"        DAT 111",
		"        DAT 44",
		"        DAT 32",
		"        DAT 87",
		"        DAT 111",
		"        DAT 114",
		"        DAT 108",
		"        DAT 100",
		"        DAT 33",
		"// Constant length of the string",
		"LENGTH  DAT 13",
		"// Constant 1",
		"ONE     DAT 1",
	].join("\n")
}