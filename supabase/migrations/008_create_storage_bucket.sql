-- Create storage bucket for progress photos
-- Note: Storage buckets are typically created via Supabase dashboard or CLI
-- This migration sets up the policies for the bucket

-- Insert storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for progress-photos bucket

-- Allow public read access to all files
CREATE POLICY "Public can view progress photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'progress-photos');

-- Allow admins to upload files
CREATE POLICY "Admins can upload progress photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update files
CREATE POLICY "Admins can update progress photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'progress-photos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'progress-photos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete files
CREATE POLICY "Admins can delete progress photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
