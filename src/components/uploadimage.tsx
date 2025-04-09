/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ImageUpload.tsx
'use client';

import React, { useState } from 'react';
import { Button, CircularProgress, Grid, Snackbar, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

const ImageUpload = ({setRefetch} : {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);


  const [title, setTitle] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles([...files, ...Array.from(selectedFiles)]);

    }
  };

  const handleImageUpload = async () => {
    setIsUploading(true);
    setSnackbarMessage('');
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);

      });

      formData.append('title', title);


      const response = await fetch('/api', {
        method: 'POST',
        body: formData,
      });


      if (response.ok) {
        setRefetch(true)

        setSnackbarMessage('Images uploaded successfully!');
      } else {
        setSnackbarMessage('Failed to upload images.');
      }
    } catch (error: any) {
      setSnackbarMessage('An error occurred while uploading images.');
    } finally {
      setIsUploading(false);
      setOpenSnackbar(true);
    }


  };



  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-4 bg-gray-700"
    >

      {
        files.length > 0 && (
          <div
            className='grid grid-cols-6 gap-4'

          >
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                  style={{ width: '100%', height: '100%' }}
                />
                <Typography variant="caption" className="absolute bottom-0 left-0 bg-white p-1">
                  {file.name}
                </Typography>
              </div>
            ))}

          </div>
        )
      }
      <div>
        <Typography variant="h5" gutterBottom>
          Upload Images to Cloudinary
        </Typography>



        <input

          type="file"
          multiple
          onChange={handleFileChange}
          style={{ marginBottom: '20px' }}
        />

        <Button
          variant="contained"
          color="success"
          onClick={handleImageUpload}
          startIcon={<CloudUploadIcon />}
          disabled ={isUploading || files.length === 0}

          className='bg-green-900'

        >
          {isUploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>



        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          autoHideDuration={3000}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
