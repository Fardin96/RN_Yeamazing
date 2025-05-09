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

export interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}
