import {Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const selectImage = async (setFormData, formData): Promise<void> => {
  // Now actually launch the image library
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setFormData({...formData, imageUri: result.assets[0].uri || ''});
    }
  } catch (error) {
    console.error('Error selecting image:', error);
    Alert.alert('Error', 'Failed to select image');
  }
};

export const captureImage = async (setFormData, formData): Promise<void> => {
  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    saveToPhotos: true,
  });

  if (result.assets && result.assets.length > 0) {
    setFormData({...formData, imageUri: result.assets[0].uri || ''});
  }
};
