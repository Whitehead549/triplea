import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config/Config";

const AdminPay = () => {
  const [buyerInfo, setBuyerInfo] = useState({ today: [], yesterday: [], twoDaysAgo: [] });
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [extraInfo, setExtraInfo] = useState({});

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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-teal-600">Admin Payments</h2>
      {renderSection("Today", buyerInfo.today, expandedCardId, toggleDetails, extraInfo)}
      {renderSection("Yesterday", buyerInfo.yesterday, expandedCardId, toggleDetails, extraInfo)}
      {renderSection("Two Days Ago", buyerInfo.twoDaysAgo, expandedCardId, toggleDetails, extraInfo)}
    </div>
  );
};

const renderSection = (title, data, expandedCardId, toggleDetails, extraInfo) => (
  <div className="mb-12">
    <h3 className="text-xl font-semibold mb-6 text-gray-700">{title}</h3>
    {data.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((info) => (
          <div
            key={info.id}
            className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-200"
          >
            <p className="font-semibold text-lg mb-1 text-gray-800">Name: {info.Name}</p>
            <p className="text-sm mb-1 text-gray-600">Phone: {info.CellNo}</p>
            <p className="text-sm mb-3 text-gray-600">Total Amount: ${info.CartPrice}</p>
          

            <button
              onClick={() => toggleDetails(info.id)}
              className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors focus:outline-none"
            >
              {expandedCardId === info.id ? "Hide Details" : "View Details"}
            </button>
            {expandedCardId === info.id && extraInfo[info.id] && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-2 text-gray-700">Products Purchased:</h4>
                {extraInfo[info.id].map((extra, idx) => (
                  <div key={idx} className="mb-4 flex items-start">
                    <img
                      src={extra.data.url}
                      alt={extra.data.title}
                      className="w-16 h-16 object-cover rounded-lg mr-4 border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{extra.data.title}</p>
                      <p className="text-sm text-gray-600">Price: ${extra.data.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {extra.data.qty}</p>
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
