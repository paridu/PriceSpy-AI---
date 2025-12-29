
import React from 'react';
import { Product } from '../types';
import PriceChart from './PriceChart';

interface DashboardProps {
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ products }) => {
  const totalCompetitors = products.reduce((acc, p) => acc + p.competitors.length, 0);
  const priceChangesCount = products.reduce((acc, p) => 
    acc + p.competitors.filter(c => c.currentPrice !== c.lastPrice).length, 0
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">ภาพรวมตลาด</h2>
        <p className="text-gray-500">สรุปความเคลื่อนไหวราคาสินค้าของคู่แข่งที่คุณติดตาม</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">สินค้าที่ติดตาม</div>
          <div className="text-3xl font-bold text-gray-900">{products.length} <span className="text-sm font-normal text-gray-500">รายการ</span></div>
          <div className="mt-2 text-[10px] text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded">จาก 3 แพลตฟอร์มหลัก</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">คู่แข่งที่สอดแนม</div>
          <div className="text-3xl font-bold text-gray-900">{totalCompetitors} <span className="text-sm font-normal text-gray-500">ร้านค้า</span></div>
          <div className="mt-2 text-[10px] text-green-600 bg-green-50 inline-block px-2 py-1 rounded">อัปเดตข้อมูลทุกชั่วโมง</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold mb-1 uppercase tracking-wider">การเปลี่ยนแปลงราคา</div>
          <div className="text-3xl font-bold text-orange-500">{priceChangesCount} <span className="text-sm font-normal text-gray-500">ครั้ง</span></div>
          <div className="mt-2 text-[10px] text-orange-600 bg-orange-50 inline-block px-2 py-1 rounded">ในช่วง 24 ชั่วโมงที่ผ่านมา</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {products.slice(0, 2).map(product => (
          <div key={product.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-400">ประวัติราคาคู่แข่งหลัก</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase">ราคาของฉัน</span>
                <div className="font-bold text-blue-600">฿{product.myPrice.toLocaleString()}</div>
              </div>
            </div>
            <PriceChart 
              data={product.competitors[0].history} 
              productName={product.competitors[0].name} 
            />
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 text-sm">บันทึกความเคลื่อนไหวล่าสุด</h3>
        <div className="space-y-4">
          {products.flatMap(p => p.competitors).slice(0, 4).map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${comp.currentPrice < comp.lastPrice ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    ร้าน <span className="text-blue-600 font-bold">{comp.name}</span> ปรับราคาใหม่
                  </div>
                  <div className="text-[10px] text-gray-400">{comp.lastUpdated}</div>
                </div>
              </div>
              <div className="text-sm font-bold">
                {comp.currentPrice < comp.lastPrice ? (
                  <span className="text-green-600">฿{comp.lastPrice} → ฿{comp.currentPrice} (-{Math.round(100 - (comp.currentPrice/comp.lastPrice)*100)}%)</span>
                ) : (
                  <span className="text-gray-600">฿{comp.currentPrice}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
