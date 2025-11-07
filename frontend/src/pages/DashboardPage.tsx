import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import inventoryService from "../services/inventoryService";
import Modal from "../components/Modal";
import InventoryForm from "../components/InventoryForm";

const BASE_URL = "http://localhost:5001";

interface InventoryItem {
  _id: string;
  itemName: string;
  price: number;
  stock: number;
  itemImage?: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);

  const navigate = useNavigate();

  // 🔹 Logout
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // 🔹 Fetch Items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getAllItems();
      setItems(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 🔹 Modal Controls
  const handleOpenAddModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  // 🔹 Form Submit
  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingItem) await inventoryService.updateItem(editingItem._id, formData);
      else await inventoryService.createItem(formData);

      handleCloseModal();
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save item.");
    }
  };

  // 🔹 Delete Item
  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await inventoryService.deleteItem(itemId);
        fetchItems();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete item.");
      }
    }
  };

  // 🔹 Image URL Fix
  const getImageUrl = (path?: string): string => {
    if (!path) return "";
    return path.startsWith("/uploads")
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${path}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* 🔸 Navbar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            🏷️ Inventory Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔸 Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
            <p className="text-gray-500 text-sm">
              Manage and track your available products here.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-md transition"
          >
            + Add Item
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading items...</p>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No items found. Start by adding a new product.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {item.itemImage ? (
                    <img
                      src={getImageUrl(item.itemImage)}
                      alt={item.itemName}
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x200?text=No+Image")
                      }
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {item.itemName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    Stock:{" "}
                    <span
                      className={`${
                        item.stock > 10
                          ? "text-green-600"
                          : item.stock > 0
                          ? "text-yellow-500"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {item.stock}
                    </span>
                  </p>
                  <p className="text-gray-900 font-semibold text-lg mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔸 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Item" : "Add New Item"}
      >
        <InventoryForm
          onSubmit={handleFormSubmit}
          initialData={editingItem}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
