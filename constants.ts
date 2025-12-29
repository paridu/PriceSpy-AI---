
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'คีย์บอร์ดไร้สาย Ergonomic',
    myPrice: 1290,
    competitors: [
      {
        id: 'c1',
        name: 'TechStore Thailand',
        url: 'https://shopee.co.th/product-p1',
        currentPrice: 1190,
        lastPrice: 1250,
        lastUpdated: '25 ต.ค. 2023 14:00',
        status: 'active',
        history: [
          { date: '20 ต.ค.', price: 1250 },
          { date: '21 ต.ค.', price: 1250 },
          { date: '22 ต.ค.', price: 1250 },
          { date: '23 ต.ค.', price: 1250 },
          { date: '24 ต.ค.', price: 1190 },
          { date: '25 ต.ค.', price: 1190 },
        ]
      },
      {
        id: 'c2',
        name: 'GadgetZone Shop',
        url: 'https://lazada.co.th/gadget-p1',
        currentPrice: 1290,
        lastPrice: 1290,
        lastUpdated: '25 ต.ค. 2023 15:30',
        status: 'active',
        history: [
          { date: '20 ต.ค.', price: 1290 },
          { date: '21 ต.ค.', price: 1290 },
          { date: '22 ต.ค.', price: 1290 },
          { date: '23 ต.ค.', price: 1290 },
          { date: '24 ต.ค.', price: 1290 },
          { date: '25 ต.ค.', price: 1290 },
        ]
      }
    ]
  },
  {
    id: 'p2',
    name: 'หน้าจอ 4K Ultra HD 27"',
    myPrice: 8500,
    competitors: [
      {
        id: 'c3',
        name: 'DisplayKing TH',
        url: 'https://example.com/monitor',
        currentPrice: 7990,
        lastPrice: 8200,
        lastUpdated: '25 ต.ค. 2023 10:00',
        status: 'active',
        history: [
          { date: '20 ต.ค.', price: 8200 },
          { date: '21 ต.ค.', price: 8200 },
          { date: '22 ต.ค.', price: 8200 },
          { date: '23 ต.ค.', price: 8200 },
          { date: '24 ต.ค.', price: 8200 },
          { date: '25 ต.ค.', price: 7990 },
        ]
      }
    ]
  }
];
