import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';

// Create a global navigation reference that can be accessed from anywhere
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Function to reset root navigation to a specific route
export function resetRoot(routeName: keyof RootStackParamList) {
  console.log('resetting to', routeName);

  // If navigation isn't ready, try again after a short delay
  if (!navigationRef.isReady()) {
    console.warn('Navigation not ready, scheduling reset...');
    setTimeout(() => resetRoot(routeName), 100);
    return;
  }

  // Navigation is ready, perform the reset
  navigationRef.resetRoot({
    index: 0,
    routes: [{name: routeName}],
  });
}

// Navigate to a specific screen
export function navigate<T extends keyof RootStackParamList>(
  routeName: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(routeName, params);
  } else {
    console.warn('Navigation is not ready yet for navigate');
  }
}

// Go back to previous screen
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  } else {
    console.warn('Cannot go back from this screen');
  }
}

// Log navigation state for debugging
export function logNavigationState() {
  if (navigationRef.isReady()) {
    const state = navigationRef.getState();
    console.log('=== NAVIGATION STATE DIAGNOSTIC ===');
    console.log('Current route:', navigationRef.getCurrentRoute());
    console.log('Navigation state:', JSON.stringify(state, null, 2));
    console.log('================================');
    return state;
  }
  return null;
}
