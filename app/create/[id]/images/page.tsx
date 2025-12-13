// app/create/[id]/images/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function UploadImagesPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const params = useParams();
  const listingId = params.id as string; // L'ID de l'annonce

  const [files, setFiles] = useState<File[]>([]); 
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 1. Configuration de Dropzone (inchangée)
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setUploadError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: isUploading 
  });

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };
  
  // 2. Logique de Finalisation (CORRIGÉE)
  const handleFinalize = async () => {
      if (files.length === 0) {
          alert("Veuillez ajouter au moins une image.");
          return;
      }
      
      setIsUploading(true);
      setUploadError(null);
      
      // ✅ MODIFIÉ : Stocker le chemin relatif (ex: 24/fichier.jpg)
      const uploadedPaths: { path: string, index: number }[] = []; 
      
      // Le chemin de base pour l'organisation (ex: 24/)
      const relativeBasePath = `${listingId}/`; 

      // A. TÉLÉVERSEMENT DE TOUS LES FICHIERS
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${Date.now()}_${file.name}`;
          
          // ✅ MODIFIÉ : Chemin DANS le bucket (ex: 24/17...facade-1.jpg)
          const filePathInBucket = relativeBasePath + fileName;

          try {
              // UPLOAD vers le chemin relatif (le bucket 'listings' est défini dans .from('listings'))
              const { error: uploadError } = await supabase.storage
                  .from('listings')
                  .upload(filePathInBucket, file, { cacheControl: '3600', upsert: false });

              if (uploadError) throw new Error(`Échec du téléchargement pour ${file.name}: ${uploadError.message}`);

              // ❌ Supprimé : l'appel à getPublicUrl est inutile ici.
              
              // ✅ ENREGISTREMENT : On stocke le chemin relatif du bucket.
              uploadedPaths.push({ path: filePathInBucket, index: i }); 
          
          } catch (error: any) {
              setUploadError(error.message);
              setIsUploading(false);
              return; 
          }
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // B. ENREGISTREMENT DES LIENS ET PUBLICATION
      // ✅ MODIFIÉ : Utiliser uploadedPaths et le champ 'path' (qui est le chemin minimal)
      const imagesToInsert = uploadedPaths.map(item => ({
          listing_id: listingId,
          image_url: item.path, // <--- C'est ici qu'on stocke '24/17...jpg'
          sort_order: item.index + 1, 
      }));

      const { error: imageInsertError } = await supabase
          .from('listing_images')
          .insert(imagesToInsert);
          
      // Mise à jour is_published = true
      const { error: publishError } = await supabase
          .from('listings')
          .update({ is_published: true })
          .eq('id', listingId);


      if (imageInsertError || publishError) {
          console.error("Erreur d'insertion/publication:", imageInsertError || publishError);
          setUploadError("Erreur critique après le téléchargement. Annulation.");
      } else {
          alert('Annonce publiée avec succès !');
          router.push(`/listings`);
      }

      setIsUploading(false);
  };
  
  // 3. Rendu (inchangé)
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Étape 2: Ajouter les images</h1>
      <p className="mb-6 text-gray-600">ID de l'annonce : **{listingId}**</p>

      {/* Rendu Dropzone basé sur useDropzone */}
      <div {...getRootProps()} className={`p-10 border-dashed border-2 rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-500'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-blue-700">Déposez les fichiers ici...</p>
        ) : (
          <p className="text-center text-gray-500">Glissez-déposez des images ici, ou cliquez pour sélectionner.</p>
        )}
      </div>

      {/* Liste des Fichiers et Prévisualisation (inchangée) */}
      {files.length > 0 && (
        <div className="mt-6 border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Fichiers à télécharger ({files.length}) :</h2>
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.name} className="flex justify-between items-center text-sm p-2 border rounded">
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} Mo)</span>
                <button type="button" onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 ml-4">
                  [X]
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Messages de Statut */}
      <div className="mt-6">
        {isUploading && (
          <div className="text-center">
            <p className="text-blue-600">Téléchargement en cours : {uploadProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </div>

      {/* Bouton de Finalisation */}
      <button 
        onClick={handleFinalize} 
        disabled={isUploading || files.length === 0}
        className={`w-full p-3 mt-6 text-white rounded font-bold transition ${
            isUploading || files.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isUploading ? 'Finalisation et publication...' : 'Publier l\'annonce avec images'}
      </button>

      <button onClick={() => router.push('/create')} className="w-full mt-2 text-gray-500 hover:text-gray-800">
        Retour à l'étape précédente
      </button>
    </div>
  );
}