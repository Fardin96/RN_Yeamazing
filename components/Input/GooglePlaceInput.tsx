import React from 'react';
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAPS_API_KEY} from '@env';

interface GooglePlacesInputProps {
  onPress: (data: any, details: any) => void;
}

export function GooglePlacesInput({
  onPress,
}: GooglePlacesInputProps): React.ReactElement {
  return (
    // <GooglePlacesAutocomplete
    //   placeholder="Search"
    //   onPress={onPress}
    //   query={{
    //     key: GOOGLE_MAPS_API_KEY,
    //     language: 'en',
    //   }}
    //   currentLocation={true}
    //   currentLocationLabel="Current location"
    //   predefinedPlaces={[]}
    //   textInputProps={{placeholderTextColor: '#000'}}
    //   styles={{textInput: {fontSize: 16}}}
    //   enablePoweredByContainer={false}
    //   autoFillOnNotFound={false}
    //   debounce={0}
    //   disableScroll={false}
    //   enableHighAccuracyLocation={true}
    //   fetchDetails={false}
    //   filterReverseGeocodingByTypes={[]}
    //   GooglePlacesDetailsQuery={{}}
    //   GooglePlacesSearchQuery={{
    //     rankby: 'distance',
    //     type: 'restaurant',
    //   }}
    //   GoogleReverseGeocodingQuery={{}}
    //   isRowScrollable={true}
    //   keyboardShouldPersistTaps="always"
    //   listHoverColor="#ececec"
    //   listUnderlayColor="#c8c7cc"
    //   listViewDisplayed="auto"
    //   keepResultsAfterBlur={false}
    //   minLength={0}
    //   nearbyPlacesAPI="GooglePlacesSearch"
    //   numberOfLines={1}
    //   onFail={e => {
    //     console.warn('Google Place Failed : ', e);
    //   }}
    //   onNotFound={() => {}}
    //   onTimeout={() =>
    //     console.warn('google places autocomplete: request timeout')
    //   }
    //   predefinedPlacesAlwaysVisible={false}
    //   suppressDefaultStyles={false}
    //   textInputHide={false}
    //   timeout={20000}
    //   isNewPlacesAPI={false}
    //   fields="*"
    // />

    <></>
  );
}
