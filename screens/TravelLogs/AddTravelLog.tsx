import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation} from '@react-navigation/native';
import {AddTravelLogNavigationProp} from '../../types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {addTravelLog} from '../../utils/functions/travelLogFunctions';
import {TravelLogFormData} from '../../types/travelLog';

export const AddTravelLog = (): React.JSX.Element => {
  const navigation = useNavigation<AddTravelLogNavigationProp>();
  const [formData, setFormData] = useState<TravelLogFormData>({
    imageUri: '',
    location: '',
    dateTime: new Date(),
    details: '',
  });
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const requestGalleryPermission = async (): Promise<boolean> => {
    console.log('+-----------------------PERMISSIONS---------------------+');
    if (Platform.OS === 'android') {
      const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const hasPermission = await PermissionsAndroid.check(permission);
      console.log('permission', permission);
      console.log('hasPermission', hasPermission);
      if (!hasPermission) {
        const status = await PermissionsAndroid.request(permission);
        console.log('status', status);
        return status === 'granted';
      }
      return true;
    }
    return true;
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const cameraPermission = PermissionsAndroid.PERMISSIONS.CAMERA;
      const storagePermission =
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasCameraPermission = await PermissionsAndroid.check(
        cameraPermission,
      );
      const hasStoragePermission = await PermissionsAndroid.check(
        storagePermission,
      );

      if (!hasCameraPermission || !hasStoragePermission) {
        const cameraStatus = await PermissionsAndroid.request(cameraPermission);
        const storageStatus = await PermissionsAndroid.request(
          storagePermission,
        );

        return cameraStatus === 'granted' && storageStatus === 'granted';
      }
      return true;
    }
    return true; // iOS handles permissions
  };

  const selectImage = async (): Promise<void> => {
    // const hasPermission = await requestGalleryPermission();
    // console.log('hasPermission', hasPermission);

    // if (!hasPermission) {
    //   Alert.alert(
    //     'Permission Required',
    //     'Storage access is required to select images. Please enable it in app settings.',
    //     [
    //       {text: 'Cancel', style: 'cancel'},
    //       {
    //         text: 'Open Settings',
    //         onPress: () => {
    //           // Open app settings so user can enable permissions
    //           if (Platform.OS === 'ios') {
    //             Linking.openURL('app-settings:');
    //           } else {
    //             Linking.openSettings();
    //           }
    //         },
    //       },
    //     ],
    //   );
    //   return;
    // }

    // Now actually launch the image library
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      console.log('Image library result:', result);

      if (result.assets && result.assets.length > 0) {
        setFormData({...formData, imageUri: result.assets[0].uri || ''});
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const captureImage = async (): Promise<void> => {
    // const hasPermission = await requestCameraPermission();
    // if (!hasPermission) {
    //   Alert.alert(
    //     'Permission denied',
    //     'Camera and storage permissions are required to take photos',
    //   );
    //   return;
    // }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });

    console.log('Camera result:', result);

    if (result.assets && result.assets.length > 0) {
      setFormData({...formData, imageUri: result.assets[0].uri || ''});
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({...formData, dateTime: selectedDate});
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`travel_logs/${filename}`);
    await storageRef.putFile(uri);
    return storageRef.getDownloadURL();
  };

  const handleSave = async () => {
    if (!formData.location || !formData.details) {
      Alert.alert('Please fill in all fields');
      return;
    }

    if (!formData.imageUri) {
      Alert.alert('Please select an image');
      return;
    }

    setLoading(true);
    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(formData.imageUri);

      // Add travel log to Firestore
      const logId = await addTravelLog(
        imageUrl,
        formData.location,
        formData.dateTime.getTime(),
        formData.details,
      );

      if (logId) {
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving travel log:', error);
      setLoading(false);
      Alert.alert('Error saving travel log');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* <Text style={styles.title}>Add Travel Log</Text> */}

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => selectImage()}>
          {formData.imageUri ? (
            <Image
              source={{uri: formData.imageUri}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Tap to select an image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => selectImage()}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => captureImage()}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#888"
            value={formData.location}
            onChangeText={text => setFormData({...formData, location: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date and Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {formData.dateTime.toLocaleString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateTime}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter details about your trip"
            placeholderTextColor="#888"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={formData.details}
            onChangeText={text => setFormData({...formData, details: text})}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Travel Log</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    height: 120,
  },
  datePickerButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#555',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});
