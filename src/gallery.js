import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import GalleryEditing from './editing.js';
// import GalleryUI from './ui.js';

export default class Gallery extends Plugin {
  static get requires() {
    return [GalleryEditing];
  }
}
