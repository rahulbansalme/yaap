(function() {
    // global properties
    var gearInterval = null
    var gearTryCount = 0

    // get time passed
    function getTimePassed(date) {
        var seconds = Math.floor((new Date() - (new Date(date)).getTime()) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";

    }

    // debounce the multiple hits with delay
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // validate the url
    function validateUrl() {
        
    }

    // play the song
    function playMusic(event) {
        // fetch new url
        var playId = event.target.id;
        if (playId.indexOf('play-') === -1) return

        // clear old interval
        clearInterval(gearInterval);
        var videoId = playId.replace('play-', '');
        // start loading
        renderPlayerLoading();

        // https://youtube2mp3api.com/@grab?vidID=kw4tT7SCmaY&format=mp3&streams=mp3&api=button
        // $.ajax({
        //     url: 'https://yaap-app.herokuapp.com/grab/' + videoId,
        //     success: function(data) {
        //         var song = $('<div></div>').html(data).find('a').attr('href');
        //         if (song) {
        //             // render success
        //             renderPlayerSuccess(song);
        //         }
        //         else {
        //             // render failure
        //             renderPlayerFailure();
        //         }
        //     },
        // });
    }

    // render a blank list
    function renderEmptyList() {
        $('#videos').addClass('empty').find('table').empty().html('<tr><td align="center">No results here!</td></tr>');
    }

    // render videos list
    function renderVideos(list) {
        $('#videos').removeClass('empty').find('table').empty().html(list)
    }

    // render player loading
    function renderPlayerLoading() {
        $('#player').append('<img class="loader" src="app/images/gear.gif" width="35" />');
    }

    // render player success
    function renderPlayerSuccess(song) {
        if (song.indexOf('//') === 0) song = 'https:' + song;
        setTimeout(function (){
            $('#player').html('<audio controls autoplay><source src="' + song + '" /></audio>');
        }, 1000);
    }

    // render player failure
    function renderPlayerFailure() {
        $('#player').html('<span class="error">Something went wrong! Please try again later!</span>');
        setTimeout(function() {
            $('#player').fadeOut();
        }, 1000)
    }

    // init
    $(document).ready(function() {
        // start with empty list
        renderEmptyList();

        // bind text change event
        $('#data-search').keyup(debounce(function() {
            var searchText = this.value;
            if (!searchText) {
                renderEmptyList()
                return
            }
            // https://www.googleapis.com/youtube/v3/search?q=searchText&part=snippet&key=AIzaSyBOfo9n3VLoun12TQb66o8wzYxrh5lFpnY
            $.ajax({
                url: 'https://www.googleapis.com/youtube/v3/search?q=' + searchText + '&part=snippet&key=AIzaSyBOfo9n3VLoun12TQb66o8wzYxrh5lFpnY&maxResults=50',
                success: function(data) {
                    if (!(data && data.items && data.items.length)) {
                        renderEmptyList()
                        return
                    }
                    var htmlString = "";
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        var snippet = data.items[i].snippet;
                        if (!item.id.videoId) continue;
                        htmlString += '<tr>';
                        htmlString += '<td width="90" align="left"><img src="' + snippet.thumbnails.default.url + '" alt="' + snippet.title + '" width="75" height="75" /></td>';
                        htmlString += '<td align="left">';
                        htmlString += '<a id="play-' + item.id.videoId + '">' + snippet.title + '</a>';
                        htmlString += '<br /><span><strong>Channel:</strong> ' + snippet.channelTitle + '</span>';
                        htmlString += '&nbsp;&nbsp;<span><strong>Published:</strong> ' + getTimePassed(snippet.publishedAt) + ' ago</span>';
                        htmlString += '<br /><small>' + snippet.description + '</small>';
                        htmlString += '</td>';
                        htmlString += '</tr>';
                    }
                    renderVideos(htmlString)
                },
            })
        }, 250));

        // bind play handler
        $(document).bind('click', playMusic)
    })
})()