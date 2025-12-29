
import React, { useState } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, price: number, url: string) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(name, parseFloat(price), url);
    setName('');
    setPrice('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-scaleUp">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">เพิ่มเป้าหมายการสืบราคา</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อสินค้า</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="เช่น เคส iPhone 15 Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ราคาปัจจุบันของคุณ (฿)</label>
            <input
              type="number"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1290"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL สินค้าของคู่แข่ง</label>
            <input
              type="url"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://shopee.co.th/product..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 flex gap-3 mt-4">
            <span className="text-lg">🤖</span>
            <p>บอทสายสืบจะวิเคราะห์ URL นี้และเริ่มติดตามการเปลี่ยนแปลงราคาทุกชั่วโมงโดยอัตโนมัติผ่านระบบ n8n Automation</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-6 shadow-lg shadow-blue-200"
          >
            เริ่มติดตามราคา
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
