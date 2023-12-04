export const languageDef = {
	defaultToken: "",
	keywords: [
		"LDA", "STA", "LOA", "ADD", "SUB", "INP", "OUT", "OTC", "HLT", "BRZ", "BRP", "BRA", "DAT"
	].map(x => [x, x.toLowerCase()]).flat(),
	tokenizer: {
		root: [
			{ include: '@whitespace' },
			[/[a-zA-Z][a-zA-Z0-9]*/, {
				cases: {
					"@keywords": "keyword",
					"@default": "type.identifier"
				}
			}],
			[/\d+/, 'number'],
		],
		whitespace: [
			[/[ \t\r\n]+/, 'white'],
			[/\/\/.*$/,    'comment'],
		],
	}
}

export const configuration = {
	comments: {
	  lineComment: "//",
	},
}