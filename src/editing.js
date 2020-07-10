import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import GalleryCommand from './command.js';

export default class GalleryEditing extends Plugin {
  static get requires() {
      return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('insertGallery', new GalleryCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('gallery', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,

      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block'
    });

    schema.register('galleryImages', {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: 'gallery',

      // Allow content which is allowed in the root (e.g. paragraphs).
      allowContentOf: '$root'
    });

    schema.addChildCheck((context, childDefinition) => {
      if (context.endsWith('galleryImages') && childDefinition.name == 'gallery') {
          return false;
      }
    });

    schema.extend('image', {
      allowIn: 'galleryImages'
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for('upcast').elementToElement({
      model: 'gallery',
      view: {
        name: 'div',
        classes: 'gallery'
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'gallery',
      view: {
        name: 'div',
        classes: 'gallery'
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'gallery',
      view: (modelElement, viewWriter) => {
        const div = viewWriter.createContainerElement('div', { class: 'gallery' });

        return toWidget(div, viewWriter, { label: 'simple box widget' });
      }
    });

    
    conversion.for('upcast').elementToElement({
      model: 'galleryImages',
      view: {
        name: 'div',
        classes: 'gallery-images'
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'galleryImages',
      view: {
        name: 'div',
        classes: 'gallery-images'
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'galleryImages',
      view: (modelElement, viewWriter) => {
        const div = viewWriter.createEditableElement('div', { class: 'gallery-images' });

        return toWidgetEditable(div, viewWriter);
      }
    });
  }
}
