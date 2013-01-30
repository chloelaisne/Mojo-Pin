Templates = {};
Templates.App = '<div id="header"></div><div id="global"></div>'
Templates.Header = '<h1>Mojo Pin</h1><nav><ul class="left"><li id="goto-news">News</li><li id="goto-profile">Profile</li></ul><ul class="right"><li id="goto-friends">Friends</li><li id="goto-pin" class="mp-icon"><span class="mp-plus"></span>Pin</li></ul></nav>';
Templates.Activity = '<div class="music"><span class="<%= type %>"></span><b><%= title %></b> by <%= artists %></div><div class="location"><%= location %></div>';
Templates.User = '<div id="top"><div class="picture"></div><div class="information"><div class="name">Chloé Laisné</div><div class="statistics"><span class="mp-disc"></span>9 memories</div></div></div><div id="sidebar"></div><div id="map"></div>';
Templates.Friend = '<li style="display:<%= display %>"><div class="picture"><img src="<%= picture %>" alt="<%= name %>\'s profile picture"/><button class="sp-button">Send Invitation</button></div><a><span><%= name %></span></a></li>';
Templates.Friends = '<div><form id="filter"><input type="text" value="Filter"/></form><ul class="friendslist"></ul></div>';
Templates.EditTrack = '<h2>Pin a new track or playlist to your memory map</h2>';
Templates.PlayingTrack = '<div class="playing">Use currently playing:<span><span class="volume on"></span><%= trackname %> by <%= trackartists %></span></div>'
Templates.DropzoneInactive = '<div id="dropzone" class="blank"><p><span class="mp-drop"></span>Drag & Drop any playlist</p></div>';
Templates.DropzoneActive = '<div id="dropzone"><div class="cover" style="background-size: 100% 100%; background-image: url(<%= trackimage %>);"></div><div class="meta"><div class="track-name"><%= trackname %></div><div class="artist-name"><%= trackartists %></div></div></div>';
Templates.SearchLocation = '<div id="page-bottom"><div class="search" id="location"><form><input type="text" /></form><div id="results"></div></div></div>';
Templates.EditDescription = '';
Templates.Pagination = '<div class="pagination"><div class="left"><button class="sp-button mp-dark">Cancel</button></div><div class="right"><button class="sp-button mp-flat mp-icon"><span class="mp-arrow mp-arrow-right"></span>Next</button> or Cancel</div></div>';
Templates.TrackResults = '<div class="title" id="tracks">Tracks</div><ul></ul>';
Templates.Result = '<li><img src="<%= trackimage %>"><p><span><%= trackname %></span> by <%= trackartists %></p></li>';
Templates.Search = '<div id="search" id="music"><form><input class="inactive" type="text" value="Search"/></form></div>';