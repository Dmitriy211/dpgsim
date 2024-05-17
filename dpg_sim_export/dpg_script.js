
function fetchJSONData(path) {
	fetch(path)
		.then(response => response.text())
		.then
		((data) => 
			{
				//console.log("JS: " + data);
				godotFunctions.SendToGodot(data);
			}
		)
}

function fetchCSV(path) {
	fetch(path)
		.then(response => response.text())
		.then
		((data) => 
			{
				//console.log(data);
				godotFunctions.SendCSV(data);
			}
		)
}

function fetchTrans(path) {
	fetch(path)
		.then(response => response.text())
		.then
		((data) => 
			{
				godotFunctions.SendTrans(JSON.stringify(CSVToArray(data, ";")));
				//console.log(JSON.stringify(CSVToArray(data, ";")));
			}
		)
}

function CSVToArray(strData, strDelimiter) {
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp
	(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);


	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	var dict = {};
	var lines = {};
	lines["Lines"] = [];
	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;


	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec(strData)) {

	// Get the delimiter that was found.
	var strMatchedDelimiter = arrMatches[1];

	// Check to see if the given delimiter has a length
	// (is not the start of string) and if it matches
	// field delimiter. If id does not, then we know
	// that this delimiter is a row delimiter.
	if (
		strMatchedDelimiter.length &&
		strMatchedDelimiter !== strDelimiter
	) {

		// Since we have reached a new row of data,
		// add an empty row to our data array.
		arrData.push([]);

		lines["Lines"].push(dict);
		dict = {};

	}

	var strMatchedValue;

	// Now that we have our delimiter out of the way,
	// let's check to see which kind of value we
	// captured (quoted or unquoted).
	if (arrMatches[2]) {

		// We found a quoted value. When we capture
		// this value, unescape any double quotes.
		strMatchedValue = arrMatches[2].replace(
			new RegExp("\"\"", "g"),
			"\""
		);

	} else {

		// We found a non-quoted value.
		strMatchedValue = arrMatches[3];

	}


	// Now that we have our value string, let's add
	// it to the data array.
	arrData[arrData.length - 1].push(strMatchedValue);

	if (!("key" in dict)) 
	{
		dict["key"] = strMatchedValue;
	} else if (!("EN" in dict)) 
	{
		dict["EN"] = strMatchedValue;
	} else if (!("RU" in dict)) 
	{
		dict["RU"] = strMatchedValue;
	} else if (!("KZ" in dict)) 
	{
		dict["KZ"] = strMatchedValue;
	}
	}

	// Return the parsed data.
	//return (arrData);
	return (lines);
}

function fetchImage(path) {
	fetch(path)
		.then(response => response.arrayBuffer())
		.then
		((data) => 
			{
				godotFunctions.SendImage(data);
			}
		)
}

function getURLparam(name) 
{
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	godotFunctions.SetLanguage(urlParams.get(name));
}

window.godotFunctions = {};
window.externalator = {
	addGodotFunction: (n,f) => {
		window.godotFunctions[n] = f;
	}
}