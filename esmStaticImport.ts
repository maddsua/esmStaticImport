
export const staticImport = async <T extends object> (moduleRaw: string, propKey: string): Promise<T> => {

	const importPattern = new RegExp(`export\\s((const)|(let))\\s${propKey}\\s=\\s[\\{\\[]`, 'i');

	const importMatch = moduleRaw.match(importPattern)?.[0];
	if (!importMatch) {
		throw new Error('Didn\'t match import start or no such exported property');
	}

	const objOpenSymbol = importMatch.at(-1);
	if (!objOpenSymbol) {
		throw new Error('Parenthness sequence invalid');
	}

	const objCloseSymbol = objOpenSymbol === '{' ? '}' : ']';

	const importSlice = moduleRaw.slice(moduleRaw.indexOf(importMatch));
	const importObjStart = importSlice.indexOf(objOpenSymbol) + 1;
	let exportedSlice = '';
	
	for (let idx = importObjStart, nestLevel = 1; idx < importSlice.length; idx++) {
		
		if (importSlice[idx] === objOpenSymbol) {
			nestLevel++;
		}

		if (importSlice[idx] === objCloseSymbol) {

			nestLevel--;

			if (nestLevel == 0) {
				exportedSlice = importSlice.slice(importObjStart - 1, idx + 1);
				break;
			}
		}
	}

	if (!exportedSlice.length) {
		throw new Error('Could not match export boundries');
	}

	try {
		//	potential foot-shooter but I don't care
		return new Function(`return (${exportedSlice});`)() as T;
	} catch (error) {
		throw new Error(`Failed to parse imported object: ${error}`);
	}
};

export default staticImport;
