import React, {useState, useRef} from 'react';
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
  //   PermissionsAndroid,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation} from '@react-navigation/native';
import {AddTravelLogNavigationProp} from '../../types/navigation';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';
import {addTravelLog} from '../../utils/functions/travelLogFunctions';
import {TravelLogFormData} from '../../types/travelLog';
import {GooglePlacesInput} from '../../components/Input/GooglePlaceInput';

export const AddTravelLog = (): React.JSX.Element => {
  const navigation = useNavigation<AddTravelLogNavigationProp>();
  const [formData, setFormData] = useState<TravelLogFormData>({
    imageUri: '',
    location: '',
    dateTime: new Date(),
    details: '',
  });

  const [showIOSPicker, setShowIOSPicker] = useState<{
    show: boolean;
    mode: 'date' | 'time';
  }>({
    show: false,
    mode: 'date',
  });

  const currentPickerMode = useRef<'date' | 'time'>('date');

  const [loading, setLoading] = useState<boolean>(false);

  //   const requestGalleryPermission = async (): Promise<boolean> => {
  //     console.log('+-----------------------PERMISSIONS---------------------+');
  //     if (Platform.OS === 'android') {
  //       const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  //       const hasPermission = await PermissionsAndroid.check(permission);
  //       console.log('permission', permission);
  //       console.log('hasPermission', hasPermission);
  //       if (!hasPermission) {
  //         const status = await PermissionsAndroid.request(permission);
  //         console.log('status', status);
  //         return status === 'granted';
  //       }
  //       return true;
  //     }
  //     return true;
  //   };

  //   const requestCameraPermission = async (): Promise<boolean> => {
  //     if (Platform.OS === 'android') {
  //       const cameraPermission = PermissionsAndroid.PERMISSIONS.Camera result:CAMERA;
  //       const storagePermission =
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  //       const hasCameraPermission = await PermissionsAndroid.check(
  //         cameraPermission,
  //       );
  //       const hasStoragePermission = await PermissionsAndroid.check(
  //         storagePermission,
  //       );

  //       if (!hasCameraPermission || !hasStoragePermission) {
  //         const cameraStatus = await PermissionsAndroid.request(cameraPermission);
  //         const storageStatus = await PermissionsAndroid.request(
  //           storagePermission,
  //         );

  //         return cameraStatus === 'granted' && storageStatus === 'granted';
  //       }
  //       return true;
  //     }
  //     return true; // iOS handles permissions
  //   };

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

      // console.log('Image library result:', result);

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

    // console.log('Camera result:', result);

    if (result.assets && result.assets.length > 0) {
      setFormData({...formData, imageUri: result.assets[0].uri || ''});
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    // Handle dismissal for iOS
    if (event.type === 'dismissed') {
      setShowIOSPicker({...showIOSPicker, show: false});
      return;
    }

    // Only proceed if we have a new date
    if (!selectedDate) {
      return;
    }

    // Create a new date object based on the current value
    const newDateTime = new Date(formData.dateTime.getTime());

    // Use the appropriate mode based on platform
    const isDateMode =
      Platform.OS === 'ios'
        ? showIOSPicker.mode === 'date'
        : currentPickerMode.current === 'date';

    if (isDateMode) {
      // Update date portion only
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
    } else {
      // Update time portion only
      newDateTime.setHours(selectedDate.getHours());
      newDateTime.setMinutes(selectedDate.getMinutes());
      newDateTime.setSeconds(selectedDate.getSeconds());
    }

    // Update form data with the new date
    setFormData({...formData, dateTime: newDateTime});

    // For iOS, hide the picker after selection
    if (Platform.OS === 'ios') {
      setShowIOSPicker({...showIOSPicker, show: false});
    }
  };

  // Open date or time picker based on platform
  const showPicker = (mode: 'date' | 'time') => {
    // Store the current mode in ref for Android to use
    currentPickerMode.current = mode;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: formData.dateTime,
        onChange: handleDateChange,
        mode: mode,
        is24Hour: true,
      });
    } else {
      // For iOS, show the picker inline
      setShowIOSPicker({show: true, mode});
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };

  // Simplified time formatter using explicit parts
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format as HH:MM (24-hour)
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;

    // Alternative: AM/PM format
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    // return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // const uploadImage = async (uri: string): Promise<string> => {
  //   const filename = uri.substring(uri.lastIndexOf('/') + 1);
  //   const storageRef = storage().ref(`travel_logs/${filename}`);
  //   await storageRef.putFile(uri);
  //   return storageRef.getDownloadURL();
  // };

  const handleSave = async () => {
    console.log('handleSave started');
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
      console.log('Before addTravelLog');
      const logId = await addTravelLog(
        formData.imageUri,
        formData.location,
        formData.dateTime.getTime(),
        formData.details,
      );
      console.log('After addTravelLog, logId:', logId);

      // if (logId) {
      //   setLoading(false);
      //   navigation.goBack();
      // }
    } catch (error) {
      console.error('Error saving travel log (handleSave):', error);
      setLoading(false);
      Alert.alert('Error saving travel log');
    }
    // finally {
    //   console.log('handleSave finally block');
    //   // setLoading(false); // Moved inside try and catch
    //   // navigation.goBack(); // Moved inside the if (logId) block for success
    // }
    // console.log('handleSave finished (outside try/catch/finally)');
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

          <GooglePlacesInput
            onPress={() => {
              console.log('GooglePlacesInput onPress');
            }}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date and Time</Text>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, styles.dateButton]}
              onPress={() => showPicker('date')}>
              <Text style={styles.dateTimeText}>
                {formatDate(formData.dateTime)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, styles.timeButton]}
              onPress={() => showPicker('time')}>
              <Text style={styles.dateTimeText}>
                {formatTime(formData.dateTime)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* iOS inline picker */}
          {Platform.OS === 'ios' && showIOSPicker.show && (
            <DateTimePicker
              value={formData.dateTime}
              mode={showIOSPicker.mode}
              display="spinner"
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
          onPress={() => {
            handleSave();
            setInterval(() => {
              setLoading(false);
              navigation.navigate('MainTabs');
            }, 3000);
          }}
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  dateButton: {
    flex: 3,
    marginRight: 8,
  },
  timeButton: {
    flex: 2,
  },
  dateTimeText: {
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
