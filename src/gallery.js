import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import GalleryCommand from './command.js';

class GalleryEditing extends Plugin {
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

    schema.register('galleryCaption', {
      isLimit: true,
      allowIn: 'gallery',
      allowContentOf: '$block'
    })

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


    conversion.for('upcast').elementToElement({
      model: 'galleryCaption',
      view: {
        name: 'div',
        classes: 'gallery-caption'
      }
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'galleryCaption',
      view: {
        name: 'div',
        classes: 'gallery-caption'
      }
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'galleryCaption',
      view: (modelElement, viewWriter) => {
        const div = viewWriter.createEditableElement('div', { class: 'gallery-caption' });

        return toWidgetEditable(div, viewWriter);
      }
    });
  }
}

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import '../theme/gallery.css';
import icon from '../theme/icons/gallery.svg';

class GalleryUI extends Plugin {
  init() {
    const editor = this.editor;

    // The "gallery" button must be registered among the UI components of the editor
    // to be displayed in the toolbar.
    editor.ui.componentFactory.add('gallery', (locale) => {
      // The state of the button will be bound to the widget command.
      const command = editor.commands.get('insertGallery');

      // The button will be an instance of ButtonView.
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: editor.t('Gallery'),
        icon,
        tooltip: true
      });

      // Bind the state of the button to the command.
      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      // Execute the command when the button is clicked (executed).
      this.listenTo(buttonView, 'execute', () => editor.execute('insertGallery'));

      return buttonView;
    });
  }
}



export default class Gallery extends Plugin {
  static get requires() {
    return [GalleryEditing, GalleryUI];
  }
}
