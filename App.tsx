
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddProductModal from './components/AddProductModal';
import { MOCK_PRODUCTS } from './constants';
import { Product, ViewType } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [scanningProductId, setScanningProductId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('n8n: รอบการตรวจสอบอัตโนมัติเสร็จสิ้น...');
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddProduct = (name: string, price: number, url: string) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      myPrice: price,
      competitors: [
        {
          id: 'c' + Date.now(),
          name: new URL(url).hostname,
          url,
          currentPrice: price - 50,
          lastPrice: price,
          lastUpdated: new Date().toLocaleString('th-TH'),
          status: 'active',
          history: [{ date: 'วันนี้', price: price - 50 }]
        }
      ]
    };
    setProducts([...products, newProduct]);
  };

  const fetchStrategy = async (product: Product) => {
    setLoadingAdvice(true);
    const strategy = await geminiService.generateStrategy(product);
    setAiAdvice(strategy);
    setLoadingAdvice(false);
  };

  const handleManualScan = (productId: string) => {
    setScanningProductId(productId);
    // จำลองการเรียก Webhook ของ n8n
    setTimeout(() => {
      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            competitors: p.competitors.map(c => ({
              ...c,
              lastPrice: c.currentPrice,
              // สุ่มราคาใหม่เล็กน้อยเพื่อจำลองการเปลี่ยนแปลง
              currentPrice: c.currentPrice + (Math.random() > 0.5 ? 10 : -10),
              lastUpdated: new Date().toLocaleString('th-TH'),
            }))
          };
        }
        return p;
      }));
      setScanningProductId(null);
    }, 2000);
  };

  const getViewTitle = (v: ViewType) => {
    switch(v) {
      case 'dashboard': return 'แผงควบคุมหลัก';
      case 'products': return 'จัดการสินค้าของฉัน';
      case 'alerts': return 'รายการแจ้งเตือนด่วน';
      case 'settings': return 'ตั้งค่าระบบอัตโนมัติ';
      default: return v;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={view} onViewChange={setView} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{getViewTitle(view)}</h1>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              >
                <span>+</span> เพิ่มคู่แข่ง
              </button>
            </div>
          </div>

          {view === 'dashboard' && <Dashboard products={products} />}
          
          {view === 'products' && (
            <div className="space-y-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">กำลังติดตามคู่แข่ง {product.competitors.length} ราย</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <div className="text-[10px] text-gray-400 font-bold uppercase">ราคาของฉัน</div>
                        <div className="text-xl font-bold text-blue-600">฿{product.myPrice.toLocaleString()}</div>
                      </div>
                      
                      <button 
                        onClick={() => handleManualScan(product.id)}
                        disabled={scanningProductId === product.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition ${
                          scanningProductId === product.id 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {scanningProductId === product.id ? (
                          <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></span>
                        ) : '🔍'} 
                        {scanningProductId === product.id ? 'กำลังสแกน...' : 'สแกนราคาทันที'}
                      </button>

                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          fetchStrategy(product);
                        }}
                        className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition flex items-center gap-2"
                      >
                        🧠 กลยุทธ์ AI
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {product.competitors.map(comp => (
                        <div key={comp.id} className="bg-white p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between mb-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{comp.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comp.currentPrice < product.myPrice ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                              {comp.currentPrice < product.myPrice ? 'ราคาถูกกว่า' : 'ราคาสูงกว่า'}
                            </span>
                          </div>
                          <div className="flex items-end gap-2 mb-1">
                            <div className="text-2xl font-black text-gray-900">฿{comp.currentPrice.toLocaleString()}</div>
                            {comp.currentPrice !== comp.lastPrice && (
                              <div className={`text-sm font-bold mb-1 ${comp.currentPrice < comp.lastPrice ? 'text-green-500' : 'text-red-500'}`}>
                                {comp.currentPrice < comp.lastPrice ? '↓' : '↑'} {Math.abs(comp.currentPrice - comp.lastPrice).toLocaleString()}
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 mb-4">เช็คล่าสุด: {comp.lastUpdated}</div>
                          <a 
                            href={comp.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline block truncate font-medium"
                          >
                            ดูหน้าสินค้าต้นทาง
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'alerts' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">ยังไม่มีความเคลื่อนไหวที่ผิดปกติ</h3>
              <p className="text-gray-500">ราคาสินค้าของคุณยังสามารถแข่งขันได้ในขณะนี้</p>
            </div>
          )}

          {view === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl">
              <h3 className="text-xl font-bold mb-6">ตั้งค่าบอท n8n Automation</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-bold">ความถี่ในการตรวจสอบ</div>
                    <div className="text-sm text-gray-500">บอทจะสแกนราคาคู่แข่งบ่อยแค่ไหน</div>
                  </div>
                  <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none font-medium">
                    <option>ทุก 30 นาที</option>
                    <option selected>ทุกชั่วโมง</option>
                    <option>ทุก 6 ชั่วโมง</option>
                    <option>รายวัน</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-bold">ช่องทางการแจ้งเตือน</div>
                    <div className="text-sm text-gray-500">รับข้อความเมื่อมีการเปลี่ยนราคา</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold">LINE Notify</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">Telegram</span>
                  </div>
                </div>

                <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <div className="font-bold mb-2 text-sm">n8n Webhook Endpoint</div>
                  <code className="bg-white border border-gray-200 p-2 block rounded text-[10px] text-gray-600 break-all">
                    https://n8n.yourserver.com/webhook/price-checker-123
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AI Strategy Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-scaleUp">
             <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧠</span>
                <div>
                   <h3 className="text-xl font-bold text-indigo-900">การวิเคราะห์จาก AI</h3>
                   <p className="text-xs text-gray-500">{selectedProduct.name}</p>
                </div>
             </div>
             
             <div className="bg-indigo-50 rounded-2xl p-6 min-h-[150px] flex items-center justify-center border border-indigo-100">
                {loadingAdvice ? (
                  <div className="flex flex-col items-center gap-3">
                     <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-indigo-600 text-sm font-bold">Gemini กำลังวิเคราะห์แนวโน้มตลาด...</p>
                  </div>
                ) : (
                  <p className="text-indigo-800 leading-relaxed italic text-lg text-center font-medium">
                    "{aiAdvice}"
                  </p>
                )}
             </div>

             <div className="mt-8">
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  รับทราบแผนงาน
                </button>
             </div>
          </div>
        </div>
      )}

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProduct} 
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
