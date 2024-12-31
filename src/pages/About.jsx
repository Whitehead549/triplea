import React from 'react';
import { auth, db } from '../Config/Config'; // Adjust path to your Firebase configuration
import { collection, query, where, updateDoc, getDocs} from 'firebase/firestore';

const About = () => {
  
  const handleButtonClick = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const cartQuery = query(
            collection(db, 'Cart' + user.uid),
            where("uid", "==", user.uid)
          );

          const cartSnapshot = await getDocs(cartQuery);
          const newCartProducts = cartSnapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));

          // Process each product in the cart
          for (const product of newCartProducts) {
            const productID = product.ID.split('-')[0];
            const cartSize = product.size;
            const qty = product.qty;
            const cartColor = product.color;
            const collectionName = product.collectionName;

            console.log('Cart Product - ID:', productID);
            console.log('Cart Product - Size:', cartSize);
            console.log('Cart Product - Color:', cartColor);
            console.log('Cart Product - Quantity:', qty);

            // Reference to the specified collection
            const collectionRef = collection(db, collectionName);
            const collectionSnapshot = await getDocs(collectionRef);

            // Map the collection documents into a dictionary format
            const Dictionary = collectionSnapshot.docs.map((doc) => ({
              ID: doc.id,
              ref: doc.ref, // Add reference for updating later
              ...doc.data(),
            }));

            // Find the specific document matching productID
            const matchedDocument = Dictionary.find((doc) => doc.ID === productID);

            if (matchedDocument) {
              // Check if color and size in cart match with the data in the document
              const sizeDataMatch = matchedDocument.sizes.find(
                (sizeData) =>
                  sizeData.size === cartSize && sizeData.color === cartColor
              );

              if (sizeDataMatch) {
                console.log(`Match found for Product ID: ${productID}`);
                console.log(
                  `Matching Size: ${sizeDataMatch.size}, Color: ${sizeDataMatch.color}, Stock: ${sizeDataMatch.stock}`
                );

                // Update stock if qty is a number and there's enough stock
                if (typeof qty === 'number' && sizeDataMatch.stock >= qty) {
                  const newStock = sizeDataMatch.stock - qty;
                  sizeDataMatch.stock = newStock;

                  console.log(`Updated Stock for Product ID: ${productID}:`, newStock);

                  // Update Firestore document with new stock value
                  await updateDoc(matchedDocument.ref, {
                    sizes: matchedDocument.sizes,
                  });

                  console.log(`Stock updated successfully for Product ID: ${productID}`);
                } else {
                  console.log(
                    `Insufficient stock or invalid quantity for Product ID: ${productID}`
                  );
                }
              } else {
                console.log(
                  `No match found for Size: ${cartSize} and Color: ${cartColor} in Product ID: ${productID}`
                );
              }
            } else {
              console.log(`Product with ID: ${productID} not found in ${collectionName}`);
            }
          }
        } catch (error) {
          console.error("Error fetching cart products:", error);
        }
      } else {
        console.log("User is not authenticated.");
      }
    });
  };

  return (
    <div className="about-container p-4 lg:pt-10">
      <h2 className="text-2xl font-semibold">About Us</h2>
      <p className="mt-4 text-lg">
        Welcome to our app! We aim to provide the best service for managing your shopping experience.
      </p>
      <button
        onClick={handleButtonClick}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Fetch Cart Products
      </button>
    </div>
  );
};

export default About;
