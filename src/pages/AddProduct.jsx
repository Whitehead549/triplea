import React, { useState } from 'react';
import { storage, db } from '../Config/Config';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddProducts = () => {
    const navigate = useNavigate();

    const toastStyle = {
        backgroundColor: '#3e3a31', 
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
    };

    const [products, setProducts] = useState([{
        title: '',
        description: '',
        type: '',
        price: '',
        sizes: [],
        sizeInput: '',
        stockInput: '',
        colorInput: '', // Added color input here
        image: null,
        imageError: ''
    }]);

    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleInputChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    const handleImageChange = (index, e) => {
        const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG', 'image/webp'];
        const selectedFile = e.target.files[0];
        const updatedProducts = [...products];

        if (selectedFile) {
            if (types.includes(selectedFile.type)) {
                updatedProducts[index].image = selectedFile;
                updatedProducts[index].imageError = '';
            } else {
                updatedProducts[index].image = null;
                updatedProducts[index].imageError = 'Please select a valid image file type (png or jpg)';
            }
        } else {
            updatedProducts[index].imageError = 'Please select your file';
        }
        setProducts(updatedProducts);
    };

    const addSizeStockToArray = (index) => {
        const updatedProducts = [...products];
        const sizeInput = updatedProducts[index].sizeInput;
        const stockInput = updatedProducts[index].stockInput;
        const colorInput = updatedProducts[index].colorInput;

        if (sizeInput.trim() === '' || isNaN(stockInput) || stockInput.trim() === '' || colorInput.trim() === '') {
            toast.error("Please enter valid size, stock quantity, and color.", {
                position: 'top-right',
                autoClose: 3000,
                style: toastStyle,
            });
            return;
        }

        updatedProducts[index].sizes.push({
            size: Number(sizeInput.trim()),
            stock: Number(stockInput.trim()),
            color: colorInput.trim() // Added color to size array
        });

        updatedProducts[index].sizeInput = '';
        updatedProducts[index].stockInput = '';
        updatedProducts[index].colorInput = ''; // Reset color input
        setProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        setProducts([...products, {
            title: '',
            description: '',
            type: '',
            price: '',
            sizes: [],
            sizeInput: '',
            stockInput: '',
            colorInput: '', // Reset color input for new product
            image: null,
            imageError: ''
        }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError('');

        const uploadPromises = products.map(async (product) => {
            if (product.image && product.title && product.type && product.price) {
                const storageRef = ref(storage, `product-images/${product.type.toUpperCase()}/${Date.now()}`);
                try {
                    await uploadBytes(storageRef, product.image);
                    const url = await getDownloadURL(storageRef);

                    // Prepare the collection name
                    const collectionName = `products-${product.type.toUpperCase()}`;

                    await addDoc(collection(db, collectionName), {
                        title: product.title,
                        collectionName: collectionName,
                        description: product.description,
                        price: Number(product.price),
                        sizes: product.sizes, // Save sizes with color included
                        url
                    });

                    toast.success('Added successfully', {
                        position: 'top-right',
                        autoClose: 5000,
                        style: toastStyle,
                    });
                } catch (error) {
                    console.error("Error uploading document: ", error);
                    setUploadError(error.message);
                }
            } else {
                setUploadError("Please complete all required fields for each product.");
            }
        });

        try {
            await Promise.all(uploadPromises);
            setSuccessMsg('Products added successfully');
            setProducts([{
                title: '',
                description: '',
                type: '',
                price: '',
                sizes: [],
                sizeInput: '',
                stockInput: '',
                colorInput: '', // Reset color input
                image: null,
                imageError: ''
            }]);
            setTimeout(() => {
                setSuccessMsg('');
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error("Error during submission: ", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 my-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Products</h1>
                <hr className="mb-6" />
                {successMsg && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                        {successMsg}
                    </div>
                )}
                <form autoComplete="off" className="space-y-6" onSubmit={handleSubmit}>
                    {products.map((product, index) => (
                        <div key={index} className="border p-6 rounded-lg bg-gray-50">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Product {index + 1}</h2>
                            <input
                                type="text"
                                className="w-full md:w-3/4 lg:w-1/2 px-4 py-2 border rounded mb-4 focus:ring focus:outline-none"
                                placeholder="Product Title"
                                required
                                value={product.title}
                                onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                            />
                            <input
                                type="text"
                                className="w-full md:w-3/4 lg:w-1/2 px-4 py-2 border rounded mb-4 focus:ring focus:outline-none"
                                placeholder="Product Description"
                                required
                                value={product.description}
                                onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                            />
                            <select
                                className="w-full md:w-3/4 lg:w-1/2 px-4 py-2 border rounded mb-4 focus:ring focus:outline-none"
                                required
                                value={product.type}
                                onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                            >
                                <option value="">Select Product Type</option>
                                <option value="ladies">LADIES</option>
                                <option value="shopitems">SHOP ITEMS</option>
                                <option value="children">CHILDREN</option>
                            </select>
                            <input
                                type="number"
                                className="w-full md:w-3/4 lg:w-1/2 px-4 py-2 border rounded mb-4 focus:ring focus:outline-none"
                                placeholder="Product Price"
                                required
                                value={product.price}
                                onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                            />

                            {/* Inputs for size, stock, and color */}
                            <div className="flex items-center space-x-4 mb-4">
                                <input
                                    type="text"
                                    className="w-full md:w-1/3 px-4 py-2 border rounded focus:ring focus:outline-none"
                                    placeholder="Size (e.g., 36)"
                                    value={product.sizeInput}
                                    onChange={(e) => handleInputChange(index, 'sizeInput', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="w-full md:w-1/3 px-4 py-2 border rounded focus:ring focus:outline-none"
                                    placeholder="Stock (e.g., 10)"
                                    value={product.stockInput}
                                    onChange={(e) => handleInputChange(index, 'stockInput', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="w-full md:w-1/3 px-4 py-2 border rounded focus:ring focus:outline-none"
                                    placeholder="Color (e.g., Red)"
                                    value={product.colorInput}
                                    onChange={(e) => handleInputChange(index, 'colorInput', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => addSizeStockToArray(index)}
                                >
                                    Add Size
                                </button>
                            </div>

                            {/* Display size, stock, and color entries */}
                            {product.sizes.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-gray-600 font-semibold mb-2">Sizes, Stock & Colors:</h4>
                                    <ul className="list-disc list-inside">
                                        {product.sizes.map((sizeStock, i) => (
                                            <li key={i}>
                                                Size: {sizeStock.size}, Stock: {sizeStock.stock}, Color: {sizeStock.color}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <input
                                type="file"
                                onChange={(e) => handleImageChange(index, e)}
                                className="w-full md:w-3/4 lg:w-1/2 mb-4"
                                accept="image/*"
                            />
                            {product.imageError && (
                                <p className="text-red-600 mb-4">{product.imageError}</p>
                            )}
                            <button
                                type="button"
                                className="text-red-500 font-semibold mb-6"
                                onClick={() => handleRemoveProduct(index)}
                            >
                                Remove Product
                            </button>
                        </div>
                    ))}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={handleAddProduct}
                        >
                            Add More Products
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                {uploadError && (
                    <p className="text-red-600 mt-4">{uploadError}</p>
                )}
            </div>
        </div>
    );
};
