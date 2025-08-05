
export type StudentLevel = 'لم تتم القراءة' | 'مقبول' | 'جيد' | 'جيد جداً' | 'ممتاز';

export interface QuranSurah {
  number: number;
  name: string;
  ayahs: number;
}

export interface DailyProgress {
  id: string;
  date: string;
  level: StudentLevel;
  surahNumber: number;
  ayahNumber: number;
  notes?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  level: StudentLevel;
  notes: string;
  createdAt: string;
  lastUpdated?: string;
  dailyProgress: DailyProgress[];
  currentSurahMurajaa?: {
    surahNumber: number;
    fromAyah: number;
    toAyah: number;
    level?: StudentLevel;
  };
}

export interface StudentProgress {
  date: string;
  surahNumber: number;
  ayahNumber: number;
  notes?: string;
}
