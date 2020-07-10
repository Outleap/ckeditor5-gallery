import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import '../theme/gallery.css';
import icon from '../theme/icons/gallery.svg';

export default class GalleryUI extends Plugin {
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
