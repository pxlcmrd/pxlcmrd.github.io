const IMG_URL = '../../pxlcmrd.github.io/img/';

var listaAlbums = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 12", [list]);

$("#list .row").append(builder.item(listaAlbums));

//var fillTracks = alasql("select * from ? where title like '%salad%'", [list])[0].tracklist;

//$("#track_list").append(builder.track(fillTracks));

$(document).on('click', '.playlist_overlay', function() {
    let album = alasql("SELECT * FROM ? WHERE id = " + $(this).attr('album-id'), [list])[0];

    $('#album').show();
    $('#album .info').html(builder.album(album));
    $("#track_list").html(builder.track(album.tracklist));
}).on('click', '#album .fechar', function(){
    $('#album').hide();
});
