https://davidwalsh.name/browser-camera

var Tptr = Tptr || {};
Tptr.sources = Tptr.sources || {};
Tptr.sources.webcam = new Tptr.TapatarSource({
    id: 'webcam',
    title: 'Tirar Foto',
    action: {
        content: 'Take Photo',
        onClick: function(evt) {
            if($('.tptr-webcam').length < 1) {
                $('.tptr-overlay').append(this.layout);
                $('.tptr-webcam').on('click', '.tptr-close', this.close);
            }
            this.open();

        }
    },
    onAdd: function() {
        this.layout = "<div class='tptr-window tptr-webcam' style='display: none'>\n" +
            "    <div class='tptr-close'></div>\n" +
            "    <div class='tptr-box-part'><video class='tptr-source-video' autoplay></video></div>\n" +
            "    <div class='tptr-sources-holder'><button class='tptr-snap-photo'>Foto</button></div>\n" +
            "    <div class='tptr-box-part'> \n" +
            "        <canvas class='tptr-source-canvas' id='canvas'></canvas>\n" +
            "        <img class='tptr-source-preview'>\n" +
            "        <button class=\"tptr-choose\">salvar</button>\n" +
            "    </div>\n" +
            "</div>";


        this.close = function() {

            this.stream.getTracks()[0].stop();
            $('.tptr-webcam').hide();
            $('.tptr-picker').show();
        };
        this.open = function() {
            $('.tptr-picker').hide();
            $('.tptr-webcam').show();

            // Grab elements, create settings, etc.
            var $video = $('.tptr-source-video');
            var $canvas = $('.tptr-source-canvas');

            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var that = this;

            // Get access to the camera!
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                    that.stream = stream;
                    $video.attr('src', window.URL.createObjectURL(stream));
                    $video[0].play();
                }).catch(function (e) {
                    alert("Houve um erro ao iniciar, contate o suporte");
                });

                $(".tptr-snap-photo").click(function() {
                    context.drawImage($video[0], 0, 0, canvas.width, canvas.height);
                    var data = canvas.toDataURL('image/png');
                    $('.tptr-source-preview').attr('src', data);

                });
            }


            $('.tptr-webcam .tptr-choose').click(function() {
                that.setImageData( $('.tptr-source-preview').attr('src'), true);
                //that.stream
                that.close();
            });
        };


    }
});
