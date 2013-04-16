Utils = {};

Utils.ShortenString = function(element)
{
	if(element.height() > parseInt(element.css("line-height")))
	{
		var pattern = '...';
		element.prepend(pattern);
		while(element.height() > parseInt(element.css("line-height")))
		{
			element.text(element.text().slice(0, element.text().length - 1));
		}
		element.text((element.text()).trim().slice(pattern.length, element.text().length));
		element.append(pattern);
	}
	return element.text();
};

Utils.GetCoordinatesFromLocation = function(query, callback)
{
	// Default user location
	var location = { location: null, reference: null, latitude: "59.32893000000001", longitude: "18.064910" };

	// ===== If user's Facebook location is defined ===== //
	if(typeof query != 'undefined')
	{
		$.ajax({
			type	: "GET",
			url		: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&sensor=" + App.GOOGLE_MAPS["sensor"] + "&key=" + App.GOOGLE_MAPS["key"],
			dataType: "json"
		})
		.done(function (data, textStatus, jqXHR){
			if(data.status == "OVER_QUERY_LIMIT")
			{
				console.log("OVER_QUERY_LIMIT");
			}
			else
			{
				if(data.results.length != 0) {
					callback(data.results[0].reference, data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
				}
				else {
					callback(location.reference, location.latitude, location.longitude);
				}
			}
		});
	}
	// ===== If user's Facebook location is defined ===== //
	else
	{
		callback(location.reference, location.latitude, location.longitude);
	}
}

Utils.DesignTextField = function(element)
{
	var defaultValue = $(element).text()
	//element.onfocus
	console.log(defaultValue);
}