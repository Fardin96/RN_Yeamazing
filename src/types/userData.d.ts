export type savedVids = {
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  videoUrl: string;
  videoDescription: string;
};

export type SignInResult = {
  type: string;
  data?: {
    scopes: string[];
    serverAuthCode: string | null;
    idToken: string | null;
    user: {
      photo: string | null;
      givenName: string | null;
      familyName: string | null;
      email: string | null;
      name: string | null;
      id: string | null;
    };
  };
};
