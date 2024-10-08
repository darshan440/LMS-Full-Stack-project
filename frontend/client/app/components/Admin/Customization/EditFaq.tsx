import { HiMinus, HiPlus } from "react-icons/hi";
import { style } from "../../../../app/styles/style";
import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "../../../../redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader"; // Assuming you have a Loader component

type Props = {};

const EditFaq = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setQuestions(data.layout.faq);
    }
    if (layoutSuccess) {
      refetch();
      toast.success("FAQ updated successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error, refetch]);

  const toggleQuestion = (id: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q))
    );
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q))
    );
  };

  const handleAnswerChange = (id: string, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q))
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      { _id: Date.now().toString(), question: "", answer: "", active: true },
    ]);
  };

  const isAnyQuestionEmpty = (questions: any[]) =>
    questions.some((q) => !q.question || !q.answer);

  const areQuestionsUnchanged = (original: any[], current: any[]) => {
    return JSON.stringify(original) === JSON.stringify(current);
  };

  const handleEdit = async () => {
    if (
      !areQuestionsUnchanged(data.layout.faq, questions) &&
      !isAnyQuestionEmpty(questions)
    ) {
      await editLayout({
        type: "FAQ",
        faq: questions,
      });
    }
  };

  return isLoading ? (
    <Loader /> // Assuming you have a Loader component
  ) : (
    <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
      <div className="mt-12">
        <dl className="space-y-8">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${
                q._id !== questions[0]?._id && "border-t"
              } border-gray-200 pt-6`}
            >
              <dt className="text-lg">
                <button
                  className="flex item-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <input
                    className={`${style.input} border-none`}
                    value={q.question}
                    onChange={(e: any) =>
                      handleQuestionChange(q._id, e.target.value)
                    }
                  />
                  <span className="ml-6 flex-shrink-0">
                    {q.active ? (
                      <HiMinus className="h-6 w-6" />
                    ) : (
                      <HiPlus className="h-6 w-6" />
                    )}
                  </span>
                </button>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12">
                  <input
                    className={`${style.input} border-none`}
                    value={q.answer}
                    onChange={(e: any) =>
                      handleAnswerChange(q._id, e.target.value)
                    }
                    placeholder={"Add your Answer..."}
                  />
                  <span className="ml-6 flex-shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter((item) => item._id !== q._id)
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer"
          onClick={newFaqHandler}
        />
      </div>

      {/* Save Button */}
      <div
        className={`${
          style.button
        } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
          !data?.layout ||
          areQuestionsUnchanged(data.layout.faq, questions) ||
          isAnyQuestionEmpty(questions)
            ? "cursor-not-allowed"
            : "!cursor-pointer !bg-[#42d383]"
        } !rounded absolute bottom-12 right-12`}
        onClick={
          !data?.layout ||
          areQuestionsUnchanged(data.layout.faq, questions) ||
          isAnyQuestionEmpty(questions)
            ? () => null
            : handleEdit
        }
      >
        Save
      </div>
    </div>
  );
};

export default EditFaq;
