// This component shows strain metadata, and offers some actions to the user like uploading a new strain image, and adding a review.

import React from "react";
import renderStars from "@/app/components/Stars.jsx";

const StrainDetails = ({
  strain,
  userId,
  handleStrainImage,
  setIsOpen,
  isOpen,
}) => {
  return (
    <section className="img__section">
      <img src={strain.photo} alt={strain.name} />

      <div className="actions">
        {/* {userId && (
					<img
						className="review"
						onClick={() => {
							setIsOpen(!isOpen);
						}}
						src="/review.svg"
					/>
				)} */}
        <label
          onChange={(event) => handleStrainImage(event.target)}
          htmlFor="upload-image"
          className="add"
        >
          <input
            name=""
            type="file"
            id="upload-image"
            className="file-input hidden w-full h-full"
          />

          <img className="add-image" src="/add.svg" alt="Add image" />
        </label>
      </div>

      <div className="details__container">
        <div className="details">
          <h2>{strain.name}</h2>
          {/* 
					<div className="strain__rating">
						<ul>{renderStars(strain.avgRating)}</ul>

						<span>({strain.numRatings})</span>
					</div> */}

          {/* <p>
						{strain.category} | {strain.city}
					</p> */}
          <p>{"$".repeat(strain.price)}</p>
        </div>
      </div>
    </section>
  );
};

export default StrainDetails;
