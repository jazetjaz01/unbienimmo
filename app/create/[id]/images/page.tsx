// app/create/[id]/images/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';

export default function UploadImagesPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /* --------------------------------
     Dropzone
  -------------------------------- */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setUploadError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: isUploading,
  });

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(file => file.name !== fileName));
  };

  /* --------------------------------
     Finalisation
  -------------------------------- */
  const handleFinalize = async () => {
    if (files.length === 0) {
      alert('Veuillez ajouter au moins une image.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      /* -------------------------------
         1️⃣ Récupérer l’utilisateur
      -------------------------------- */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }

      /* -------------------------------
         2️⃣ Récupérer le professional lié (OPTION 1)
      -------------------------------- */
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      const professionalId = professional?.id ?? null;

      /* -------------------------------
         3️⃣ Upload des images
      -------------------------------- */
      const uploadedPaths: { path: string; index: number }[] = [];
      const basePath = `${listingId}/`;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = basePath + fileName;

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        uploadedPaths.push({ path: filePath, index: i });
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      /* -------------------------------
         4️⃣ Insertion des images
      -------------------------------- */
      const imagesToInsert = uploadedPaths.map(item => ({
        listing_id: listingId,
        image_url: item.path,
        sort_order: item.index + 1,
      }));

      const { error: imageInsertError } = await supabase
        .from('listing_images')
        .insert(imagesToInsert);

      if (imageInsertError) {
        throw new Error(imageInsertError.message);
      }

      /* -------------------------------
         5️⃣ Publication + professional_id
      -------------------------------- */
      const { error: publishError } = await supabase
        .from('listings')
        .update({
          is_published: true,
          professional_id: professionalId, // ✅ OPTION 1
        })
        .eq('id', listingId);

      if (publishError) {
        throw new Error(publishError.message);
      }

      alert('Annonce publiée avec succès 🎉');
      router.push('/listings');

    } catch (error: any) {
      console.error(error);
      setUploadError(error.message || 'Erreur inconnue');
    } finally {
      setIsUploading(false);
    }
  };

  /* --------------------------------
     Render
  -------------------------------- */
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Étape 2 : Ajouter les images</h1>
      <p className="mb-6 text-gray-600">
        ID de l'annonce : <strong>{listingId}</strong>
      </p>

      <div
        {...getRootProps()}
        className={`p-10 border-dashed border-2 rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-500">
          Glissez-déposez des images ici ou cliquez pour sélectionner
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">
            Fichiers ({files.length})
          </h2>
          <ul className="space-y-2">
            {files.map(file => (
              <li
                key={file.name}
                className="flex justify-between items-center text-sm p-2 border rounded"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-red-500"
                >
                  [X]
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && (
        <p className="mt-4 text-blue-600">
          Téléchargement : {uploadProgress}%
        </p>
      )}

      {uploadError && (
        <p className="mt-4 text-red-500">{uploadError}</p>
      )}

      <button
        onClick={handleFinalize}
        disabled={isUploading || files.length === 0}
        className="w-full mt-6 p-3 bg-green-600 text-white rounded font-bold disabled:bg-gray-400"
      >
        {isUploading
          ? 'Publication en cours...'
          : "Publier l'annonce"}
      </button>

      <button
        onClick={() => router.push('/create')}
        className="w-full mt-2 text-gray-500"
      >
        Retour
      </button>
    </div>
  );
}
