import { db, storage } from './firebase';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EtymologyData } from '@/app/components/TriptychDisplay';

export interface WordDocument {
    slug: string;
    term: string;
    etymology: EtymologyData;
    created_at: any; // Timestamp
}

export const cleanSlug = (term: string) => term.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');

// Helper: Upload Blob to Storage
export async function persistAsset(url: string, path: string): Promise<string> {
    try {
        // If it's already a firebase URL, skip
        if (url.includes('firebasestorage')) return url;
        if (url.startsWith('/')) return url; // placeholders

        console.log(`Persisting asset to ${path}...`);
        const response = await fetch(url);
        const blob = await response.blob();

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        const permUrl = await getDownloadURL(storageRef);
        console.log(`Asset persisted: ${permUrl}`);
        return permUrl;
    } catch (error) {
        console.error("Asset persistence failed:", error);
        return url; // Fallback to temp
    }
}

// 1. Check Cache
export async function getCachedWord(term: string): Promise<WordDocument | null> {
    const slug = cleanSlug(term);
    if (!slug) return null;

    try {
        const docRef = doc(db, "words", slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`[Cache Hit] Word: ${slug}`);
            return docSnap.data() as WordDocument;
        } else {
            console.log(`[Cache Miss] Word: ${slug}`);
            return null;
        }
    } catch (error) {
        console.error("Error reading cache:", error);
        return null;
    }
}

// 2. Save New Word (and persist image)
export async function saveWordToCache(term: string, data: EtymologyData) {
    const slug = cleanSlug(term);
    if (!slug) return;

    try {
        // Persist Image first
        if (data.image_url) {
            data.image_url = await persistAsset(data.image_url, `words/${slug}/image_main.jpg`);
        }

        const docRef = doc(db, "words", slug);
        await setDoc(docRef, {
            slug,
            term: data.word,
            etymology: data,
            created_at: Timestamp.now()
        });
        console.log(`[Cache Saved] Word: ${slug}`);
    } catch (error) {
        console.error("Error saving to cache:", error);
    }
}

// 3. Update Video/Image Asset
export async function updateWordAsset(term: string, assetType: 'image_url' | 'video_url', url: string) {
    const slug = cleanSlug(term);
    if (!slug) return;

    try {
        let permUrl = url;
        // Persist Video/Image
        if (assetType === 'video_url') {
            permUrl = await persistAsset(url, `words/${slug}/video_main.mp4`);
        }

        const docRef = doc(db, "words", slug);
        // We update the nested etymology object
        await updateDoc(docRef, {
            [`etymology.${assetType}`]: permUrl
        });
        console.log(`[Asset Updated] ${assetType} for ${slug}`);
    } catch (error) {
        console.error("Error updating asset:", error);
    }
}
