// SuccessToast.js
"use client"
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const SuccessToast = () => (
  <div className="success-toast">
    <div className="emoji">🎉</div>
    <div className="message">
      <h1>Hayyyy!</h1>
      <p>You onboarded this item successfully and updated the inventory states!</p>
    </div>
  </div>
);

export const triggerSuccessToast = () => {
  toast(<SuccessToast />, {
    position: "top-center",
    autoClose: true,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
