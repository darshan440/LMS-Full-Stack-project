import { style } from '../../../../app/styles/style';

import React, { FC, useState } from 'react'

type Props = {
  courseInfo: any;
  setCourseInfo: (courseInfo: any) => void;
  active: number;
  setActive: (active: any) => void;

  
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
  const [dragging, setDragging] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setActive(active + 1);
  }
  const handleFileChange = (e: any) => {
   const file = e.target?.files?.[0];

    
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      };
      reader.readAsDataURL(file)
    }
  }
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  }
  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
       const reader = new FileReader();

       reader.onload = () => {
         
           setCourseInfo({ ...courseInfo, thumbnail: reader.result });
         
       };
       reader.readAsDataURL(file);
    }
    
    
    
  };
  return (
    <div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit}>
        <div>
          <label className={`${style.label}`}>Course Name</label>
          <input
            type="name"
            name=""
            required
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, name: e.target.value })
            }
            id="name"
            placeholder="MERN stack LMS platform with next 13"
            className={`${style.input}`}
          />
        </div>
        <br />
        <div className="mb-5">
          <label className={`${style.label}`}>Course Description</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={8}
            placeholder="Write somthing amazing. . ."
            className={`${style.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          ></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${style.label}`}>Course Price</label>
            <input
              type="number"
              name=""
              required
              value={courseInfo.price}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`${style.input}`}
            />
          </div>

          <div className="w-[50%]">
            <label className={`${style.label}`}>
              Estimated price (optional)
            </label>
            <input
              type="number"
              name=""
              value={courseInfo.estimatedPrice}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
              }
              id="price"
              placeholder="29"
              className={`${style.input}`}
            />
          </div>
        </div>
        <br />
        <div>
          <label className={`${style.label}`}>Course tags</label>
          <input
            type="text"
            name=""
            required
            value={courseInfo.tags}
            onChange={(e: any) =>
              setCourseInfo({ ...courseInfo, tags: e.target.value })
            }
            id="tags"
            placeholder="#MERN, #NEXT...."
            className={`${style.input}`}
          />
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${style.label}`}>Course level</label>
            <input
              type=""
              name=""
              required
              value={courseInfo.level}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, level: e.target.value })
              }
              id="price"
              placeholder="Begginners/Intermediate/Expert"
              className={`${style.input}`}
            />
          </div>

          <div className="w-[50%]">
            <label className={`${style.label}`}>Demo URL</label>
            <input
              type="text"
              name="demoUrl"
              required
              value={courseInfo.demoUrl}
              onChange={(e: any) =>
                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
              }
              id="demoUrl"
              placeholder="url here"
              className={`${style.input}`}
            />
          </div>
        </div>
        <br />
        <div className="w-full ">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-black p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            } `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={courseInfo.thumbnail}
                className="max-h-full w-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
        <br />
        <div className='w-full flex item-center justify-end'>
          <input type="submit" value="NEXT" className='w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointed' />
        </div>
        <br />
        <br />
      </form>
    </div>
  );
}

export default CourseInformation