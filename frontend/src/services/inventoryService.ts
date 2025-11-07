import api from './api'; // நாம் உருவாக்கிய axios instance-ஐ import செய்கிறோம்

// 1. CREATE: புதிய பொருளைச் சேர்த்தல்
const createItem = (itemData: FormData) =>{
  return api.post('/inventory', itemData);
};

// 2. READ: அனைத்துப் பொருட்களையும் பெறுதல்
const getAllItems = () => {
  return api.get('/inventory');
};

// 3. READ (One): ஒரு பொருளை ID வைத்துப் பெறுதல்
const getItemById = (itemId: string) => {
  return api.get(`/inventory/${itemId}`);
};

// 4. UPDATE: ஒரு பொருளை மாற்றுதல்
const updateItem = (itemId: string, itemData: FormData) => {
  return api.put(`/inventory/${itemId}`, itemData);
};

// 5. DELETE: ஒரு பொருளை நீக்குதல்
const deleteItem = (itemId: string) => {
  return api.delete(`/inventory/${itemId}`);
};

// அனைத்தையும் export செய்தல்
const inventoryService = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};

export default inventoryService;