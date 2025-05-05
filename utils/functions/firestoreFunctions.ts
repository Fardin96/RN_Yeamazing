import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import {savedVids} from '../../types/userData';
// import {comment, video} from '../../types/video';

export async function addUser(
  authToken: string,
  userId: string,
  name: string,
  email: string,
  userPhotoUrl: string,
  likedVideos: string[] = [],
  savedVideos: savedVids[] = [],
): Promise<void> {
  await firestore()
    .collection('Users')
    .add({
      userId,
      authToken,
      name,
      email,
      userPhotoUrl,
      likedVideos,
      savedVideos,
    })
    .then(() => {
      console.log('User added!');
      Alert.alert('User added!');
    })
    .catch(error => {
      console.warn('Error adding user:', error);
    });
}

// export async function addVideo(
//   videoId: string,
//   videoTitle: string,
//   videoThumbnail: string,
//   videoUrl: string,
//   likes: number = 0,
//   comments: comment[] = [],
// ): Promise<void> {
//   await firestore()
//     .collection('Videos')
//     .add({
//       videoId,
//       videoTitle,
//       videoThumbnail,
//       videoUrl,
//       likes,
//       comments,
//     })
//     .then(() => {
//       console.log('Video added!');
//       Alert.alert('Video added!');
//     })
//     .catch(error => {
//       console.warn('Error adding video:', error);
//     });
// }

// export async function fetchVideoIfExists(
//   videoId: string,
// ): Promise<video | null> {
//   try {
//     const videoRef = firestore()
//       .collection('Videos')
//       .where('videoId', '==', videoId);

//     const snapshot = await videoRef.get();

//     if (snapshot.empty) {
//       // console.log('Video does not exist in Firestore.');
//       return null;
//     }

//     const videoDoc = snapshot.docs[0];
//     const videoData = videoDoc.data();

//     return {
//       videoId: videoData.videoId,
//       videoTitle: videoData.videoTitle,
//       videoThumbnail: videoData.videoThumbnail,
//       videoUrl: videoData.videoUrl,
//       likes: videoData.likes,
//       comments: videoData.comments || [],
//     };
//   } catch (error) {
//     console.error('Error fetching video:', error);
//     throw new Error('Could not fetch video');
//   }
// }

// export async function likeHandler(
//   userId: string,
//   videoId: string,
//   increment: boolean,
// ): Promise<void> {
//   const db = firestore();

//   try {
//     // Reference to the Users collection
//     const userRef = db.collection('Users').where('userId', '==', userId);
//     const userSnapshot = await userRef.get();

//     if (userSnapshot.empty) {
//       console.warn('User not found');
//       Alert.alert('Error', 'User not found');
//       return;
//     }

//     const userDoc = userSnapshot.docs[0];
//     const userData = userDoc.data();
//     const likedVideos = userData.likedVideos || [];

//     // Update user's likedVideos array
//     if (increment) {
//       if (!likedVideos.includes(videoId)) {
//         likedVideos.push(videoId);
//       } else {
//         console.log('Video already liked by user');
//         return;
//       }
//     } else {
//       const index = likedVideos.indexOf(videoId);
//       if (index !== -1) {
//         likedVideos.splice(index, 1);
//       } else {
//         console.log('Video not liked by user');
//         return;
//       }
//     }

//     await userDoc.ref.update({likedVideos});

//     // Reference to the Videos collection
//     const videoRef = db.collection('Videos').where('videoId', '==', videoId);
//     const videoSnapshot = await videoRef.get();

//     if (videoSnapshot.empty) {
//       console.warn('Video not found');
//       Alert.alert('Error', 'Video not found');
//       return;
//     }

//     const videoDoc = videoSnapshot.docs[0];
//     const videoData = videoDoc.data();
//     const currentLikes = videoData.likes || 0;

//     // Update video's likes count
//     const newLikes = increment
//       ? currentLikes + 1
//       : Math.max(currentLikes - 1, 0);

//     await videoDoc.ref.update({likes: newLikes});
//   } catch (error) {
//     console.error('Error in likeHandler:', error);
//     Alert.alert('Error', 'Could not update like information');
//   }
// }

// export async function isVideoLiked(
//   userId: string | null | undefined,
//   videoId: string,
// ): Promise<boolean | undefined> {
//   const db = firestore();

//   try {
//     // Reference to the Users collection
//     const userRef = db.collection('Users').where('userId', '==', userId);
//     const userSnapshot = await userRef.get();

//     if (userSnapshot.empty) {
//       console.warn('User not found');
//       Alert.alert('Error', 'User not found');
//       return false;
//     }

//     const userDoc = userSnapshot.docs[0];
//     const userData = userDoc.data();
//     const likedVideos = userData.likedVideos || [];

//     return likedVideos.includes(videoId);
//   } catch (error) {
//     console.error('Error in like-finder:', error);
//     Alert.alert('Error', 'Could not find like information');
//   }
// }
