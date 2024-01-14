// import { generateFakeStrainsAndReviews } from "@/src/lib/fakeStrains.js";

import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
} from "firebase/firestore";

import { db } from "@/app/firebase/firebase";

// export async function updateStrainImageReference(
//   strainId,
//   publicImageUrl
// ) {
//   const strainRef = doc(collection(db, "strains"), strainId);
//   if (strainRef) {
//     await updateDoc(strainRef, { photo: publicImageUrl });
//   }
// }

// const updateWithRating = async (
//   transaction,
//   docRef,
//   newRatingDocument,
//   review
// ) => {
//   const strain = await transaction.get(docRef);
//   const data = strain.data();
//   const newNumRatings = data?.numRatings ? data.numRatings + 1 : 1;
//   const newSumRating = (data?.sumRating || 0) + Number(review.rating);
//   const newAverage = newSumRating / newNumRatings;

//   transaction.update(docRef, {
//     numRatings: newNumRatings,
//     sumRating: newSumRating,
//     avgRating: newAverage,
//   });

//   transaction.set(newRatingDocument, {
//     ...review,
//     timestamp: Timestamp.fromDate(new Date()),
//   });
// };

// export async function addReviewToStrain(db, strainId, review) {
//   if (!strainId) {
//     throw new Error("No strain ID has been provided.");
//   }

//   if (!review) {
//     throw new Error("A valid review has not been provided.");
//   }

//   try {
//     const docRef = doc(collection(db, "strains"), strainId);
//     const newRatingDocument = doc(
//       collection(db, `strains/${strainId}/ratings`)
//     );

//     // corrected line
//     await runTransaction(db, (transaction) =>
//       updateWithRating(transaction, docRef, newRatingDocument, review)
//     );
//   } catch (error) {
//     console.error(
//       "There was an error adding the rating to the strain",
//       error
//     );
//     throw error;
//   }
// }

function applyQueryFilters(q, { source, strain, sort }) {
  if (source) {
    q = query(q, where("source", "==", source));
  }
  if (strain) {
    q = query(q, where("strain", "==", strain));
  }
  if (sort === "Strain" || !sort) {
    q = query(q, orderBy("strain", "desc"));
  }
  // else if (sort === "Review") {
  //   q = query(q, orderBy("numRatings", "desc"));
  // }
  return q;
}

export async function getStrains(filters = {}) {
  let q = query(collection(db, "strains"));

  q = applyQueryFilters(q, filters);
  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      timestamp: doc.data().timestamp.toDate(),
    };
  });
}

export function getStrainSnapshot(cb, filters = {}) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  let q = query(collection(db, "strain"));
  q = applyQueryFilters(q, filters);

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp.toDate(),
      };
    });

    cb(results);
  });

  return unsubscribe;
}

export async function getStrainById(strainId) {
  if (!strainId) {
    console.log("Error: Invalid ID received: ", strainId);
    return;
  }
  const docRef = doc(db, "strain", strainId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    timestamp: docSnap.data().timestamp.toDate(),
  };
}

export function getStrainSnapshotById(strainId, cb) {
  if (!strainId) {
    console.log("Error: Invalid ID received: ", strainId);
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  const docRef = doc(db, "strains", strainId);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
      timestamp: docSnap.data().timestamp.toDate(),
    });
  });
  return unsubscribe;
}

// export async function getReviewsByStrainId(strainId) {
//   if (!strainId) {
//     console.log("Error: Invalid strainId received: ", strainId);
//     return;
//   }

//   const q = query(
//     collection(db, "strains", strainId, "ratings"),
//     orderBy("timestamp", "desc")
//   );

//   const results = await getDocs(q);
//   return results.docs.map((doc) => {
//     return {
//       id: doc.id,
//       ...doc.data(),
//       // Only plain objects can be passed to Client Components from Server Components
//       timestamp: doc.data().timestamp.toDate(),
//     };
//   });
// }

// export function getReviewsSnapshotByStrainId(strainId, cb) {
//   if (!strainId) {
//     console.log("Error: Invalid strainId received: ", strainId);
//     return;
//   }

//   const q = query(
//     collection(db, "strains", strainId, "ratings"),
//     orderBy("timestamp", "desc")
//   );
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     const results = querySnapshot.docs.map((doc) => {
//       return {
//         id: doc.id,
//         ...doc.data(),
//         // Only plain objects can be passed to Client Components from Server Components
//         timestamp: doc.data().timestamp.toDate(),
//       };
//     });
//     cb(results);
//   });
//   return unsubscribe;
// }

export async function addFakeStrainsAndReviews() {
  const data = await generateFakeStrainsAndReviews();
  for (const { strainData, ratingsData } of data) {
    try {
      const docRef = await addDoc(collection(db, "strains"), strainData);

      for (const ratingData of ratingsData) {
        await addDoc(
          collection(db, "strains", docRef.id, "ratings"),
          ratingData
        );
      }
    } catch (e) {
      console.log("There was an error adding the document");
      console.error("Error adding document: ", e);
    }
  }
}
