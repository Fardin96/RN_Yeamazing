export interface TravelLog {
  id?: string;
  userId: string;
  imageUrl: string;
  location: string;
  dateTime: number; // timestamp
  details: string;
  createdAt: number; // timestamp
}

export interface TravelLogFormData {
  imageUri: string;
  location: string;
  dateTime: Date;
  details: string;
}
