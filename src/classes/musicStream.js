import emptySound from '!file!../assets/sound/empty.mp3';

export default class {
  constructor() {
    this.audio = new Audio();

    this.streams =  {
      'uit'       : false,
      '3fm'       : 'http://icecast.omroep.nl/3fm-sb-mp3',
      'sky'       : 'http://8573.live.streamtheworld.com:80/SKYRADIO_SC',
      'klassiek'  : 'http://icecast.omroep.nl/radio4-bb-mp3',
      'jazz'      : 'http://icecast.omroep.nl/radio6-bb-mp3'
    };

    this.init = this.init.bind(this);
    document.addEventListener('touchstart', this.init);
  }

  init() {
    this.audio.src = emptySound;
    this.audio.play();

    document.removeEventListener('touchstart', this.init);
  }

  play(streamKey) {
    const stream = this.streams[streamKey];
    if(!stream) {
      this.pause();
      return;
    }

    this.audio.src = stream;
    this.audio.play();
  }

  pause() {
    if(!this.audio.paused) {
      this.audio.pause();
    }
  }
}
