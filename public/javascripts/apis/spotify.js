window.spotifyApi 		= getSpotifyApi(1);
Spotify 				= {};
Spotify.Models 			= spotifyApi.require('sp://import/scripts/api/models');
Spotify.Views 			= spotifyApi.require('sp://import/scripts/api/views');
Spotify.Auth 			= spotifyApi.require('sp://import/scripts/api/auth');
Spotify.Player 			= Spotify.Models.player;
Spotify.Session 		= Spotify.Models.session;
Spotify.Application 	= Spotify.Models.application;