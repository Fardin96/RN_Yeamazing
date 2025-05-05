export type savedVids = {
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  videoUrl: string;
  videoDescription: string;
};

// Define the type for SignInResult
export type SignInResult = {
  type: string; // Changed from 'success' to string to accommodate 'cancelled'
  data?: {
    // Make data optional since it might not exist in cancelled responses
    scopes: string[]; // Array of scope strings
    serverAuthCode: string | null; // Can be null or a string
    idToken: string | null; // JWT token as a string
    user: {
      photo: string | null; // URL to the user's photo
      givenName: string | null; // User's first name
      familyName: string | null; // User's last name
      email: string | null; // User's email
      name: string | null; // User's full name
      id: string | null; // User's unique ID
    };
  };
};
