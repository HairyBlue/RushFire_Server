import storage from "../firebase"
// import firebaseApp from "firebase/app"
import { ref, uploadBytes, getDownloadURL} from "firebase/storage"

const imageupload =async (originalname: string, buffer: any) => { 

    const originalFileExtension = originalname.split('.').pop();
    const fileBuffer = Uint8Array.from(buffer)

    // Generate custom file path
    const customFilePath = generateCustomFilePath(originalname); 
    const filePath = `image/${customFilePath}`;

    const storageRef = ref(storage, filePath)
    try {
        await uploadBytes(storageRef, fileBuffer, { contentType: `image/${originalFileExtension}` });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
    // Generate a signed URL with an expiration time (e.g., 1 hour)
    //const expirationDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    //const expirationTime = Date.now() + expirationDuration;
    const url = await getDownloadURL(storageRef)
    //const signedURL = `${url}?expires=${expirationTime}`;

    //console.log('Signed URL:', url);
    return {customFilePath, url}

}

function generateCustomFilePath(originalname: any) {
    // Implement your custom logic to generate the file path
    // Example: Add a timestamp to the filename
    const timestamp = Date.now();
    return `${timestamp}_${originalname}`;
  }


  export default imageupload