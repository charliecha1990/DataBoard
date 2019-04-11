import { FilesCollection } from 'meteor/ostrio:files';

const Images = new FilesCollection({
  // debug: true,
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 30MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 30 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }

    return 'Please upload image with size equal or less than 30MB';
  }
});

export default Images;
