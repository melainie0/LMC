import './Description.css';

export default function Description() {
	return (
		<div className="description">
			<section>
				<h2>Memory</h2>
				<p>
					The memory in the LMC is made from 100 address/mailboxes, from 0 to 99.<br/>
					Each value in memory can be up to 3 digits (decimal) long.<br/>
					As the LMC follows Von Neumann architecture, both the data and instructions are stored in the same memory.<br/>
				</p>
			</section>
			<section>
				<h2>Registers</h2>
				<p>
					Each register has a specific purpose and may only hold one value.
				</p>
				<ul>
					<li>The Program Counter Register holds the address of the next instruction to be fetched.</li>
					<li>The Instruction Register holds the instruction part of the value fetched from memory (the first digit).</li>
					<li>The Address Register holds the address/data of the value fetched from memory (the second &amp; third digit).</li>
					<li>The Accumulator Register holds the results of instructions, and is used with instructions such as ADD for the first operand.</li>
				</ul>
			</section>
			<section>
				<h2>Assembly Language</h2>
				<p>
					The Assembly Language used for the LMC is simplistic.
					It can only recognise line comments (//), integer numbers, labels, and instructions.
					If a line has a label it must come before the instruction.
					Unlike in some other LMC assembly languages, DAT must always take a value.
					There can only be one instruction and label per line, and each instruction takes either 0 or 1 arguments.
				</p>
			</section>
			<section>
				<h2>Instructions - Standard</h2>
				<div>
					<h3>HLT</h3>
					<small>Encoding: 000</small>
					<p>
						The halt instruction (HLT) stops the execution of the program.
					</p>
				</div>
				<div>
					<h3>ADD</h3>
					<small>Encoding: 1xx</small>
					<p>
						The add instruction (ADD) takes the value in the accumulator and the value at the given address and adds them.
						The result is stored back into the accumulator.
					</p>
				</div>
				<div>
					<h3>SUB</h3>
					<small>Encoding: 2xx</small>
					<p>
						The subtract instruction (SUB) takes the value in the accumulator and the value at the given address and subtracts them.
						The result is stored back into the accumulator.
					</p>
				</div>
				<div>
					<h3>STA</h3>
					<small>Encoding: 3xx</small>
					<p>
						The store accumulator instruction (STA) takes the value in the accumulator and stores it into the given memory address.
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>LDA</h3>
					<small>Encoding: 5xx</small>
					<p>
						The load accumulator instruction (LDA) takes the value at the given memory address and stores it into the accumulator.
					</p>
				</div>
				<div>
					<h3>BRA</h3>
					<small>Encoding: 6xx</small>
					<p>
						The branch always instruction (BRA) sets the program counter to the given address.
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>BRZ</h3>
					<small>Encoding: 7xx</small>
					<p>
						The branch if zero instruction (BRZ) sets the program counter to the given address if the accumulator's value is 0.
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>BRP</h3>
					<small>Encoding: 8xx</small>
					<p>
						The branch if positive instruction (BRP) sets the program counter to the given address if the accumulator's value is positive,
						including 0 (i.e. the value is not negative).
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>INP</h3>
					<small>Encoding: 901</small>
					<p>
						The input instruction (INP) waits for the user to enter a value, then stores this value into the accumulator.
					</p>
				</div>
				<div>
					<h3>OUT</h3>
					<small>Encoding: 902</small>
					<p>
						The output instruction (OUT) takes the accumulator's value and outputs it to the output box.
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>DAT</h3>
					<small>Encoding: xxx</small>
					<p>
						The data instruction (DAT) encodes its operand as into the memory. 
						It does not perform an operation.
					</p>
				</div>
			</section>
			<section>
				<h2>Instructions - Non Standard</h2>
				<div>
					<h3>OTC</h3>
					<small>Encoding: 912</small>
					<p>
						The output character instruction (OUT) takes the accumulator's value and converts it to a character (using it as a character code).
						This character is then outputted to the output box.
						The value of the accumulator does not change.
					</p>
				</div>
				<div>
					<h3>LOA</h3>
					<small>Encoding: 4xx</small>
					<p>
						The load offset to accumulator instruction (LOA) takes the accumulator's value and adds it to the given address.
						Then this computed address' value is stored into the accumulator.
					</p>
				</div>
			</section>
		</div>
	)
}
