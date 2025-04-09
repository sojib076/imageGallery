/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import ImageUpload from "@/components/uploadimage";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Skeleton, Paper, IconButton, InputBase } from '@mui/material';
import { CleaningServicesOutlined, Delete, Search } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

type Ipagination ={
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pagination , setPagination] = useState<Ipagination>()


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api?page=${page}`);
        const data = await response.json();
        setImages(data.data);
        setPagination(data.pagination)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[] );



  const fetchMorePosts = async () => {
    const newpage = page +1
    
    const response = await fetch(`/api?page=${newpage}`);
    const data = await response.json();


    if (data ) {
      setImages((prevImages) => [...prevImages,...data.data]);
      setPagination(data.pagination)
      setPage((prevPage) => prevPage + 1);

    }
  };



  const handleImageClick = (image: any) => {
    setCurrentImage(image);
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentImage(null);
  };


  const handleOpenDeleteDialog = (imageId: string) => {
    setImageToDelete(imageId);
    setOpenDeleteDialog(true);
  };


  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setImageToDelete(null);
  };



  const handleDeleteImage = async () => {
    if (imageToDelete) {
      try {
        const response = await fetch(`api?imageid=${imageToDelete}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (result) {

          setImages((prevImages) =>
            prevImages.filter((image) => image._id !== imageToDelete)
          );

        }
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    fetch(`/api?search=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

  }


  return (
    <div
    >
      <h1>Gallery</h1>
      <ImageUpload

      />
      <div className="md:p-10 p-2">
        <Paper
          component="form"
          onSubmit={handleSubmit}

          elevation={1}
          className="flex items-center p-2 mb-4 bg-gray-100"
        >
          <IconButton type="submit" aria-label="search" className="text-gray-500">
            <Search />
          </IconButton>
          <InputBase
            value={query}
            onChange={(e) => setQuery(e.target.value)}

            fullWidth
            className="ml-1 flex-1"
            inputProps={{ "aria-label": "search" }}
          />

          <IconButton aria-label="clear search" className="text-gray-500">
            <CleaningServicesOutlined />
          </IconButton>

        </Paper>
      </div>

      <div className=" min-h-screen  ">
        {loading ? 
          <div className="grid md:grid-cols-3 grid-cols-1 gap-5 md:p-10">
            {
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-0">
                  <Skeleton variant="rounded" width="100%" height={300}
                    animation="wave"
                    sx={{ bgcolor: '#3f50b5' }}


                  />


                </div>

              ))
            }
        </div>

          : <InfiniteScroll
            dataLength={images?.length}
            next={fetchMorePosts}
            hasMore={pagination?.hasMore ?? false}
            
            loader={
           <div className="grid md:grid-cols-3 grid-cols-1 gap-5 md:p-10">
            {
                 Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-0">
                    <Skeleton variant="rounded" width="100%" height={300}
                      animation="wave"
                      sx={{ bgcolor: '#3f50b5' }}
  
                    />
  
  
                  </div>
  
                ))
            }
           </div>
          
          }

            endMessage={<p
              className="text-center font-extrabold text-white bg-black w-[70%] p-2 mx-auto box-shadow-md rounded-lg"
            >No more Images available.</p>}
          >
            <div
            className="grid  md:grid-cols-3 grid-cols-1 gap-4 lg:p-10 p-4 "
            
            >
              {
                images?.map((image: any) => (
                  <div key={image._id} className="relative group">
                   

                    <Image
                     src={image.imageUrl}
                     alt={image.title}
                       className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 transform cursor-pointer"
                       onClick={() => handleImageClick(image)}  
                      width={300}
                      height={300}
                      style={{ width: '100%', height: '100%' }}
                    ></Image>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteDialog(image._id);
                      }}
                      style={{ position: 'absolute', top: '0px', right: '0px' }}
                    >
                      <Delete />
                    </Button>
                  </div>
                ))
              }
            </div>
          </InfiniteScroll>
        }
      </div>

     
   


      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{currentImage?.title}</DialogTitle>
        <DialogContent>
          <img
            src={currentImage?.imageUrl}
            alt={currentImage?.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this image?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteImage} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
