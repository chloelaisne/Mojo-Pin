Templates = 					{};

Templates.App = 				'<div id="global"></div>';

Templates.Header = 				'<div id="header">' + 
								'<h1>Mojo Pin</h1>' +
								'<nav>' +
									'<ul class="left">' +
										'<li id="goto-news">News</li>' +
										'<li id="goto-profile">Profile</li>' +
									'</ul>' +
									'<ul class="right">' +
										'<li id="goto-friends">Friends</li>' +
										'<li id="goto-edit">Pin</li>' +
										'<li id="goto-logout" class=" mp-icon"><span class="logout"></span>Logout</li>' +
									'</ul>' +
								'</nav>' +
								'</div>';

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

Templates.Player = 				'<div class="player">Use currently playing:<span class="track"></span></div>'

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

Templates.ProfileHeader = 		'<div class="picture" style="background-size: 100% 100%; background-image: url(<%= image %>);"></div>' +
								'<div class="information">' +
									'<div class="name"><%= fullname %></div>' +
									'<div class="statistics">' +
										'<% if(typeof location != "undefined") { %><p id="location"><span class="mp-marker"></span><%= location %></p><% } %>' +
										'<% if(pins != 0) { %><p id="memories"><span class="mp-disc"></span><%= pins %> pin<% if(pins > 1) { print("s"); } %></p><% } %>' +
									'</div>' +
								'</div>';

Templates.Profile = 			'<div id="top"></div>' +
								'<div id="middle">' +
									'<div id="sidebar"></div>' +
								'</div>';

Templates.EmptyPins = 			'<div class="alert">' +
									'<span class="mp-pin"></span>' +
									'<p class="header">No pins</p>' +
									'<% if(isLoggedInUser) { %>' +
										'<p>Click the Pin button to add<br/>a pin to your profile</p>' +
									'<% } %>' +
								'</div>';

Templates.Login = 				'<button class="sp-facebook mp-login"><span class="facebook"></span>Log in with Facebook</button>';

Templates.Activity = 			'<li>' +
									'<div class="music"><span></span><b><%= title %></b> by <%= artists %></div>' +
									'<div class="location"><%= location %></div>' +
								'</li>'; 

Templates.Friend = 				'<li style="display:<%= display %>">' +
									'<div class="picture">' +
										'<div style="background-image: url(<%= picture %>);"></div>' +
									'</div>' +
									'<% if(active){ %><a><% } %><span><%= name %></span><% if(active){ %></a><% } %>' +
								'</li>';

Templates.Friends = 			'<div>' +
									'<form id="filter">' +
										'<input type="text" value="Filter"/>' +
									'</form>' +
									'<ul class="friendslist"></ul>' +
									'<div id="page-bottom">' +
										'<button class="sp-facebook mp-invite"><span class="friends"></span>Invite Friends</a>' +
									'</div>' +
								'</div>';

Templates.TrackResults = '<div class="title" id="tracks">Tracks</div><ul></ul>';
Templates.Result = '<li><img src="<%= trackimage %>"><p><span><%= trackname %></span> by <%= trackartists %></p></li>';