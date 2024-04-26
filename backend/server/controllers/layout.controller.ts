import { CatchAsyncError } from "../middalware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { url } from "inspector";
import LayoutModel from "../models/layout.model";
import layoutRouts from "../routes/layout.routs";
import { Error } from "mongoose";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} is already exist`, 404));
      }

      switch (type) {
        case "Banner":
          {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
              folder: "layout",
            });
            const banner = {
              image: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              },
              title,
              subTitle,
            };
            await createBannerLayout(banner);
            break;
          }
          async function createBannerLayout(
            banner: any,
            p0?: {
              banner: {
                image: { public_id: string; url: string };
                title: any;
                subTitle: any;
              };
            }
          ) {
            await LayoutModel.create(banner);
          }
        // -------------------------------------------------------------------------------------------------------
        case "FAQ":
          {
            const { faq } = req.body;
            const faqItems = await createFaqItems(faq);
            await createFaqLayout(faqItems);
            break;
          }

         
          async function createFaqLayout(faqItems: any[]) {
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
          }

        // ---------------------------------------------------------------------------------------------------------------------------
        case "Categories":
          {
            const { categories } = req.body;
            const categoriesItems = await createCategoryItems(categories);
            await createCategoriesLayout(categoriesItems);
            break;
          }
          

          async function createCategoriesLayout(categoriesItems: any[]) {
            await LayoutModel.create({
              type: "Categories",
              categories: categoriesItems,
            });
              }
              
        default:
          return next(new ErrorHandler(`Invalid layout type: ${type}`, 400));
      }
      res.status(200).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// =================================================================same use fuction==================================================================

 async function createFaqItems(faq: any[]) {
   return Promise.all(
     faq.map(async (item: any) => {
       return {
         question: item.question,
         answer: item.answer,
       };
     })
   );
} 
async function createCategoryItems(categories: any[]) {
  return Promise.all(
    categories.map(async (item: any) => {
      return {
        title: item.title,
      };
    })
  );
}

// update layout ==========================================================================================================================

export const updateLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      switch (type) {
        case "Banner":
          await updateBannerLayout(req);
          break;
        case "FAQ":
          await updateFaqLayout(req);
          break;
        case "Categories":
          await updateCategoriesLayout(req);
          break;
        default:
          return next(new ErrorHandler(`Invalid layout type: ${type}`, 400));
      }

      res.status(200).json({
        success: true,
        message: "Layout updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

async function updateBannerLayout(req: Request) {
  const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
  const { image, title, subTitle } = req.body;
  if (bannerData) {
    await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
  }
  const myCloud = await cloudinary.v2.uploader.upload(image, {
    folder: "layout",
  });
  const updatedBanner = {
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    title,
    subTitle,
  };
  await LayoutModel.findOneAndUpdate(
    { type: "Banner" },
    { banner: updatedBanner }
  );
}

async function updateFaqLayout(req: Request) {
  const { faq } = req.body;
  const faqItems = await createFaqItems(faq);
  await LayoutModel.findOneAndUpdate({ type: "FAQ" }, { faq: faqItems });
}

async function updateCategoriesLayout(req: Request) {
  const { categories } = req.body;
  const categoriesItems = await createCategoryItems(categories);
  await LayoutModel.findOneAndUpdate(
    { type: "Categories" },
    { categories: categoriesItems }
  );
}


// get layout by type
export const getLayoutByType = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {type} = req.body
        const layout = await LayoutModel.findOne({type});
        res.status(200).json({
            success: true,
            layout, 
        }
        )
    } catch (error:any) {
        return next (new ErrorHandler
            (error.messege,500)
        )
    }
})