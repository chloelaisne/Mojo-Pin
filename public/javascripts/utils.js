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