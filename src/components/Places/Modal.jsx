import React, { useState } from 'react';
import { auth, db, storage } from '../../Config/Config'; // Import Firebase storage
import { collection, getDocs, addDoc, deleteDoc, query, setDoc, where, updateDoc, doc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Modal = ({ TotalPrice, totalQty, hideModal }) => {
  const navigate = useNavigate();

  const toastStyle = {
    backgroundColor: '#3e3a31',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const [name, setName] = useState('');
  const [cell, setCell] = useState(null);
  const [residentialAddress, setResidentialAddress] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [cartPrice] = useState(TotalPrice);
  const [cartQty] = useState(totalQty);

  const handleCloseModal = () => {
    hideModal();
  };

  const handleFileChange = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  const handleCashOnDelivery = async (e) => {
    e.preventDefault();

    // Check if a receipt file has been selected
    if (!receiptFile) {
      alert(`Please upload a receipt for the total amount of ${cartPrice}`);
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const currentDate = getCurrentDate();
          const generateUniqueDigit = () => Math.floor(1000 + Math.random() * 9000);
          const uniqueId = `${currentDate}_${user.uid}_${generateUniqueDigit()}`;

          // Upload receipt to Firebase Storage
          const receiptRef = ref(storage, `receipts/${uniqueId}_${receiptFile.name}`);
          await uploadBytes(receiptRef, receiptFile);

          // Get the download URL of the uploaded receipt
          const receiptURL = await getDownloadURL(receiptRef);

          // Save order details along with receipt URL in Firestore
          await setDoc(doc(db, 'Buyer-Personal-Info', uniqueId), {
            Name: name,
            Email: user.email,
            CellNo: cell,
            ResidentialAddress: residentialAddress,
            CartPrice: cartPrice,
            CartQty: cartQty,
            DocumentID: uniqueId,
            ReceiptURL: receiptURL, // Store receipt URL
          });

          const cartData = await getDocs(collection(db, 'Cart' + user.uid));
          

          cartData.forEach(async (doc) => {
            const data = doc.data();
            data.ID = doc.id;
            await addDoc(collection(db, uniqueId), { data });
            await deleteDoc(doc.ref);
          });


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

          hideModal();
          toast.success('Your order has been placed successfully', {
            position: 'top-right',
            autoClose: 5000,
            style: toastStyle,
          });

          setTimeout(() => {
            navigate('/');
          }, 4000);
        } catch (error) {
          console.error("Error placing order:", error);
          toast.error('Failed to place order. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            style: toastStyle,
          });
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="absolute top-0 right-0 mt-4 mr-4 text-red-600 cursor-pointer" onClick={handleCloseModal}>
          <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M14.348 14.849a1 1 0 0 1-1.414 1.415L10 11.414l-2.929 2.83a1 1 0 1 1-1.415-1.415l2.828-2.828L5.636 7.636a1 1 0 1 1 1.415-1.415l2.83 2.828 2.828-2.828a1 1 0 0 1 1.415 1.415l-2.828 2.828 2.828 2.829z" />
          </svg>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Cash On Delivery Details</h2>

          <form className="space-y-4" onSubmit={handleCashOnDelivery}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="cell" className="block text-sm font-medium text-gray-700">
                Cell Number
              </label>
              <input
                type="number"
                id="cell"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your cell number"
                required
                value={cell || ''}
                onChange={(e) => setCell(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700">
                Residential Address
              </label>
              <input
                type="text"
                id="residentialAddress"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your residential address"
                required
                value={residentialAddress}
                onChange={(e) => setResidentialAddress(e.target.value)}
              />
            </div>

          <div>
            
          <label htmlFor="receiptFile" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Receipt
          </label>
          <input
            type="file"
            id="receiptFile"
            className="block w-full text-sm text-gray-500 
                      file:mr-4 file:py-2 file:px-4 
                      file:border-0 file:text-sm file:font-semibold 
                      file:bg-green-400 file:text-white 
                      hover:file:bg-green-500 focus:file:bg-green-500 
                      rounded-lg cursor-pointer shadow-sm"
            onChange={handleFileChange}      
          />
        </div>

            <div className="flex justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
                <input
                  type="text"
                  className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                  readOnly
                  value={cartQty}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Price</label>
                <input
                  type="text"
                  className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
                  readOnly
                  value={cartPrice}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
