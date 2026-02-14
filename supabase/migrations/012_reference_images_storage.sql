-- Migration: Reference Images Storage
-- This migration sets up Supabase Storage for order reference images

-- Note: Storage bucket creation must be done manually via Supabase dashboard or CLI
-- Run: supabase storage create-bucket order-reference-images --public

-- RLS Policies for reference images storage
-- These policies ensure clients can only upload to their own order folders

-- Allow clients to upload images to their own orders
CREATE POLICY "Clients can upload reference images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-reference-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id FROM orders WHERE client_id = auth.uid()
  )
);

-- Allow clients to view images in their own orders
CREATE POLICY "Clients can view own reference images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-reference-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id FROM orders WHERE client_id = auth.uid()
  )
);

-- Allow admins to view all reference images
CREATE POLICY "Admins can view all reference images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-reference-images'
  AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow clients to delete images from their own orders
CREATE POLICY "Clients can delete own reference images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-reference-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id FROM orders WHERE client_id = auth.uid()
  )
);
