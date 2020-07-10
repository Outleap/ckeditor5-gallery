import Command from '@ckeditor/ckeditor5-core/src/command';

export default class GalleryCommand extends Command {
  execute() {
    this.editor.model.change((writer) => {
      // Insert <gallery>*</gallery> at the current selection position
      // in a way that will result in creating a valid model structure.
      this.editor.model.insertContent(createGallery(writer));
    });
  }

  refresh() {
    const
      model     = this.editor.model,
      selection = model.document.selection,
      allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'gallery')
    ;

    this.isEnabled = allowedIn !== null;
  }
}

function createGallery(writer) {
  const
    widget    = writer.createElement('gallery'),
    container = writer.createElement('galleryContainer')
  ;

  writer.append(container, widget);

  // There must be at least one paragraph for the description to be editable.
  // See https://github.com/ckeditor/ckeditor5/issues/1464.
  writer.appendElement('paragraph', container);

  return widget;
}
