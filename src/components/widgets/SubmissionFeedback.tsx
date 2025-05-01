"use client";

import React from "react";
import Lottie from "lottie-react";
import successAnimation from "@/../public/assets/lottie/success.json";
import failureAnimation from "@/../public/assets/lottie/failed.json";

interface SubmissionFeedbackProps {
  status: "success" | "failure";
  message?: string;
}

const SubmissionFeedback: React.FC<SubmissionFeedbackProps> = ({
  status,
  message,
}) => {
  const animationData =
    status === "success" ? successAnimation : failureAnimation;

  const defaultMessage =
    status === "success"
      ? "School saved successfully!"
      : "Something went wrong.";

  return (
    <div className="flex justify-center items-center flex-col p-4">
      <Lottie animationData={animationData} loop={false} style={{ height: 200, width: 200 }} />
      <p className="mt-4 text-lg font-semibold text-center text-foreground">
        {message || defaultMessage}
      </p>
    </div>
  );
};

export default SubmissionFeedback;
