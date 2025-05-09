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
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation} from '@react-navigation/native';
import {AddTravelLogNavigationProp} from '../../types/navigation';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {addTravelLog} from '../../rtk/slices/travelLogSlice';
import {TravelLogFormData} from '../../types/travelLog';
import {useAppDispatch} from '../../rtk/hooks';
import {formatTime} from '../../utils/functions/timeDate';
import {formatDate} from '../../utils/functions/timeDate';
import {captureImage, selectImage} from '../../utils/functions/cameraUtils';

export const AddTravelLog = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
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
      await dispatch(addTravelLog(formData));
    } catch (error) {
      console.error('Error saving travel log (handleSave):', error);
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
          onPress={() => selectImage(setFormData, formData)}>
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
            onPress={() => selectImage(setFormData, formData)}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => captureImage(setFormData, formData)}>
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
