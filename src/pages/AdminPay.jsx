import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config/Config";

const AdminPay = () => {
  const [buyerInfo, setBuyerInfo] = useState({ today: [], yesterday: [], twoDaysAgo: [] });
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [extraInfo, setExtraInfo] = useState({});
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Buyer-Personal-Info"));
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(today.getDate() - 2);

        const data = { today: [], yesterday: [], twoDaysAgo: [] };

        for (const doc of querySnapshot.docs) {
          const docId = doc.id;
          const [dateStr] = docId.split("_");
          const docDate = new Date(dateStr);

          if (isSameDay(docDate, today)) {
            data.today.push({ id: doc.id, ...doc.data() });
          } else if (isSameDay(docDate, yesterday)) {
            data.yesterday.push({ id: doc.id, ...doc.data() });
          } else if (isSameDay(docDate, twoDaysAgo)) {
            data.twoDaysAgo.push({ id: doc.id, ...doc.data() });
          }
        }

        setBuyerInfo(data);
      } catch (error) {
        console.error("Error fetching buyer info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerInfo();
  }, []);

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const toggleDetails = async (docId) => {
    if (expandedCardId === docId) {
      setExpandedCardId(null);
      return;
    }
    setExpandedCardId(docId);

    if (!extraInfo[docId]) {
      try {
        const collectionSnapshot = await getDocs(collection(db, docId));
        const extraData = collectionSnapshot.docs.map((subDoc) => ({
          ID: subDoc.id,
          ...subDoc.data(),
        }));

        setExtraInfo((prevInfo) => ({ ...prevInfo, [docId]: extraData }));
      } catch (error) {
        console.error(`Error fetching collection data for ID ${docId}:`, error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8 text-teal-600">Admin Payments Dashboard</h2>
      <div className="space-y-16">
        {renderSection("Today's Payments", buyerInfo.today, expandedCardId, toggleDetails, extraInfo, setModalImage)}
        {renderSection("Yesterday's Payments", buyerInfo.yesterday, expandedCardId, toggleDetails, extraInfo, setModalImage)}
        {renderSection("Two Days Ago Payments", buyerInfo.twoDaysAgo, expandedCardId, toggleDetails, extraInfo, setModalImage)}
      </div>

      {/* Modal for displaying receipt */}
      {modalImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setModalImage(null)} // Close modal when clicking outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            {/* Receipt Image */}
            <img
              src={modalImage}
              alt="Receipt"
              className="max-w-full max-h-[70vh] rounded-lg mb-4"
            />

            {/* Close Button */}
            <button
              onClick={() => setModalImage(null)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const renderSection = (title, data, expandedCardId, toggleDetails, extraInfo, setModalImage) => (
  <div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h3>
    {data.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((info) => (
          <div
            key={info.id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <p className="font-semibold text-lg mb-2 text-gray-800">Name: {info.Name}</p>
            <p className="text-sm text-gray-600">Phone: {info.CellNo}</p>
            <p className="text-sm text-gray-600">Total Amount: ${info.CartPrice}</p>

            {/* View Receipt Button */}
            <button
              onClick={() => setModalImage(info.ReceiptURL)}
              className="mt-4 w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-800 transition"
            >
              View Receipt
            </button>

            <button
              onClick={() => toggleDetails(info.id)}
              className="mt-2 w-full py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition"
            >
              {expandedCardId === info.id ? "Hide Details" : "View Details"}
            </button>

            {expandedCardId === info.id && extraInfo[info.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2 text-gray-700">Products Purchased:</h4>
                {extraInfo[info.id].map((extra, idx) => (
                  <div key={idx} className="flex items-start space-x-4 mb-3">
                    <img
                      src={extra.data.url}
                      alt={extra.data.title}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{extra.data.title}</p>
                      <p className="text-sm text-gray-600">Price: ${extra.data.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {extra.data.qty}</p>
                      <p className="text-sm text-gray-600">Color: {extra.data.color}</p>
                      <p className="text-sm text-gray-600">Size: {extra.data.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No payment data available for {title.toLowerCase()}.</p>
    )}
  </div>
);

export default AdminPay;
