import './App.css';

import Editor from "@monaco-editor/react";
import { useRef, useState } from 'react';
import { assemble } from './assembler';
import { step } from './emulator';
import { languageDef, configuration } from './editor-config'
import { examples } from './examples';
import Description from './Description';

const defaultString = [
	"// Input two numbers, sum them, and output the result",
	"        INP",
	"        STA FIRST",
	"        INP",
	"        ADD FIRST",
	"        OUT",
	"        HLT",
	"FIRST   DAT 0"
].join("\n");

const editorWillMount = monaco => {
	if (!monaco.languages.getLanguages().some(({ id }) => id === 'lmc')) {
		// Register a new language
		monaco.languages.register({ id: 'lmc' })
		// Register a tokens provider for the language
		monaco.languages.setMonarchTokensProvider('lmc', languageDef)
		// Set the editing configuration for the language
		monaco.languages.setLanguageConfiguration('lmc', configuration)
	}
}

function App() {

	const editorRef = useRef(null);

	const [memory, setMemory] = useState(Array(100).fill(0));
	const [currentIp, setCurrentIp] = useState(0)
	const [registers, setRegisters] = useState({
		"pc": 0,
		"ir": 0,
		"ar": 0,
		"ac": 0
	})
	const [output, setOutput] = useState("")
	const [error, setError] = useState("")
	const [input, setInput] = useState("")
	const [waitingForInput, setWaitingForInput] = useState(false)
	const [isHalted, setHalted] = useState(false)
	const [changedMemoryAddresses, setChangedMemoryAddresses] = useState([])
	const [isAccumulatorChanged, setAccumulatorChanged] = useState(false)
	const [inputSpeed, setInputSpeed] = useState("60")
	const [speed, setSpeed] = useState(60)
	const submitRef = useRef(null)
	const loopRef = useRef(null)

	const handleEditorDidMount = (editor, _monaco) => {
		editorRef.current = editor;
	}

	const getColourBorder = (condition, subcondition) => {
		if (condition) {
			if (subcondition) {
				return "red-border";
			}
			return "green-border";
		}
		return "";
	}

	const onInputChanged = (event) => {
		setInput(event.target.value)
	}

	const onInputSubmitted = (event) => {
		submitRef.current = input.charAt(0) === '-' ? input.substring(0, 4) : input.substring(0, 3)
		setInput("")
		event.preventDefault()
	}

	const onSpeedChanged = (event) => {
		setInputSpeed(event.target.value)
	}

	const onSpeedSubmitted = (event) => {
		let speed = parseInt(inputSpeed) || 60
		if(speed <= 0) {
			speed = 60
		}
		setSpeed(speed)
		event.preventDefault()
	}

	const selectedExampleChanged = (event) => {
		editorRef.current.setValue(examples[event.target.value])
	}

	const assembleCode = () => {
		const assembleResult = assemble(editorRef.current.getValue())

		if(!assembleResult.error) {
			setMemory(assembleResult.memory)
			setError("")
		}
		else {
			setError(`[${assembleResult.errorLoc.line}]: ${assembleResult.error}`)
		}
	}

	const runCode = () => {
		if(error !== "") return;
		let localMem = memory;
		let ip = 0;
		let localReg = {
			"pc": 0,
			"ir": 0,
			"ar": 0,
			"ac": 0
		};
		let halt = false;
		let out = ""

		let waiting = false
		loopRef.current = setInterval(() => {
			if (waiting && !submitRef.current)
				return;

			const memoryBefore = [...localMem];
			const accumulatorBefore = localReg["ac"];

			({ memory: localMem, ip, registers: localReg, halt, output: out, waitingForInput: waiting } = step(localMem, ip, localReg, out, waiting, submitRef.current))
			if (submitRef.current)
				submitRef.current = null

			if (halt || ip >= 100) {
				clearInterval(loopRef.current)
				loopRef.current = null
			}

			if (ip >= 100) ip = 99;
			setCurrentIp(ip)
			setRegisters(localReg)
			setMemory(localMem)
			setOutput(out)
			setWaitingForInput(waiting)
			setHalted(halt)

			let changedMem = []
			for(let i = 0; i < localMem.length; i++) {
				if(memoryBefore[i] !== localMem[i]) {
					changedMem.push(i)
				}
			}
			setChangedMemoryAddresses(changedMem)
			setAccumulatorChanged(accumulatorBefore !== localReg["ac"])
		}, 1000 / speed)
	}

	const stopCode = () => {
		clearInterval(loopRef.current)
	}

	const stepCode = () => {
		if(error !== "") return;
		clearInterval(loopRef.current)

		if (waitingForInput && !submitRef.current)
			return;
		if (isHalted || currentIp >= 100)
			return;

		let localMem = memory;
		let ip = currentIp;
		let localReg = registers;
		let halt = isHalted;
		let out = ""

		let waiting = waitingForInput;

		const memoryBefore = [...localMem];
		const accumulatorBefore = localReg["ac"];

		({ memory: localMem, ip, registers: localReg, halt, output: out, waitingForInput: waiting } = step(localMem, ip, localReg, out, waiting, submitRef.current))
		if (submitRef.current)
			submitRef.current = null

		if (halt || ip >= 100) {
			clearInterval(loopRef.current)
			loopRef.current = null
		}

		if (ip >= 100) ip = 99;
		setCurrentIp(ip)
		setRegisters(localReg)
		setMemory(localMem)
		setOutput(out)
		setWaitingForInput(waiting)
		setHalted(halt)
		
		let changedMem = []
		for(let i = 0; i < localMem.length; i++) {
			if(memoryBefore[i] !== localMem[i]) {
				changedMem.push(i)
			}
		}
		setChangedMemoryAddresses(changedMem)
		setAccumulatorChanged(accumulatorBefore !== localReg["ac"])
	}

	const reset = () => {
		stopCode()
		assembleCode()
		setCurrentIp(0)
		setRegisters({
			"pc": 0,
			"ir": 0,
			"ar": 0,
			"ac": 0
		})
		setOutput("")
		setWaitingForInput(false)
		setHalted(false)
		setChangedMemoryAddresses([])
		setAccumulatorChanged(false)
	}

	const renderMemory = () => {
		const per10mem = [];
		for (let i = 0; i < memory.length; i += 10) {
			const chunk = memory.slice(i, i + 10);
			per10mem.push(chunk);
		}

		return per10mem.map((values, i) => {
			return <div className="memory-row" key={"memory" + i}>
				<p className="memory-item">{i * 10}: </p>
				<>{
					values.map((value, j) => <p className={`memory-item ${getColourBorder(i * 10 + j === currentIp, isHalted)} ${changedMemoryAddresses.includes(i * 10 + j) ? "yellow-border" : ""}`} key={"item" + i * 10 + j}>{value}</p>)
				}</>
			</div>
		})
	}

	const renderRegisters = () => {
		const regToName = {
			"pc": "Program Counter",
			"ir": "Instruction",
			"ar": "Address",
			"ac": "Accumulator"
		}

		return Object.entries(registers).map(([register, value]) => <p style={{ minWidth: regToName[register].length + 2 + 3 + "ch" }} className={`register ${getColourBorder(register === "pc", isHalted)} ${((register === "ac" && isAccumulatorChanged) ? "yellow-border" : "")}`} key={register}>{regToName[register]}: {value}</p>)
	}

	const renderProgramSelectOptions = () => Object.keys(examples).map(e => <option value={e} key={e}>{e}</option>)

	return (
		<div className="App">
			<h1 className="title">Little Man Computer</h1>
			<div className="buttons">
				<button onClick={reset}>Assemble To RAM (reset)</button>
				<button onClick={runCode}>Run</button>
				<button onClick={() => { if(error !== "") return; stopCode(); setHalted(true); }}>Stop</button>
				<button onClick={stepCode}>Step</button>
			</div>
			<main>
				<Editor height="90vh" width="45vw" language="lmc" theme="vs-dark" defaultValue={defaultString} beforeMount={editorWillMount} onMount={handleEditorDidMount} />
				<div className="monitor">
					<div className="forms">
						<form onSubmit={onInputSubmitted} className="input-form" autoComplete="off" autoCapitalize="off" autoCorrect="off">
							<label htmlFor="ioinput" className={waitingForInput ? "green-border" : ""}>Input</label>
							<input type="text" name="ioinput" value={input} onChange={onInputChanged} />
						</form>
						<form onSubmit={onSpeedSubmitted}>
							<label htmlFor="runspeed">Speed ({speed}Hz)</label>
							<input type="number" name="runspeed" value={inputSpeed} onChange={onSpeedChanged} />
						</form>
						<form>
							<label htmlFor="selectprogram">Example</label>
							<select onChange={selectedExampleChanged}>
								<>
									{renderProgramSelectOptions()}
								</>
							</select>
						</form>
					</div>
					<div className="mem-reg-container">
						<div className="memory">
							<h2>Memory</h2>
							<>
								{renderMemory()}
							</>
						</div>
						<div className="registers">
							<h2>Registers</h2>
							<>
								{renderRegisters()}
							</>
						</div>
					</div>
					<div className="output-box">
						<h2>Output</h2>
						<p className={`output ${error !== "" ? "error-output" : ""}`}>
							{error === "" ? output : error}
						</p>
					</div>
				</div>
			</main>
			<Description />
			<footer>
				Open Source on <a href="https://github.com/qco-dev/lmc">Github</a>.
			</footer>
		</div>
	);
}

export default App;
