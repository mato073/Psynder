_deg2rad = function(deg) {
	return deg * (Math.PI / 180);
};

exports.getFlightDistanceFromLatLonInKm = function(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in kilometers
	var dLat = _deg2rad(lat2 - lat1); // deg2rad below
	var dLon = _deg2rad(lon2 - lon1);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in KM

	return d;
};

exports.locationToJSONPos = function(location) {
	let pos = {lat: 0, lng: 0, formattedAddress: ""};

	try {
		pos.lat = parseFloat(location.lat.toString());
		pos.lng = parseFloat(location.lng.toString());
		pos.formattedAddress = location.formattedAddress;
	} catch (err) {
		console.log(`Error exception:\n${err.stack}`);
		throw err;
	}

	return pos;
};