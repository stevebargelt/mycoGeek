"use client";

// This components handles the strain listings page
// It receives data from src/app/page.jsx, such as the initial strain and search params from the URL

import Link from "next/link";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import renderStars from "@/components/Stars.jsx";
import { getStrainSnapshot } from "@/app/firebase/firestore.js";
import Filters from "@/app/components/Filters.jsx";

const StrainItem = ({ strain }) => (
  <li key={strain.id}>
    <Link href={`/strain/${strain.id}`}>
      <ActiveStrain strain={strain} />
    </Link>
  </li>
);

const ActiveStrain = ({ strain }) => (
  <div>
    <ImageCover photo={strain.photo} name={strain.name} />
    <StrainDetails strain={strain} />
  </div>
);

const ImageCover = ({ photo, name }) => (
  <div className="image-cover">
    <img src={photo} alt={name} />
  </div>
);

const StrainDetails = ({ strain }) => (
  <div className="strain__details">
    <h2>{strain.name}</h2>
    <StrainRating strain={strain} />
    <StrainMetadata strain={strain} />
  </div>
);

const StrainRating = ({ strain }) => (
  <div className="strain__rating">
    <span>({strain.numRatings})</span>
  </div>
);

const StrainMetadata = ({ strain }) => (
  <div className="strain__meta">
    <p>
      {strain.category} | {strain.city}
    </p>
    <p>{"$".repeat(strain.price)}</p>
  </div>
);

export default function StrainListings({ initialStrain, searchParams }) {
  const router = useRouter();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    city: searchParams.city || "",
    category: searchParams.category || "",
    price: searchParams.price || "",
    sort: searchParams.sort || "",
  };

  const [strain, setStrain] = useState(initialStrain);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    routerWithFilters(router, filters);
  }, [filters]);

  useEffect(() => {
    const unsubscribe = getStrainSnapshot((data) => {
      setStrain(data);
    }, filters);

    return () => {
      unsubscribe();
    };
  }, [filters]);

  return (
    <article>
      <Filters filters={filters} setFilters={setFilters} />
      <ul className="strain">
        {strain.map((strain) => (
          <StrainItem key={strain.id} strain={strain} />
        ))}
      </ul>
    </article>
  );
}

function routerWithFilters(router, filters) {
  const queryParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  }

  const queryString = queryParams.toString();
  router.push(`?${queryString}`);
}
