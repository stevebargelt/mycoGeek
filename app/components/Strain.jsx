"use client";

// This components shows one individual strain
// It receives data from src/app/strain/[id]/page.jsx

import { React, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  getStrainSnapshotById,
  getReviewsSnapshotByStrainId,
} from "@/src/lib/firebase/firestore.js";
import { auth } from "@/app/firebase/firebase.js";
import { useUser } from "@/app/lib/getUser";
import { updateStrainImage } from "@/src/lib/firebase/storage.js";
import ReviewDialog from "@/src/components/ReviewDialog.jsx";
import StrainDetails from "@/src/components/StrainDetails.jsx";
import ReviewsList from "@/src/components/ReviewsList.jsx";

export default function Strain({
  id,
  initialStrain,
  initialReviews,
  initialUserId,
}) {
  const [strain, setStrain] = useState(initialStrain);
  const [isOpen, setIsOpen] = useState(false);

  // The only reason this component needs to know the user ID is to associate a review with the user, and to know whether to show the review dialog
  const userId = useUser()?.uid || initialUserId;
  // const [review, setReview] = useState({
  //   rating: 0,
  //   text: "",
  // });
  // const [reviews, setReviews] = useState(initialReviews);

  // const onChange = (value, name) => {
  //   setReview({ ...review, [name]: value });
  // };

  async function handleStrainImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }

    const imageURL = await updateStrainImage(id, image);
    setStrain({ ...strain, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };

  useEffect(() => {
    const unsubscribeFromStrain = getStrainSnapshotById(id, (data) => {
      setStrain(data);
    });

    const unsubscribeFromReviewsSnapshot = getReviewsSnapshotByStrainId(
      id,
      (data) => {
        setReviews(data);
      }
    );

    return () => {
      unsubscribeFromStrain();
      unsubscribeFromReviewsSnapshot();
    };
  }, []);

  return (
    <div>
      <StrainDetails
        strain={strain}
        userId={userId}
        handleStrainImage={handleStrainImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {/* <ReviewDialog
        isOpen={isOpen}
        handleClose={handleClose}
        review={review}
        onChange={onChange}
        userId={userId}
        id={id}
      />
      <ReviewsList reviews={reviews} userId={userId} /> */}
    </div>
  );
}
