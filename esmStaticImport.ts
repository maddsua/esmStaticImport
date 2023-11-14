interface StaticImportResult {
	data: object | null;
	error?: Error;
}

export default (data: string, propname: string): StaticImportResult => {

	const importStartMatch = data.match(new RegExp(`export\\sconst\\s${propname}\\s=\\s[\\{\\[]`, 'i'))?.[0];
	if (!importStartMatch) return {
		data: null,
		error: new Error('Didn\'t match import start or no such exported property')
	};

	const thisObjectOpenParenthness = importStartMatch.at(-1);
	const thisObjectCloseParenthness = thisObjectOpenParenthness === '{' ? '}' : ']';

	const importSlice = data.slice(data.indexOf(importStartMatch));
	const exportObjectStart = importSlice.indexOf(thisObjectOpenParenthness) + 1;
	let exportObjectText = '';
	
	for (let i = exportObjectStart, parenthnesses = 1; i < importSlice.length; i++) {
		
		if (importSlice[i] === thisObjectOpenParenthness) parenthnesses++;

		if (importSlice[i] === thisObjectCloseParenthness) {

			parenthnesses--;

			if (parenthnesses == 0) {
				exportObjectText = importSlice.slice(exportObjectStart - 1, i + 1);
				break;
			}
		}
	}

	if (!exportObjectText.length) return {
		data: null,
		error: new Error('Could not match export boundries')
	};

	let wantedObject: object;
	
	try {
		//	potential foot-shooter but I don't care
		wantedObject = new Function(`return (${exportObjectText});`)();
	} catch (error) {
		return { data: null, error };
	}

	return { data: wantedObject };
};
