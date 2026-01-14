import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, `${path}/${uuidv4()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

export const uploadMultipleFiles = async (files: File[], path: string) => {
    const promises = files.map(file => uploadFile(file, path));
    return Promise.all(promises);
};
