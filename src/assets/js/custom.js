$(function () {
    $(".proasin").mouseover(function(){
        console.log("ok");
        var imgurl = $(this).find(" > img").attr('src');
        $(this).find('.proasinimage').html("<img src='" + imgurl + "' />");
    });
});
