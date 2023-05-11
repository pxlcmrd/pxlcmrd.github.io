var listaAlbums = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 12", [list]);

$("#list .row").append(builder.item(listaAlbums));

var fillTracks = alasql("select * from ? where title like '%salad%'", [list])[0].tracklist;

$("#track_list").append(builder.track(fillTracks));