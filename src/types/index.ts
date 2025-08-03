import { FieldValue, Timestamp } from "firebase/firestore";
export interface user{
    id:string;
    name:string;
    email:string;
    imageUrl:string;
    createdAt:Timestamp|FieldValue;
    updatedAt:Timestamp|FieldValue;
}