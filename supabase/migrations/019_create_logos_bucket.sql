-- Create storage bucket for business logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to logos
CREATE POLICY "Allow public read access to logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Allow admin to upload logos
CREATE POLICY "Allow admin to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'logos' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Allow admin to update logos
CREATE POLICY "Allow admin to update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'logos' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Allow admin to delete logos
CREATE POLICY "Allow admin to delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'logos' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);
