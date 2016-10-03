import emptySound from '!file!../assets/sound/empty.mp3';
import TranslationStore from '../stores/translation';

export default class {
  constructor() {
    this.audio = new Audio();
    this.streams = {};
    this.streams[TranslationStore.mappingClassToUI['uit']] = false;
    this.streams[TranslationStore.mappingClassToUI['3fm']] = 'http://icecast.omroep.nl/3fm-sb-mp3';
    this.streams[TranslationStore.mappingClassToUI['sky']] = 'http://8573.live.streamtheworld.com:80/SKYRADIO_SC';
    this.streams[TranslationStore.mappingClassToUI['klassiek']] = 'http://icecast.omroep.nl/radio4-bb-mp3';
    this.streams[TranslationStore.mappingClassToUI['jazz']] = 'http://icecast.omroep.nl/radio6-bb-mp3';

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
