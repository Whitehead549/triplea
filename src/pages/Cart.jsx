// Cart.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../Config/Config';
import { collection, where, getDocs, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { CartProducts } from '../components/Places/CartProducts';
import Navbar from '../components/Navbar/Navbar';

import LoaderSpinner from './LoaderSpinner';
import { Modal } from '../components/Places/Modal';
 // Adjust the import path based on your project structure

const Cart = () => {
    // State to manage modal visibility
    const [showModal, setShowModal] = useState(false);

    // Function to show modal
    const triggerModal = () => {
        setShowModal(true);
    };

    // Function to hide modal
    const hideModal = () => {
        setShowModal(false);
    };

    // State to manage user
    const [user, setUser] = useState(null);

    // State to manage cart products
    const [cartProducts, setCartProducts] = useState([]);

    // State to manage total quantity and price
    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // State to manage loading state
    const [loading, setLoading] = useState(true);

    // Function to get current user
    const getCurrentUser = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const q = query(collection(db, "users"), where("uid", "==", user.uid));
                    const data = await getDocs(q);
                    setUser(data.docs[0].data().fullName);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });
    };

    // Function to fetch cart products and calculate total quantity and price
    const fetchCartProducts = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const cartQuery = query(collection(db, 'Cart' + user.uid), where("uid", "==", user.uid));
                    onSnapshot(cartQuery, (snap) => {
                        const newCartProducts = snap.docs.map((doc) => ({
                            ID: doc.id,
                            ...doc.data(),
                        }));
                        setCartProducts(newCartProducts);

                        const qty = newCartProducts.map(cartProduct => cartProduct.qty);
                        const price = newCartProducts.map(cartProduct => cartProduct.TotalProductPrice);
                        // const size = newCartProducts.map(cartProduct => cartProduct.size);

                        

                        const totalQty = qty.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        const totalPrice = price.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        


                        setTotalQty(totalQty);
                        setTotalPrice(totalPrice);

                        setLoading(false); // Set loading to false after data is fetched
                    });
                } catch (error) {
                    console.error('Error fetching cart products:', error);
                    setLoading(false);
                }
            } else {
                setLoading(false); // Set loading to false if user is not authenticated
            }
        });
    };

    // Function to increase cart product quantity
    const cartProductIncrease = async (cartProduct) => {
        let Product = cartProduct;
        Product.qty = Product.qty + 1;
        Product.TotalProductPrice = Product.qty * Product.price;
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const productRef = doc(collection(db, 'Cart' + user.uid), Product.ID);
                await updateDoc(productRef, Product).then(() => {
                    // Increment added
                }).catch((error) => {
                    console.error('Error updating product:', error);
                });
            } else {
                // User is not logged in to increment
            }
        });
    };

    // Function to decrease cart product quantity
    const cartProductDecrease = async (cartProduct) => {
        let Product = cartProduct;
        if (Product.qty > 1) {
            Product.qty = Product.qty - 1;
            Product.TotalProductPrice = Product.qty * Product.price;
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    const productRef = doc(collection(db, 'Cart' + user.uid), Product.ID);
                    await updateDoc(productRef, Product).then(() => {
                        // Decrement added
                    }).catch((error) => {
                        console.error('Error updating product:', error);
                    });
                } else {
                    // User is not logged in to decrement
                }
            });
        }
    };

    useEffect(() => {
        getCurrentUser();
        fetchCartProducts();
    }, []);

    return (
        <>
            <Navbar usee={user} totalQty={totalQty}/>
            <br />
            {loading ? (
                <LoaderSpinner />
            ) : (
                <>
                    {cartProducts.length > 0 ? (
                        <div className='container-fluid'>
                            <h1 className='text-center'>Cart</h1>
                            <div className='products-box '>
                                <CartProducts
                                    cartProducts={cartProducts}
                                    cartProductIncrease={cartProductIncrease}
                                    cartProductDecrease={cartProductDecrease}
                                />
                            </div>
                            <div className="mx-auto p-2 lg:p-4">
                                <div className="w-full bg-gray-100 shadow-lg rounded-lg p-2 lg:p-12 mt-0 lg:mt-0">
                                    <h5 className="text-xl lg:text-3xl font-semibold mb-2">Cart Summary</h5>
                                    <div className="lg:flex lg:justify-between lg:items-center">
                                        <div className="mb-2 lg:mb-0">
                                            <span className="font-medium text-lg lg:text-xl">Total No of Products:</span>
                                            <span className="font-bold text-lg lg:text-xl">{totalQty}</span>
                                        </div>
                                        <div className="mb-4 lg:mb-0">
                                            <span className="font-medium text-lg lg:text-xl">Total Price to Pay:</span>
                                            <span className="font-bold text-lg lg:text-xl text-green-500">N{totalPrice}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="w-full lg:w-auto bg-blue-500 text-white py-2 lg:py-3 px-4 lg:px-6 rounded-md lg:rounded-lg hover:bg-blue-600 transition duration-300"
                                        onClick={triggerModal}>
                                        Cash on Delivery
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='container-fluid'>No products to show</div>
                    )}
                </>
            )}
            {showModal && (
                <Modal TotalPrice={totalPrice} totalQty={totalQty} hideModal={hideModal} />
            )}
        </>
    );
};

export default Cart;