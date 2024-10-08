import React, { FC } from "react";
import CoursePlayer from "../../../utils/CoursePlayer";
import { style } from "../../../../app/styles/style";
import Rating from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";


type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
};

const CoursePreview: FC<Props> = ({
  courseData,
  setActive,
  active,
  handleCourseCreate,
}) => {
  // Calculate discount percentage
  const discountPercentege =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  // Format the discount percentage to 0 decimal places
    const discountPercentegePrice = discountPercentege.toFixed(0);
    
    const prevButton = () => {
        setActive(active - 1);

    };

    const createCourse=() => {
        handleCourseCreate();
    }

  return (
    <div className="w-full m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px]">
            {courseData?.price === 0 ? "Free" : `${courseData?.price}$`}
          </h1>
          {courseData?.estimatedPrice &&
            courseData?.price !== courseData?.estimatedPrice && (
              <>
                <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
                  {courseData?.estimatedPrice}$
                </h5>
                <h4 className="pl-3 text-[18px] text-green-500">
                  {discountPercentegePrice}% off
                </h4>
              </>
            )}
        </div>
        <div className="flex items-center">
          <div
            className={`${style.button} !w-[180px] my-3 font-Poppins !bg-[crimson] curser-not-allowed`}
          >
            Buy Now {courseData?.price}
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount Price..."
            className={`${style.input} 1500px:!w-[50%] 1100px:w-[50%]  ml-3 !mt-0`}
          />
          <div
            className={`${style.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1">🔖source code included</p>
        <p className="pb-1">🔖Full lifetime access</p>
        <p className="pb-1">🔖Certificate of completion</p>
        <p className="pb-1">🔖Premium support</p>
      </div>
      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-Poppins font-[600]">
            {courseData?.name}
          </h1>
          <div className="flex justify-center items-center pt-3">
            <div className="flex items-center mr-1">
              <Rating rating={0} />
              <h5>{} 0 Reviews</h5>
            </div>
            <h5>0 students</h5>
          </div>
          <br />
          <h1>What you will learn from this course?</h1>
        </div>
        {courseData?.benefits?.map((item: any, index: number) => (
          <div className="w-full flex  800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-Poppins font-[600]">
          What are prerequisite for starting this course
        </h1>
        {courseData?.prerequisite?.map((item: any, index: number) => (
          <div className="w-full flex  800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        {/* course description */}
        <div className="w-full">
          <h1 className="text-[25px] font-Poppins font-[600]">
            Course Details
          </h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="flex w-full items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff]  rounded mt-8 cursor-pointer"
          onClick={ () => prevButton()}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff]  rounded mt-8 cursor-pointer"
          onClick={() => createCourse()}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
