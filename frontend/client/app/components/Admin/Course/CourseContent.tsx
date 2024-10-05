import toast from "react-hot-toast";
import { style } from "../../../../app/styles/style";
import React, { FC, useState } from "react";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseContentData: any[];
  setCourseContentData: (courseContentData: any[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const CourseContent: FC<Props> = ({
  active,
  setActive,
  courseContentData = [],
  setCourseContentData,
  handleSubmit: handleCourseSubmit,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseContentData.length).fill(false)
  );
  const [activeSection, setActiveSection] = useState(1);

  const handleCollapseToggle = (index: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[index] = !updatedCollapsed[index];
    setIsCollapsed(updatedCollapsed);
  };

  const handleRemoveLink = (index: number, linkIndex: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.splice(linkIndex, 1);
    setCourseContentData(updatedData);
  };

  const handleAddLink = (index: number) => {
    const updatedData = [...courseContentData];
    updatedData[index].links.push({ title: "", url: "" });
    setCourseContentData(updatedData);
  };

  const newContentHandler = (item: any) => {
    if (
      item.title.trim() === "" ||
      item.description.trim() === "" ||
      item.videoUrl.trim() === "" ||
      item.links[0].title.trim() === "" ||
      item.links[0].url.trim() === ""
    ) {
      toast.error("Please fill all the fields first!");
    } else {
      let newVideoSection = "";
      if (courseContentData.length > 0) {
        const lastVideoSection =
          courseContentData[courseContentData.length - 1].videoSection;
        if (lastVideoSection) {
          newVideoSection = lastVideoSection;
        }
      }
      const newContent = {
        videoUrl: "",
        title: "",
        description: "",
        videoSection:
          newVideoSection || `Untitled section ${courseContentData.length + 1}`,
        links: [{ title: "", url: "" }],
      };
      setCourseContentData([...courseContentData, newContent]);
      setIsCollapsed([...isCollapsed, false]); // Add collapse state for new section
    }
  };

  const addNewSection = () => {
    const lastSection = courseContentData[courseContentData.length - 1];

    if (
      lastSection.title.trim() === "" ||
      lastSection.description.trim() === "" ||
      lastSection.videoUrl.trim() === "" ||
      lastSection.links[0].title.trim() === "" ||
      lastSection.links[0].url.trim() === ""
    ) {
      toast.error("Please fill all the fields first!");
      return;
    }

    const newContent = {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: `Untitled section ${courseContentData.length + 1}`,
      links: [{ title: "", url: "" }],
    };
    setCourseContentData([...courseContentData, newContent]);
    setIsCollapsed([...isCollapsed, false]); // Add collapse state for new section
    toast.success("New section added!");
  };

  const handleOption = () => {
    const lastSection = courseContentData[courseContentData.length - 1];

    if (
      lastSection.title.trim() === "" ||
      lastSection.description.trim() === "" ||
      lastSection.videoUrl.trim() === "" ||
      lastSection.links[0].title.trim() === "" ||
      lastSection.links[0].url.trim() === ""
    ) {
      toast.error("Please fill all the fields before proceeding!");
    } else {
      setActiveSection(activeSection + 1);
      setActive(active + 1);
    }
  };

  const prevButton = () => {
    if (active > 0) {
      setActive(active - 1);
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleCourseSubmit}>
        {courseContentData.map((item: any, index: number) => {
          const showSectionInput =
            index === 0 ||
            item.videoSection !== courseContentData[index - 1].videoSection;
          return (
            <div key={index}>
              <div
                className={`w-full bg-[#cdc8c817] p-4 ${
                  showSectionInput ? "mt-10" : "mb-0"
                }`}
              >
                {showSectionInput && (
                  <div className="flex w-full items-center">
                    <input
                      type="text"
                      className={`text-[20px] ${
                        item.videoSection === "Untitled Section"
                          ? "w-[170px]"
                          : "w-max"
                      } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                      value={item.videoSection}
                      placeholder="Title here..."
                      onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index].videoSection = e.target.value;
                        setCourseContentData(updatedData);
                      }}
                    />
                    <BsPencil className="cursor-pointer dark:text-white text-black" />
                  </div>
                )}
                <br />
                <div className="flex w-full items-center justify-between my-0">
                  <p className="font-Poppins dark:text-white text-black">
                    {index + 1}. {item.title}
                  </p>

                  <div className="flex items-center justify-end">
                    <AiOutlineDelete
                      className={`dark:text-white text-[20px] mr-2 text-black ${
                        index > 0 ? "cursor-pointer" : "cursor-no-drop"
                      }`}
                      onClick={() => {
                        if (index > 0) {
                          const updatedData = [...courseContentData];
                          updatedData.splice(index, 1);
                          setCourseContentData(updatedData);
                          setIsCollapsed(updatedData.map(() => false)); // Adjust collapse state
                        }
                      }}
                    />
                    <MdOutlineKeyboardArrowDown
                      fontSize="large"
                      className="dark:text-white text-black"
                      style={{
                        transform: isCollapsed[index]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      onClick={() => handleCollapseToggle(index)}
                    />
                  </div>
                </div>

                {!isCollapsed[index] && (
                  <>
                    <div className="my-3">
                      <label className={style.label}>Video Title</label>
                      <input
                        type="text"
                        placeholder="Project Plan..."
                        className={style.input}
                        value={item.title}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].title = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={style.label}>Video Url</label>
                      <input
                        type="text"
                        placeholder="sddar"
                        className={style.input}
                        value={item.videoUrl}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].videoUrl = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                    </div>
                    <div className="my-3">
                      <label className={style.label}>Video Description</label>
                      <textarea
                        rows={8}
                        cols={30}
                        placeholder="sddar"
                        className={`${style.input} ! h-min py-2`}
                        value={item.description}
                        onChange={(e) => {
                          const updatedData = [...courseContentData];
                          updatedData[index].description = e.target.value;
                          setCourseContentData(updatedData);
                        }}
                      />
                      <br />
                      <br />
                      <br />
                    </div>
                    {item.links.map((link: any, linkIndex: number) => (
                      <div key={linkIndex} className="mb-3 block">
                        <div className="w-full flex items-center justify-between">
                          <label className={style.label}>
                            Link {linkIndex + 1}
                          </label>
                          <AiOutlineDelete
                            className={`${
                              linkIndex === 0
                                ? "cursor-no-drop"
                                : "cursor-pointer"
                            }`}
                            onClick={() => {
                              if (linkIndex > 0) {
                                handleRemoveLink(index, linkIndex);
                              }
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Source code...(Link title)"
                          className={style.input}
                          value={link.title}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].title =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                        <input
                          type="url"
                          placeholder="Source code URL...(Link URL)"
                          className={style.input}
                          value={link.url}
                          onChange={(e) => {
                            const updatedData = [...courseContentData];
                            updatedData[index].links[linkIndex].url =
                              e.target.value;
                            setCourseContentData(updatedData);
                          }}
                        />
                      </div>
                    ))}

                    <div className="inline-block mb-4">
                      <p
                        className="flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                        onClick={() => handleAddLink(index)}
                      >
                        <BsLink45Deg className="mr-2" />
                        Add Link
                      </p>
                    </div>
                  </>
                )}
                {index === courseContentData.length - 1 && (
                  <div>
                    <p
                      className="flex items-center text-[18px] dark:text-white text-black cursor-pointer hover:underline"
                      onClick={() => newContentHandler(item)}
                    >
                      <AiOutlinePlusCircle className="mr-2" /> Add video in same
                      Section
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <br />
        <div
          className="flex items-center text-[20px] dark:text-white text-black cursor-pointer hover:underline"
          onClick={addNewSection}
        >
          <AiOutlinePlusCircle className="mr-2" /> Add New Section
        </div>
      </form>
      <br />
      <div className="flex w-full items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={handleOption}
        >
          Next
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
