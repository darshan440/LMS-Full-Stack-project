import { CatchAsyncError } from "../middalware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";

import LayoutModel from "../models/layout.model";

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      // Check if the type is valid
      if (!["Banner", "FAQ", "Categories"].includes(type)) {
        return next(new ErrorHandler(`Invalid layout type: ${type}`, 400));
      }

      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 404));
      }

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
            title,
            subTitle,
          },
        };
        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await createFaqItems(faq);
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await createCategoryItems(categories);
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
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

  if (!bannerData) {
    throw new ErrorHandler("Banner layout not found", 404);
  }

  let updatedImage = bannerData.banner.image;

  if (image && image.startsWith("data:image/")) {
    if (bannerData.banner.image.public_id) {
      await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
    }

    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "layout",
    });

    updatedImage = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const updatedBanner = {
    image: updatedImage,
    title: title || bannerData.banner.title,
    subTitle: subTitle || bannerData.banner.subTitle,
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
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      // Log the type
      const layout = await LayoutModel.findOne({ type });
      res.status(200).json({
        success: true,
        layout,
      });
      if (!layout) {
        return res.status(404).json({
          success: false,
          message: "Layout not found for the given type",
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.messege, 500));
    }
  }
);
