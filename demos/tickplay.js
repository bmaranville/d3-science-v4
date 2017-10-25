function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

var context;
var bufferLoader;

function sinit() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      'Tick.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  var source1 = context.createBufferSource();
  //var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  //source2.buffer = bufferList[1];

  source1.connect(context.destination);
  //source2.connect(context.destination);
  source1.start(0);
  //source2.start(0);
}

function playTick(after) {
  var after = after || 0;
  var source1 = context.createBufferSource();
  //var source2 = context.createBufferSource();
  source1.buffer = bufferLoader.bufferList[0];
  //source2.buffer = bufferList[1];

  source1.connect(context.destination);
  //source2.connect(context.destination);
  source1.start(after);
}

var bufsize = 8192;
var ping = [];
var ping_length = 3;
var global_elapsed;
var buftime = bufsize / 44100;

var ticker = new Pizzicato.Sound({
    source: 'script',
    options: {
        attack: 0,
        release: 0.1,
        bufferSize: bufsize,
        volume: 0.2,
        audioFunction: function(e) {
            output = e.outputBuffer.getChannelData(0);
            var l = e.outputBuffer.length;
            // flat to start...
            for (var i = 0; i < l; i++) {
              output[i] = -1;
            }
            ping.sort();
            var el = global_elapsed;
            var bufend = el + buftime;
            var next_ping = ping.shift();
            while (next_ping && next_ping < bufend) {
              var st = Math.floor((-next_ping + el)*44.100);
              //console.log(st);
              //console.log(next_ping - el);
              for (var i=0; i<ping_length && st >=0 && (st+i)<bufsize; i++) {
                output[st+i] = 1;
              }
              next_ping = ping.shift();
            }
            // put it back if there's one left over.
            if (next_ping) { ping.splice(0, 0, next_ping) }
          
              //output[i] = (i < l/4) ? Math.random() : 0;
              //output[i] = (i < 6 || (i > 500 && i < 508)) ? 1 : -1;
              //output[i] = Math.sin(44/2048*Math.PI*i);
        }
    }
});
  
