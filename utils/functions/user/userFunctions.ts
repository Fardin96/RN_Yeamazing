import {
  AUTH_TOKEN,
  USER_EMAIL,
  USER_ID,
  USER_NAME,
  USER_IMG,
} from '../../../assets/constants';
import {SignInResult} from '../../../types/userData';
import {setLocalData} from '../cachingFunctions';
import {addUser} from '../firestoreFunctions';

export async function storeUserData(signInResult: SignInResult): Promise<void> {
  await setLocalData(AUTH_TOKEN, signInResult.data.idToken || '');
  await setLocalData(USER_IMG, signInResult.data.user.photo || '');
  await setLocalData(USER_NAME, signInResult.data.user.name || '');
  await setLocalData(USER_ID, signInResult.data.user.id || '');
  await setLocalData(USER_EMAIL, signInResult.data.user.email || '');

  // storing in DB
  await addUser(
    signInResult.data.idToken || '',
    signInResult.data.user.id || '',
    signInResult.data.user.name || '',
    signInResult.data.user.email || '',
    signInResult.data.user.photo || '',
  );
}
