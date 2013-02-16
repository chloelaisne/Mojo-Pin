Templates = 					{};

Templates.App = 				'<div id="header"></div>' +
								'<div id="global"></div>';

Templates.Header = 				'<h1>Mojo Pin</h1>' +
								'<nav>' +
									'<ul class="left">' +
										'<li id="goto-news">News</li>' +
										'<li id="goto-profile">Profile</li>' +
									'</ul>' +
									'<ul class="right">' +
										'<li id="goto-friends">Friends</li>' +
										'<li id="goto-pin" class="mp-icon"><span class="mp-plus"></span>Pin</li>' +
									'</ul>' +
								'</nav>';

Templates.Offline = 			'Mojo Pin is not available offline';

Templates.EditMusicTitle = 		'<h2>Pin a new track or playlist to your memory map</h2>';

Templates.DropzoneInactive = 	'<div id="dropzone" class="blank">' +
									'<p><span class="mp-drop"></span>Drag & Drop any playlist</p>' +
								'</div>';

Templates.DropzoneActive = 		'<div id="dropzone">' +
									'<div class="cover" style="background-size: 100% 100%; background-image: url(<%= trackimage %>);"></div>' +
									'<div class="meta">' +
										'<div class="track-name"><%= trackname %></div>' +
										'<div class="artist-name"><%= trackartists %></div>' +
									'</div>' +
								'</div>';

Templates.EditDescription = 	'<div id="page-bottom">' +
									'<form>' +
										'<textarea>Message (Optional)</textarea>' +
									'</form>' +
									'<div class="social">' +
										'Share to' +
										'<div class="buttons">' +
											'<button class="sp-button sp-icon mp-social active"><span class="mp-facebook"></span>Facebook</button>' +
										'</div>' +
									'</div>' +
								'</div>';

Templates.Player = 				'<div class="player">Use currently playing:<span><span class="volume on"></span><%= trackname %> by <%= trackartists %></span></div>'

Templates.EditNavigation = 		'<div class="pagination">' +
									'<div class="left">' +
										'<button id="previous" class="sp-button <% if(previous.theme == "dark"){ %>mp-dark<% } %> <% if(previous.icon){ %>mp-icon<% } %>">' +
											'<% if(previous.icon){ %><span class="mp-arrow mp-arrow-left"></span><% } %>' +
											'<%= previous.label %>' +
										'</button>' +
									'</div>' +
									'<div class="right">' +
										'<button id="next" class="sp-button <% if(next.theme == "dark"){ %>mp-dark<% } else if(next.theme == "primary"){ %>sp-primary<% } %> <% if(next.theme == "crossbreed" && next.state == 0){ %>mp-flat<% } %> <% if(next.icon){ %>mp-icon<% } %>" <% if((next.theme == "light" || next.theme == "primary") && next.state == 0){ %>disabled<% } %>>' +
											'<% if(next.icon){ %><span class="mp-arrow mp-arrow-right"></span><% } %>' +
											'<%= next.label %>' +
										'</button>' +
										'<% if(cancel.route != null){ %> <span id="cancel">or Cancel</span><% } %>' +
									'</div>' +
								'</div>';

Templates.SearchLocation = 		'<div id="page-bottom">' +
									'<div class="search">' +
										'<form><input type="text" /></form>' +
										'<div id="results"></div>' +
									'</div>' +
								'</div>';

Templates.SearchMusic = 		'<div id="search" id="music">' +
									'<form>' +
										'<input class="inactive" type="text" value="Search"/>' +
									'</form>' +
								'</div>';


Templates.Activity = '<div class="music"><span class="<%= type %>"></span><b><%= title %></b> by <%= artists %></div><div class="location"><%= location %></div>';
Templates.User = '<div id="top"><div class="picture"></div><div class="information"><div class="name">Chloé Laisné</div><div class="statistics"><span class="mp-disc"></span>9 memories</div></div></div><div id="sidebar"></div><div id="map"></div>';
Templates.Friend = '<li style="display:<%= display %>"><div class="picture"><img src="<%= picture %>" alt="<%= name %>\'s profile picture"/><button class="sp-button">Send Invitation</button></div><a><span><%= name %></span></a></li>';
Templates.Friends = '<div><form id="filter"><input type="text" value="Filter"/></form><ul class="friendslist"></ul></div>';
Templates.TrackResults = '<div class="title" id="tracks">Tracks</div><ul></ul>';
Templates.Result = '<li><img src="<%= trackimage %>"><p><span><%= trackname %></span> by <%= trackartists %></p></li>';