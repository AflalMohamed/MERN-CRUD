import React, { useState, useEffect } from 'react';

interface InventoryFormProps {
  onSubmit: (formData: FormData) => void; // <-- 1. Changed to FormData
  initialData?: any;
  onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, initialData, onClose }) => {
  
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    stock: '',
  });
  
  // 2. Add new state for the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 3. Add state for previewing the existing image
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        itemName: initialData.itemName || '',
        price: initialData.price || '',
        stock: initialData.stock || '',
      });
      // If item has an image, set it for preview
      if (initialData.itemImage) {
        // We prepend the backend URL to the stored path
        setImagePreview(`http://localhost:5001${initialData.itemImage}`);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form for "Add" mode
      setFormData({ itemName: '', price: '', stock: '' });
      setImagePreview(null);
    }
    // Reset file input on open
    setSelectedFile(null); 
  }, [initialData]);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // 4. Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Create a temporary local URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 5. Update handleSubmit to use FormData
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a FormData object
    const data = new FormData();
    
    // Append text fields
    data.append('itemName', formData.itemName);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    
    // Append the file *only if* a new one was selected
    if (selectedFile) {
      // This 'itemImage' key *must* match upload.single('itemImage') in backend
      data.append('itemImage', selectedFile);
    }
    
    // Pass the FormData object to the DashboardPage
    onSubmit(data); 
  };

  // --- JSX (UI பகுதி) ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (itemName, price, stock inputs - no change) ... */}
      <div>
        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
          Item Name
        </label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock Quantity
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          step="1"
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {/* 6. Add File Input Field */}
      <div>
        <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700">
          Item Image
        </label>
        <input
          type="file"
          id="itemImage"
          name="itemImage"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif" // Accept only images
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      
      {/* 7. Add Image Preview */}
      {imagePreview && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Image Preview:</p>
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-md border border-gray-300" 
          />
        </div>
      )}

      {/* Button Group (no change) */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;