// Returns the memory array

const INSTRUCTIONS = ["LDA", "STA", "LOA", "ADD", "SUB", "INP", "OUT", "OTC", "HLT", "BRZ", "BRP", "BRA", "DAT"];
const UNARY_INSTRUCTIONS = ["INP", "OUT", "OTC", "HLT"];

const UNARY_INSTRUCTION_CODE_MAP = {
	"INP": 901,
	"OUT": 902,
	"OTC": 912,
	"HLT": 0
}

const BINARY_INSTRUCTION_FIRST_VALUE = {
	"LDA": "5",
	"STA": "3",
	"LOA": "4",
	"ADD": "1",
	"SUB": "2",
	"BRZ": "7",
	"BRP": "8",
	"BRA": "6",
	"DAT": ""
}

const toToken = (word, line) => {
	if(!isNaN(word) && parseInt(word) === parseFloat(word)) {
		return {
			type: "int",
			value: parseInt(word),
			line
		}
	}
	else if(INSTRUCTIONS.includes(word)) {
		return {
			type: "instruction",
			value: word,
			line
		}
	}
	else if(word.match(/^[A-Z][A-Z0-9]*$/)) {
		return {
			type: "label",
			value: word,
			line
		}
	}
	else {
		return {
			type: "invalid",
			value: word,
			line
		}
	}
}

export const assemble = (source) => {
	const memory = new Array(100).fill(0);

	const rawLines = source.split(/\r?\n/).filter(v => v.length !== 0);

	let lines = rawLines.map((l, i) => l.replace(/\/\/.*?$/, "").split(/\s+/).filter(v => v.length !== 0).map(w => toToken(w.toUpperCase(), i + 1)))
				.filter(l => l.length !== 0);

	const labels = {}
	let ip = 0;
	for(let i = 0; i < lines.length; i++) {
		let line = lines[i];

		if(line[0].type === "label") {
			labels[line[0].value] = ip;
			lines[i] = line = line.slice(1)
		}
		ip += line.filter(w => w.type === "instruction").length;
	}
	lines = lines.filter(l => l.length !== 0)

	const words = lines.flat();

	for(let word of words) {
		if(word.type === "invalid")
			return {
				memory: new Array(100).fill(0),
				error: `Unexpected token ${word.value}`,
				errorLoc: word
			}
	}

	let memoryAddress = 0;
	for(let i = 0; i < words.length; i++) {
		const word = words[i];

		if(word.type === "instruction") {
			const instruction = word.value;

			if(UNARY_INSTRUCTIONS.includes(instruction)) {
				memory[memoryAddress] = UNARY_INSTRUCTION_CODE_MAP[instruction];
				memoryAddress++;
			}
			else {
				const opcode = BINARY_INSTRUCTION_FIRST_VALUE[instruction];

				const operand = words[i + 1];

				let form = opcode;

				if(operand.type === "int") {
					if(instruction === "DAT")
						form = operand.value.toString()
					else
						form += operand.value.toString().padStart(2, '0')
				}
				else if(operand.type === "label") {
					if(!(operand.value in labels)) {
						return {
							memory: new Array(100).fill(0),
							error: `Label ${operand.value} is not bound`,
							errorLoc: word
						}
					}

					if(instruction === "DAT")
						form = labels[operand.value].toString()
					else
						form += labels[operand.value].toString().padStart(2, '0');
				}
				else {
					return {
						memory: new Array(100).fill(0),
						error: `Expected value, got ${operand.value}`,
						errorLoc: word
					}
				}

				if(form.length > 3) {
					return {
						memory: new Array(100).fill(0),
						error: `Values cannot exceed 3 digits (got ${form})`,
						errorLoc: word
					}
				}
				memory[memoryAddress] = parseInt(form)
				memoryAddress++;
				i++;
			}
		}
		else {
			return {
				memory: new Array(100).fill(0),
				error: `Expected instruction, got ${word.value}`,
				errorLoc: word
			}
		}
		if(memoryAddress > 99) {
			return {
				memory: new Array(100).fill(0),
				error: `Exceeded memory capacity of 100 @ ${word.value}`,
				errorLoc: word
			}
		}
	}

	return {
		memory,
		error: null,
		errorLoc: null
	};
}