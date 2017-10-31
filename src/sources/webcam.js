// https://davidwalsh.name/browser-camera
var cameraStream;
var Tptr = Tptr || {};
Tptr.sources = Tptr.sources || {};
Tptr.sources.webcam = new Tptr.TapatarSource({
    id: 'webcam',
    title: 'Tirar Foto',
    action: {
        content: 'Tirar Foto',
        onClick: function(evt) {
            if($('.tptr-webcam').length < 1) {
                $('.tptr-overlay').append(this.layout);
                $('.tptr-webcam').on('click', '.tptr-close', this.close);
            }
            this.streaming = false;
            this.open();
        }
    },
    onAdd: function() {
        this.hash = Math.random().toString(36).substr(2, 5)
        this.width  = 300;
        this.height = 0;
        this.layout = "<div class='tptr-window tptr-webcam' style='display: none'>\n" +
            "    <div class='tptr-close'></div>\n" +
            "    <div class='tptr-box-part'><video class='tptr-source-video' autoplay></video></div>\n" +
            "    <div class='tptr-box-button'><button class='tptr-snap-photo'>Tirar Foto</button></div>\n" +
            "    <canvas class='tptr-source-canvas' id='canvas'></canvas>\n" +
            "    <div class='tptr-box-part'> \n" +
            "        <img class='tptr-source-preview'>\n" +
            "        <button class=\"tptr-choose tptr-choose-"+this.hash+"\">salvar</button>\n" +
            "    </div>\n" +
            "</div>";


        this.close = function() {
            cameraStream.getTracks()[0].stop();
            $('.tptr-webcam').hide();
            $('.tptr-picker').show();
        };

        var that = this;
        $('body').on('click', '.tptr-webcam .tptr-choose-'+this.hash, function() {
            that.setImageData( $('.tptr-source-preview').attr('src'), true);
            that.close();
        });

        this.open = function() {
            $('.tptr-picker').hide();
            $('.tptr-webcam').show();

            // Grab elements, create settings, etc.
            var $video = $('.tptr-source-video');
            video = $video[0];
            var $canvas = $('.tptr-source-canvas');

            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var that = this;
            video.addEventListener('canplay', function(ev){
                if (!that.streaming) {
                    height = video.videoHeight / (video.videoWidth/ that.width);
                    video.setAttribute('width', that.width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', that.width);
                    canvas.setAttribute('height', height);
                    $('.tptr-source-preview').attr('width', that.width);
                    $('.tptr-source-preview').attr('height', height);
                    that.height = height;
                    that.streaming = true;
                }
            }, false);

            // Get access to the camera!
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Not adding `{ audio: true }` since we only want video now
                navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                    cameraStream = stream;
                    video.srcObject = stream;
                    video.play();
                }).catch(function (e) {
                    alert("Houve um erro ao iniciar, contate o suporte");
                });

                $(".tptr-snap-photo").click(function() {
                    var context = canvas.getContext('2d');
                    canvas.width = that.width;
                    canvas.height = that.height;
                    context.drawImage(video, 0, 0, that.width, that.height);

                    var data = canvas.toDataURL('image/png');
                    $('.tptr-source-preview').attr('src', data);
                });
            }
        };


    }
});
