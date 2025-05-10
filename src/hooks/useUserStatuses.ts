import {useEffect} from 'react';
import {useAppDispatch} from '../rtk/hooks';
import {updateUserPresence} from '../rtk/slices/chatSlice';
import {subscribeToUserStatus} from '../utils/firebase/chatFirebase';

/**
 * Hook to subscribe to user statuses for a list of users
 */
export const useUserStatuses = (userIds: string[]) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userIds.length === 0) return;

    // Subscribe to status updates
    const unsubscribe = subscribeToUserStatus(userIds, statuses => {
      // Update each status in Redux
      statuses.forEach(status => {
        dispatch(updateUserPresence(status));
      });
    });

    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, [dispatch, userIds]);
};
