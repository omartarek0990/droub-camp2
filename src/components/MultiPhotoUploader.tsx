import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ItemPhoto, Language } from '../types';
import { UploadCloud, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface MultiPhotoUploaderProps {
  itemType: 'room' | 'package' | 'trip';
  itemKey: string;
  itemTitle?: string;
  currentPhotos: ItemPhoto[];
  onPhotosChange: (newPhotos: ItemPhoto[]) => void;
  onKeyAssigned?: (generatedKey: string) => void;
  lang: Language;
  showFeedback: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const MultiPhotoUploader: React.FC<MultiPhotoUploaderProps> = ({
  itemType,
  itemKey,
  itemTitle,
  currentPhotos,
  onPhotosChange,
  onKeyAssigned,
  lang,
  showFeedback,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAr = lang === 'ar';

  const t = {
    title: isAr ? 'معرض صور العنصر (صور متعددة)' : 'Multiple Photo Gallery',
    subtitle: isAr
      ? 'ارفع عدة صور معاً لتظهر في سلايدر الصور التفاعلي في الموقع (مثل مواقع الفنادق العالمية)'
      : 'Upload multiple photos at once to display in an interactive photo carousel for guests',
    dragOrClick: isAr
      ? 'اضغط لاختيار صور متعددة من جهازك أو اسحب الصور هنا'
      : 'Click to select multiple photos or drag & drop files here',
    uploading: isAr ? 'جارٍ رفع الصور...' : 'Uploading photos...',
    formatHint: isAr
      ? 'يدعم صور JPG, PNG, WebP (حتى 15 ميجابايت لكل صورة)'
      : 'Supports JPG, PNG, WebP (up to 15MB per image)',
    noPhotos: isAr
      ? 'لم يتم رفع صور لهذا العنصر حتى الآن. اختر أو اسحب صوراً في الأعلى.'
      : 'No photos uploaded for this item yet. Select or drop images above.',
    deleteSuccess: isAr ? 'تم حذف الصورة بنجاح' : 'Photo deleted successfully',
    uploadSuccess: isAr ? 'تم رفع وحفظ الصور بنجاح!' : 'Photos uploaded and saved successfully!',
    primaryLabel: isAr ? 'الرئيسية' : 'Cover',
  };

  // Upload handler for multiple selected files
  const handleUploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    let targetKey = itemKey?.trim();
    if (!targetKey) {
      targetKey = `draft_${itemType}_${Date.now()}`;
      if (onKeyAssigned) {
        onKeyAssigned(targetKey);
      }
    }

    const fileArray = Array.from(files);
    setIsUploading(true);

    const newlyAdded: ItemPhoto[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(
        isAr
          ? `جارٍ رفع الصورة ${i + 1} من ${fileArray.length}...`
          : `Uploading image ${i + 1} of ${fileArray.length}...`
      );

      // Validate file type
      if (!file.type.startsWith('image/')) {
        failCount++;
        showFeedback(
          'error',
          isAr
            ? `الملف "${file.name}" ليس صورة صالحة.`
            : `File "${file.name}" is not a valid image format.`
        );
        continue;
      }

      // Validate file size (15MB)
      if (file.size > 15 * 1024 * 1024) {
        failCount++;
        showFeedback(
          'error',
          isAr
            ? `حجم الصورة "${file.name}" يتجاوز الحد الأقصى 15 ميجابايت.`
            : `Image "${file.name}" exceeds the 15MB limit.`
        );
        continue;
      }

      try {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanFileName = `jazz_${itemType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        // 1. Upload to Supabase Storage bucket 'images'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(cleanFileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          failCount++;
          showFeedback(
            'error',
            isAr
              ? `فشل رفع "${file.name}": ${uploadError.message}`
              : `Failed to upload "${file.name}": ${uploadError.message}`
          );
          continue;
        }

        // 2. Get public URL
        const { data: publicData } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);

        const publicUrl = publicData?.publicUrl;
        if (!publicUrl) {
          failCount++;
          continue;
        }

        // 3. Insert row into item_photos table
        const orderNum = currentPhotos.length + newlyAdded.length + 1;
        const { data: insertedRow, error: insertError } = await supabase
          .from('item_photos')
          .insert({
            item_type: itemType,
            item_key: targetKey,
            image_url: publicUrl,
            display_order: orderNum,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Database insert error:', insertError);
          failCount++;
          showFeedback(
            'error',
            isAr
              ? `تم رفع الملف ولكن فشل حفظ السجل: ${insertError.message}`
              : `Uploaded file but failed to record in database: ${insertError.message}`
          );
          continue;
        }

        if (insertedRow) {
          newlyAdded.push(insertedRow as ItemPhoto);
          successCount++;
        }
      } catch (err: any) {
        console.error('Exception during upload:', err);
        failCount++;
        showFeedback(
          'error',
          `${isAr ? 'خطأ أثناء رفع' : 'Error uploading'} ${file.name}: ${err.message || ''}`
        );
      }
    }

    setIsUploading(false);
    setUploadProgress(null);

    if (newlyAdded.length > 0) {
      const updated = [...currentPhotos, ...newlyAdded];
      onPhotosChange(updated);
      showFeedback(
        'success',
        isAr
          ? `تم رفع ${successCount} صورة بنجاح!`
          : `Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}!`
      );
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete a single photo
  const handleDeletePhoto = async (photo: ItemPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      !confirm(
        isAr
          ? 'هل أنت متأكد من رغبتك في حذف هذه الصورة نهائياً؟'
          : 'Are you sure you want to delete this photo permanently?'
      )
    ) {
      return;
    }

    try {
      setDeletingId(photo.id);

      // 1. Delete from item_photos table
      const { error: dbError } = await supabase
        .from('item_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) {
        showFeedback(
          'error',
          `${isAr ? 'فشل حذف الصورة' : 'Failed to delete photo'}: ${dbError.message}`
        );
        return;
      }

      // 2. Try to remove from storage if it belongs to our bucket (best effort)
      try {
        const parts = photo.image_url.split('/images/');
        if (parts.length > 1) {
          const storagePath = parts[1];
          await supabase.storage.from('images').remove([storagePath]);
        }
      } catch {
        // ignore storage cleanup errors
      }

      // 3. Update local state immediately
      const updated = currentPhotos.filter((p) => p.id !== photo.id);
      onPhotosChange(updated);
      showFeedback('success', t.deleteSuccess);
    } catch (err: any) {
      showFeedback('error', `${isAr ? 'خطأ' : 'Error'}: ${err.message || ''}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#0F223D] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#D94E28]" />
            <span>{t.title}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#0F223D]/10 text-[#0F223D] text-xs font-mono">
              {currentPhotos.length}
            </span>
          </h4>
          <p className="font-['Tajawal'] text-xs text-[#64748B] mt-0.5">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Hidden Native File Input (Accepts Multiple Files) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleUploadFiles(e.target.files);
          }
        }}
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) {
            handleUploadFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#D94E28] bg-[#FFF1ED]'
            : 'border-[#CBD5E1] hover:border-[#D94E28] hover:bg-white bg-white/60'
        } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#D94E28] animate-spin" />
            <span className="font-['Cairo'] font-bold text-sm text-[#0F223D]">
              {uploadProgress || t.uploading}
            </span>
            <span className="font-['Tajawal'] text-xs text-[#64748B]">
              {isAr
                ? 'يرجى الانتظار لحين اكتمال الرفع والحفظ...'
                : 'Please wait while photos are uploaded and saved...'}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1ED] text-[#D94E28] flex items-center justify-center shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="font-['Cairo'] font-bold text-xs sm:text-sm text-[#0F223D]">
                {t.dragOrClick}
              </p>
              <p className="font-['Tajawal'] text-xs text-[#64748B] mt-0.5">
                {t.formatHint}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery of Uploaded Photos */}
      {currentPhotos.length > 0 ? (
        <div className="space-y-2">
          <span className="text-[11px] font-['Cairo'] font-bold text-[#64748B] block">
            {isAr ? 'الصور المرفوعة لهذا العنصر:' : 'Uploaded photos for this item:'}
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {currentPhotos.map((photo, idx) => (
              <div
                key={photo.id || idx}
                className="relative group rounded-xl overflow-hidden bg-[#E2E8F0] aspect-square border border-[#CBD5E1] shadow-xs"
              >
                <img
                  src={photo.image_url}
                  alt={`Item photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />

                {/* Primary / Index Badge */}
                <div className="absolute top-1.5 start-1.5 z-10">
                  <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                    {idx === 0 ? t.primaryLabel : `#${idx + 1}`}
                  </span>
                </div>

                {/* Delete Button (with explicit type="button") */}
                <button
                  type="button"
                  disabled={deletingId === photo.id}
                  onClick={(e) => handleDeletePhoto(photo, e)}
                  title={isAr ? 'حذف هذه الصورة' : 'Delete this photo'}
                  className="absolute top-1.5 end-1.5 z-10 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-sm opacity-90 hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-white/60 border border-[#E2E8F0] text-center text-xs text-[#64748B] font-['Tajawal']">
          {t.noPhotos}
        </div>
      )}
    </div>
  );
};
