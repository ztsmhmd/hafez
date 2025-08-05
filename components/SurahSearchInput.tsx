import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { getSurahName } from '../utils/quranData';
import quranSurahs from '../data/quranSurahs.json';

interface SurahSearchInputProps {
  value: string;
  onSelect: (surahNumber: number, surahName: string) => void;
  placeholder?: string;
}

export const SurahSearchInput: React.FC<SurahSearchInputProps> = ({ 
  value, 
  onSelect, 
  placeholder = "ابحث عن السورة..." 
}) => {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredSurahs, setFilteredSurahs] = useState(quranSurahs);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSurahs(quranSurahs);
    } else {
      const searchTerm = searchText.trim();
      const filtered = quranSurahs.filter(surah => {
        // Check if search term is a number
        const isNumber = /^\d+$/.test(searchTerm);
        if (isNumber) {
          const searchNumber = parseInt(searchTerm);
          return surah.number === searchNumber || surah.number.toString().includes(searchTerm);
        }
        
        // Text search (case insensitive for Arabic)
        return surah.name.includes(searchTerm) || 
               surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               surah.number.toString().includes(searchTerm);
      });
      setFilteredSurahs(filtered);
    }
  }, [searchText]);

  const handleSurahSelect = (surah: typeof quranSurahs[0]) => {
    onSelect(surah.number, surah.name);
    setSearchText('');
    setShowResults(false);
  };

  const displayValue = value ? getSurahName(parseInt(value) || 1) : '';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.input}
        onPress={() => setShowResults(true)}
      >
        <Text style={[styles.inputText, !displayValue && styles.placeholder]}>
          {displayValue || placeholder}
        </Text>
        <Icon name="search-outline" size={20} style={{ color: colors.grey }} />
      </TouchableOpacity>

      <Modal
        visible={showResults}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر السورة</Text>
              <TouchableOpacity 
                onPress={() => setShowResults(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} style={{ color: colors.text }} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="ابحث بالاسم أو الرقم..."
                placeholderTextColor={colors.grey}
                autoFocus
                onSubmitEditing={() => {
                  // Auto-select first result if available
                  if (filteredSurahs.length > 0) {
                    handleSurahSelect(filteredSurahs[0]);
                  }
                }}
                returnKeyType="search"
              />
              <Icon name="search-outline" size={20} style={{ color: colors.grey }} />
            </View>

            <ScrollView style={styles.resultsList}>
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah) => (
                  <TouchableOpacity
                    key={surah.number}
                    style={styles.resultItem}
                    onPress={() => handleSurahSelect(surah)}
                  >
                    <View style={styles.surahInfo}>
                      <Text style={styles.surahName}>{surah.name}</Text>
                      <Text style={styles.surahDetails}>
                        السورة {surah.number} - {surah.ayahs} آية
                      </Text>
                    </View>
                    <View style={styles.surahNumber}>
                      <Text style={styles.surahNumberText}>{surah.number}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResults}>
                  <Icon name="search-outline" size={48} style={{ color: colors.grey }} />
                  <Text style={styles.noResultsText}>لا توجد نتائج</Text>
                  <Text style={styles.noResultsHint}>
                    جرب البحث باسم السورة أو رقمها
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    position: 'relative' as const,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    flex: 1,
    textAlign: 'right' as const,
  },
  placeholder: {
    color: colors.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modal: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: 600,
    overflow: 'hidden' as const,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '20',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '10',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    marginBottom: 4,
  },
  surahDetails: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
  },
  surahNumber: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  surahNumberText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#fff',
    fontFamily: 'Cairo_700Bold',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsHint: {
    fontSize: 14,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
  },
};