/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/images/route.ts

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/models/dbConnect';
import Image from '@/models/Images';


cloudinary.config({
  cloud_name: 'dvvpyit3a',
  api_key: '938681874297384',
  api_secret: 'Hnqb-wjHMypmtLAF3vKZ9OmPtnQ',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1'); 
  const limit = 3;  // Number of items per page

console.log(`Page: ${page}, Limit: ${limit}`); 
const search = searchParams.get('search') || ''; 


  try {
    await dbConnect(); 

    if (search) {
      const regex = new RegExp(search, 'i'); 
      const images = await Image.find({ title: regex }) 
        .sort({ createdAt: -1 });  

      const totalImages = await Image.countDocuments({ title: regex }); 
      return NextResponse.json({
        message: 'Images fetched successfully!',
        data: images,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalImages / limit), 
          totalItems: totalImages,
        },
      });
      
    }


    const images = await Image.find()
      .skip((page - 1) * limit) 
      .limit(limit)  
      .sort({ createdAt: -1 });  

    const totalImages = await Image.countDocuments(); 

    return NextResponse.json({
      message: 'Images fetched successfully!',
      data: images,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalImages / limit), 
        totalItems: totalImages,
        hasMore: totalImages > page * limit,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch images' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
const imageid = new URL(request.url).searchParams.get('imageid');
  if (!imageid) {
    return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
  }
  
  try {
    await dbConnect(); 

    const image = await Image.findById(imageid); // Find the image by ID
    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

   
    const publicId = image.imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
    await cloudinary.uploader.destroy(publicId);

    // Delete the image from MongoDB
    await Image.findByIdAndDelete(imageid);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete image', error: (error as Error).message }, { status: 500 });
  }

 return  NextResponse.json({ message: 'Image deleted successfully' });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll('images') as File[];

  if (files.length === 0) {
    return NextResponse.json({ message: 'No files provided' }, { status: 400 });
  }

  try {
    await dbConnect();

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());


      const fileName = file.name.split('.')[0]; 

     
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(buffer);
      }).then((result) => {
     
        const image = new Image({
          title: fileName, 
          imageUrl: (result as { secure_url: string }).secure_url,
      
        });

        return image.save();
      });
    });

   
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result: any) => result.imageUrl);

    return NextResponse.json({ message: 'Images uploaded successfully', imageUrls });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to upload images', error: error.message }, { status: 500 });
    
  }
}