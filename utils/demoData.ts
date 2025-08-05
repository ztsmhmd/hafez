
import { Student } from '../types/Student';

export const demoStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    level: 'جيد جداً',
    notes: 'طالب مجتهد ومتفوق في الحفظ',
    createdAt: '2024-01-15T10:00:00.000Z',
    lastUpdated: '2024-01-20T14:30:00.000Z',
    currentSurahMurajaa: {
      surahNumber: 1,
      fromAyah: 1,
      toAyah: 7,
      level: 'جيد جداً'
    },
    dailyProgress: [
      {
        id: '101',
        date: '2024-01-15',
        level: 'مقبول',
        surahNumber: 1,
        ayahNumber: 7,
        notes: 'حفظ سورة الفاتحة كاملة',
        createdAt: '2024-01-15T10:00:00.000Z'
      },
      {
        id: '102',
        date: '2024-01-16',
        level: 'جيد',
        surahNumber: 2,
        ayahNumber: 5,
        notes: 'بداية حفظ سورة البقرة',
        createdAt: '2024-01-16T10:00:00.000Z'
      },
      {
        id: '103',
        date: '2024-01-17',
        level: 'جيد',
        surahNumber: 2,
        ayahNumber: 10,
        notes: 'تقدم جيد في سورة البقرة',
        createdAt: '2024-01-17T10:00:00.000Z'
      },
      {
        id: '104',
        date: '2024-01-18',
        level: 'ممتاز',
        surahNumber: 2,
        ayahNumber: 20,
        notes: 'أداء ممتاز اليوم',
        createdAt: '2024-01-18T10:00:00.000Z'
      },
      {
        id: '105',
        date: '2024-01-19',
        level: 'جيد جداً',
        surahNumber: 2,
        ayahNumber: 25,
        notes: 'مراجعة وحفظ جديد - أداء جيد جداً',
        createdAt: '2024-01-19T10:00:00.000Z'
      },
      {
        id: '106',
        date: '2024-01-20',
        level: 'جيد جداً',
        surahNumber: 2,
        ayahNumber: 30,
        notes: 'استمرار التقدم الممتاز',
        createdAt: '2024-01-20T10:00:00.000Z'
      }
    ]
  },
  {
    id: '2',
    name: 'فاطمة علي',
    level: 'ممتاز',
    notes: 'طالبة متميزة في التلاوة والحفظ',
    createdAt: '2024-01-10T09:00:00.000Z',
    lastUpdated: '2024-01-20T16:00:00.000Z',
    currentSurahMurajaa: {
      surahNumber: 2,
      fromAyah: 1,
      toAyah: 50,
      level: 'ممتاز'
    },
    dailyProgress: [
      {
        id: '201',
        date: '2024-01-10',
        level: 'ممتاز',
        surahNumber: 3,
        ayahNumber: 50,
        notes: 'تقدم ممتاز في سورة آل عمران',
        createdAt: '2024-01-10T09:00:00.000Z'
      },
      {
        id: '202',
        date: '2024-01-11',
        level: 'ممتاز',
        surahNumber: 3,
        ayahNumber: 75,
        notes: 'حفظ متقن وتلاوة جميلة',
        createdAt: '2024-01-11T09:00:00.000Z'
      },
      {
        id: '203',
        date: '2024-01-12',
        level: 'ممتاز',
        surahNumber: 3,
        ayahNumber: 100,
        notes: 'وصلت للآية 100 من آل عمران',
        createdAt: '2024-01-12T09:00:00.000Z'
      },
      {
        id: '204',
        date: '2024-01-15',
        level: 'جيد',
        surahNumber: 3,
        ayahNumber: 120,
        notes: 'مراجعة وتثبيت',
        createdAt: '2024-01-15T09:00:00.000Z'
      },
      {
        id: '205',
        date: '2024-01-18',
        level: 'ممتاز',
        surahNumber: 3,
        ayahNumber: 150,
        notes: 'تقدم ممتاز مستمر',
        createdAt: '2024-01-18T09:00:00.000Z'
      },
      {
        id: '206',
        date: '2024-01-20',
        level: 'ممتاز',
        surahNumber: 3,
        ayahNumber: 175,
        notes: 'قريبة من إنهاء سورة آل عمران',
        createdAt: '2024-01-20T09:00:00.000Z'
      }
    ]
  },
  {
    id: '3',
    name: 'عبدالله حسن',
    level: 'لم تتم القراءة',
    notes: 'طالب جديد - لم يبدأ الحفظ بعد',
    createdAt: '2024-01-20T11:00:00.000Z',
    lastUpdated: '2024-01-20T17:00:00.000Z',
    dailyProgress: []
  },
  {
    id: '4',
    name: 'عائشة أحمد',
    level: 'جيد',
    notes: 'طالبة نشيطة ومتحمسة للتعلم - تركز على الحفظ الجديد فقط',
    createdAt: '2024-01-12T08:30:00.000Z',
    lastUpdated: '2024-01-20T15:45:00.000Z',
    dailyProgress: [
      {
        id: '401',
        date: '2024-01-12',
        level: 'مقبول',
        surahNumber: 114,
        ayahNumber: 6,
        notes: 'حفظ سورة الناس كاملة',
        createdAt: '2024-01-12T08:30:00.000Z'
      },
      {
        id: '402',
        date: '2024-01-13',
        level: 'جيد',
        surahNumber: 113,
        ayahNumber: 5,
        notes: 'حفظ سورة الفلق كاملة',
        createdAt: '2024-01-13T08:30:00.000Z'
      },
      {
        id: '403',
        date: '2024-01-15',
        level: 'جيد',
        surahNumber: 112,
        ayahNumber: 4,
        notes: 'حفظ سورة الإخلاص كاملة',
        createdAt: '2024-01-15T08:30:00.000Z'
      },
      {
        id: '404',
        date: '2024-01-18',
        level: 'ممتاز',
        surahNumber: 111,
        ayahNumber: 5,
        notes: 'حفظ سورة المسد كاملة - أداء ممتاز',
        createdAt: '2024-01-18T08:30:00.000Z'
      },
      {
        id: '405',
        date: '2024-01-20',
        level: 'جيد',
        surahNumber: 110,
        ayahNumber: 2,
        notes: 'بداية حفظ سورة النصر',
        createdAt: '2024-01-20T08:30:00.000Z'
      }
    ]
  },
  {
    id: '5',
    name: 'محمد سالم',
    level: 'مقبول',
    notes: 'طالب يحتاج إلى مزيد من التشجيع والمتابعة',
    createdAt: '2024-01-22T09:00:00.000Z',
    lastUpdated: '2024-01-22T15:00:00.000Z',
    currentSurahMurajaa: {
      surahNumber: 114,
      fromAyah: 1,
      toAyah: 6,
      level: 'مقبول'
    },
    dailyProgress: [
      {
        id: '501',
        date: '2024-01-22',
        level: 'لم تتم القراءة',
        surahNumber: 114,
        ayahNumber: 3,
        notes: 'لم يتمكن من القراءة اليوم - يحتاج مساعدة',
        createdAt: '2024-01-22T09:00:00.000Z'
      },
      {
        id: '502',
        date: '2024-01-23',
        level: 'مقبول',
        surahNumber: 114,
        ayahNumber: 6,
        notes: 'تحسن طفيف - حفظ سورة الناس كاملة',
        createdAt: '2024-01-23T09:00:00.000Z'
      }
    ]
  }
];
