# Little Man Computer

Simulates the [Little Man Computer](https://en.wikipedia.org/wiki/Little_man_computer).

Offers assembly and emulation, with register and memory views.

Can take I/O.

Has both a run mode and a step-through mode.

May contain some bugs and inefficient code, as it was made for a challenge over a day or two.

Offers the [standard instructions](http://www.yorku.ca/sychen/research/LMC/LMCInstructions.html), as well as two non-standard instructions: OTC and LOA.

## OTC

OTC (*O*utpu*T* *C*haracter) outputs the value currently in the accumlator as a character, based on its character code. E.g:
 - 65 -> A
 - 66 -> B
 - 97 -> a
 - 98 -> b
 - 33 -> !
 - etc

More on these codes [here (ASCII)](https://en.wikipedia.org/wiki/ASCII#Printable_characters). NOTE: All examples are available in ASCII, however any valid Unicode value which will fit into 3 decimal digits will also work.

## LOA

LOA (*L*oad *O*ffset to *A*ccumulator) takes an address/mailbox as its operand, offsets it by the value in the accumulator, then loads the value at the resulting address.
LOA is the most complex instruction in the instruction set and exists to allow for immutable arrays (such as strings).

Example:
```
        LDA ONE
        LOA START
        OUT
        HLT

START   DAT 0
READ    DAT 404 // This is the memory that is loaded: START + 1

ONE     DAT 1   // Constant 1
```
This will output `404`, as the address at START + ONE = READ, which contains the value `404`.
