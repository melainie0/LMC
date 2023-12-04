export const step = (memory, inIp, registers, output, wasWaitingForInput, input) => {
	registers.pc = inIp;
	const memValue = memory[registers.pc++];

	const strMemValue = memValue.toString().padStart(3, '0')
	const instruction = parseInt(strMemValue[0])
	const data = parseInt(strMemValue[1]) * 10 + parseInt(strMemValue[2])

	registers.ir = instruction;
	registers.ar = data;

	let halt = false;
	let waitingForInput = false;

	if(wasWaitingForInput && input) {
		registers.ac = parseInt(input)
	}

	switch(instruction) {
		// HLT
		case 0:
			halt = true;
			break;
		// ADD
		case 1:
			registers.ac = registers.ac + memory[data];
			break;
		// SUB
		case 2:
			registers.ac = registers.ac - memory[data];
			break;
		// STA
		case 3:
			memory[data] = registers.ac;
			break;
		// LOA
		case 4: {
			const offset = registers.ac;
			const location = data + offset >= 100 ? 99 : data + offset;

			registers.ac = memory[location];
			break;
		}
		// LDA
		case 5:
			registers.ac = memory[data];
			break;
		// BRA
		case 6:
			registers.pc = data;
			break;
		// BRZ
		case 7:
			if(registers.ac === 0)
				registers.pc = data;
			break;
		// BRP
		case 8:
			if(registers.ac >= 0)
				registers.pc = data;
			break;
		// INP / OUT
		case 9:
			if(data === 1) {
				waitingForInput = true;
			}
			else if(data === 2) {
				output += registers.ac + " ";
			}
			else if(data === 12) {
				output += String.fromCharCode(registers.ac);
			}
			break;
		default:
			// NOP
			break;
	}

	return {
		memory,
		ip: registers.pc,
		registers,
		output,
		halt,
		waitingForInput
	}
}