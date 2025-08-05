
import { QuranSurah } from '../types/Student';
import quranSurahsData from '../data/quranSurahs.json';

export const quranSurahs: QuranSurah[] = quranSurahsData;

export const getSurahByNumber = (number: number): QuranSurah | undefined => {
  return quranSurahs.find(surah => surah.number === number);
};

export const getSurahName = (number: number): string => {
  const surah = getSurahByNumber(number);
  return surah ? surah.name : `سورة ${number}`;
};

export const getTotalAyahsInSurah = (surahNumber: number): number => {
  const surah = getSurahByNumber(surahNumber);
  return surah ? surah.ayahs : 0;
};

export const getTotalAyahsInQuran = (): number => {
  return quranSurahs.reduce((total, surah) => total + surah.ayahs, 0);
};

export const getProgressPercentage = (surahNumber: number, ayahNumber: number): number => {
  let totalAyahsRead = 0;
  
  // Add all ayahs from completed surahs
  for (let i = 1; i < surahNumber; i++) {
    const surah = getSurahByNumber(i);
    if (surah) {
      totalAyahsRead += surah.ayahs;
    }
  }
  
  // Add ayahs from current surah
  totalAyahsRead += ayahNumber;
  
  const totalAyahs = getTotalAyahsInQuran();
  return Math.round((totalAyahsRead / totalAyahs) * 100);
};

export const validateAyahNumber = (surahNumber: number, ayahNumber: number): boolean => {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return false;
  return ayahNumber >= 1 && ayahNumber <= surah.ayahs;
};

export const getNextAyah = (surahNumber: number, ayahNumber: number): { surahNumber: number; ayahNumber: number } | null => {
  const surah = getSurahByNumber(surahNumber);
  if (!surah) return null;
  
  if (ayahNumber < surah.ayahs) {
    // Next ayah in same surah
    return { surahNumber, ayahNumber: ayahNumber + 1 };
  } else if (surahNumber < 114) {
    // First ayah of next surah
    return { surahNumber: surahNumber + 1, ayahNumber: 1 };
  } else {
    // End of Quran
    return null;
  }
};

export const formatQuranPosition = (surahNumber: number, ayahNumber: number): string => {
  const surahName = getSurahName(surahNumber);
  return `${surahName} - آية ${ayahNumber}`;
};
