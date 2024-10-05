import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { style } from "../../../../app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditCategories = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setCategories(data.layout.categories);
    }
    if (layoutSuccess) {
      toast.success("Categories changed successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, error, layoutSuccess]);

  const handleCategoriesAdd = (id: any, value: string) => {
    setCategories((prevCategory: any) =>
      prevCategory.map((i: any) =>
        i._id === id || i._id === null ? { ...i, title: value } : i
      )
    );
  };

  const newCategoriesHandler = () => {
    if (categories.length && categories[categories.length - 1].title === "") {
      toast.error("⚠️ Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [...prevCategory, { title: "" }]);
    }
  };

  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => {
    return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
  };

  const isAnyCategoriesEmpty = (categories: any[]) => {
    return categories.some((q) => q.title === "");
  };

  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data.layout.categories, categories) &&
      !isAnyCategoriesEmpty(categories)
    ) {
      await editLayout({
        type: "Categories",
        categories,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${style.title}`}>All Categories</h1>
          {categories.map((item: any, index: number) => (
            <div className="p-3" key={item._id || index}>
              <div className="flex items-center w-full justify-center">
                <input
                  className={`${style.input} !w-[unset] !border-none !text-[20px]`}
                  value={item.title}
                  onChange={(e) => {
                    handleCategoriesAdd(item._id, e.target.value);
                  }}
                  placeholder="Enter Categories title"
                />
                <AiOutlineDelete
                  className="dark:text-white text-white text-[18px] cursor-pointer"
                  onClick={() => {
                    setCategories((prevCategory: any) =>
                      prevCategory.filter((i: any) => i._id !== item._id)
                    );
                  }}
                />
              </div>
            </div>
          ))}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div
            className={`${
              style.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              !data?.layout ||
              areCategoriesUnchanged(data.layout.faq, categories) ||
              isAnyCategoriesEmpty(categories)
                ? "cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              !data?.layout ||
              areCategoriesUnchanged(data.layout.faq, categories) ||
              isAnyCategoriesEmpty(categories)
                ? () => null
                : editCategoriesHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;