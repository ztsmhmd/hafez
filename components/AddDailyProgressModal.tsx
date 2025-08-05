
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { DailyProgress, StudentLevel, Student } from '../types/Student';
import { colors } from '../styles/commonStyles';
import Button from './Button';
import Icon from './Icon';
import { quranSurahs, getSurahName, getTotalAyahsInSurah, validateAyahNumber, formatQuranPosition } from '../utils/quranData';
import { SurahSearchInput } from './SurahSearchInput';

interface AddDailyProgressModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (progress: Omit<DailyProgress, 'id' | 'createdAt'> | null, updatedRevision?: Student['currentSurahMurajaa']) => void;
  currentLevel: StudentLevel;
  currentSurah?: number;
  currentAyah?: number;
  currentRevision?: Student['currentSurahMurajaa'];
}

export const AddDailyProgressModal: React.FC<AddDailyProgressModalProps> = ({ 
  visible, 
  onClose, 
  onAdd,
  currentLevel,
  currentSurah = 1,
  currentAyah = 1,
  currentRevision
}) => {
  const [level, setLevel] = useState<StudentLevel>(currentLevel);
  const [surahNumber, setSurahNumber] = useState('');
  const [ayahNumber, setAyahNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  
  // Revision fields
  const [revisionSurah, setRevisionSurah] = useState(currentRevision?.surahNumber.toString() || '');
  const [revisionFromAyah, setRevisionFromAyah] = useState(currentRevision?.fromAyah.toString() || '');
  const [revisionToAyah, setRevisionToAyah] = useState(currentRevision?.toAyah.toString() || '');
  const [revisionLevel, setRevisionLevel] = useState<StudentLevel>(currentRevision?.level || 'مقبول');
  
  // Check if this is the first progress entry
  const isFirstEntry = currentSurah === 1 && currentAyah === 1;

  const resetForm = () => {
    setLevel(currentLevel);
    setSurahNumber('');
    setAyahNumber('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setShowSurahPicker(false);
    
    // Reset revision fields to current values
    setRevisionSurah(currentRevision?.surahNumber.toString() || '');
    setRevisionFromAyah(currentRevision?.fromAyah.toString() || '');
    setRevisionToAyah(currentRevision?.toAyah.toString() || '');
    setRevisionLevel(currentRevision?.level || 'مقبول');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = () => {
    if (!date) {
      Alert.alert('خطأ', 'يرجى اختيار التاريخ');
      return;
    }

    // Always create progress data with memorization level
    let progressData: Omit<DailyProgress, 'id' | 'createdAt'> = {
      date,
      level,
      surahNumber: 0, // Default to 0 if no surah specified
      ayahNumber: 0,  // Default to 0 if no ayah specified
      notes: notes.trim(),
    };

    // If user provided surah and ayah, validate and use them
    if (surahNumber && ayahNumber) {
      const surahNum = parseInt(surahNumber);
      const ayahNum = parseInt(ayahNumber);

      if (surahNum < 1 || surahNum > 114) {
        Alert.alert('خطأ', 'رقم السورة يجب أن يكون بين 1 و 114');
        return;
      }

      if (!validateAyahNumber(surahNum, ayahNum)) {
        const totalAyahs = getTotalAyahsInSurah(surahNum);
        Alert.alert('خطأ', `رقم الآية يجب أن يكون بين 1 و ${totalAyahs} لسورة ${getSurahName(surahNum)}`);
        return;
      }

      progressData.surahNumber = surahNum;
      progressData.ayahNumber = ayahNum;
    } else if (surahNumber || ayahNumber) {
      Alert.alert('خطأ', 'يرجى ملء السورة ورقم الآية معاً أو تركهما فارغين');
      return;
    }

    // Validate revision data if provided
    let updatedRevision: Student['currentSurahMurajaa'] | undefined;
    if (revisionSurah || revisionFromAyah || revisionToAyah) {
      const revSurahNum = parseInt(revisionSurah);
      const revFromAyah = parseInt(revisionFromAyah);
      const revToAyah = parseInt(revisionToAyah);

      if (revisionSurah && revisionFromAyah && revisionToAyah) {
        if (revSurahNum < 1 || revSurahNum > 114) {
          Alert.alert('خطأ', 'رقم سورة المراجعة يجب أن يكون بين 1 و 114');
          return;
        }

        if (revFromAyah < 1 || revToAyah < revFromAyah) {
          Alert.alert('خطأ', 'يرجى إدخال أرقام آيات صحيحة للمراجعة');
          return;
        }

        const maxRevisionAyahs = getTotalAyahsInSurah(revSurahNum);
        if (revToAyah > maxRevisionAyahs) {
          Alert.alert('خطأ', `رقم الآية للمراجعة يجب أن يكون بين 1 و ${maxRevisionAyahs} لسورة ${getSurahName(revSurahNum)}`);
          return;
        }

        updatedRevision = {
          surahNumber: revSurahNum,
          fromAyah: revFromAyah,
          toAyah: revToAyah,
          level: revisionLevel,
        };
      } else if (revisionSurah || revisionFromAyah || revisionToAyah) {
        // If any revision field is filled but not all, show error
        Alert.alert('خطأ', 'يرجى ملء جميع حقول المراجعة أو تركها فارغة');
        return;
      }
    }

    // Call onAdd with progress data and revision update
    onAdd(progressData, updatedRevision);
    handleClose();
  };

  const handleSurahChange = (newSurahNumber: string) => {
    setSurahNumber(newSurahNumber);
    // Reset ayah to 1 when surah changes
    setAyahNumber('1');
  };

  const levels = [
    { key: 'لم تتم القراءة' as const, label: 'لم تتم القراءة', color: '#9E9E9E' },
    { key: 'مقبول' as const, label: 'مقبول', color: '#F44336' },
    { key: 'جيد' as const, label: 'جيد', color: '#FF9800' },
    { key: 'جيد جداً' as const, label: 'جيد جداً', color: '#2196F3' },
    { key: 'ممتاز' as const, label: 'ممتاز', color: '#4CAF50' },
  ];

  const currentSurahNum = parseInt(surahNumber) || 1;
  const currentAyahNum = parseInt(ayahNumber) || 1;
  const maxAyahs = getTotalAyahsInSurah(currentSurahNum);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>إضافة يوم جديد</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} style={{ color: colors.text }} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Info about the modal purpose */}
            <View style={styles.infoHint}>
              <Icon name="information-circle-outline" size={20} style={{ color: colors.primary }} />
              <Text style={styles.infoHintText}>
                سجل مستوى الحفظ ومستوى المراجعة للطالب. السورة والآية اختيارية.
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>التاريخ *</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.grey}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>المستوى *</Text>
              <View style={styles.levelButtons}>
                {levels.map((levelOption) => (
                  <TouchableOpacity
                    key={levelOption.key}
                    style={[
                      styles.levelButton,
                      level === levelOption.key && { backgroundColor: levelOption.color }
                    ]}
                    onPress={() => setLevel(levelOption.key)}
                  >
                    <Text style={[
                      styles.levelButtonText,
                      level === levelOption.key && styles.levelButtonTextActive
                    ]}>
                      {levelOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Memorization Progress Section */}
            <View style={styles.memorizationSection}>
              <View style={styles.sectionHeaderWithClear}>
                <Icon name="book-outline" size={20} style={{ color: colors.primary }} />
                <Text style={styles.sectionTitle}>الحفظ الجديد (اختياري)</Text>
                {(surahNumber || ayahNumber) && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => {
                      setSurahNumber('');
                      setAyahNumber('');
                    }}
                  >
                    <Icon name="close-circle-outline" size={16} style={{ color: colors.error }} />
                    <Text style={styles.clearButtonText}>مسح</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>السورة</Text>
                <SurahSearchInput
                  value={surahNumber}
                  onSelect={(surahNumber, _surahName) => handleSurahChange(surahNumber.toString())}
                  placeholder="اختر السورة للحفظ الجديد"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>رقم الآية {surahNumber ? `(1-${maxAyahs})` : ''}</Text>
                <TextInput
                  style={styles.input}
                  value={ayahNumber}
                  onChangeText={setAyahNumber}
                  placeholder={surahNumber ? `أدخل رقم الآية (1-${maxAyahs})` : 'اختر السورة أولاً'}
                  placeholderTextColor={colors.grey}
                  keyboardType="numeric"
                  editable={!!surahNumber}
                />
              </View>
            </View>



            {/* Current Position Preview */}
            {validateAyahNumber(currentSurahNum, currentAyahNum) && (
              <View style={styles.positionPreview}>
                <Icon name="location-outline" size={20} style={{ color: colors.primary }} />
                <Text style={styles.positionPreviewText}>
                  الموقع: {formatQuranPosition(currentSurahNum, currentAyahNum)}
                </Text>
              </View>
            )}

            {/* Revision Section */}
            <View style={styles.revisionSection}>
              <View style={styles.revisionHeader}>
                <Icon name="refresh-outline" size={20} style={{ color: colors.accent }} />
                <Text style={styles.revisionTitle}>تحديث المراجعة (اختياري)</Text>
                {(revisionSurah || revisionFromAyah || revisionToAyah) && (
                  <TouchableOpacity 
                    style={styles.clearRevisionButton}
                    onPress={() => {
                      setRevisionSurah('');
                      setRevisionFromAyah('');
                      setRevisionToAyah('');
                      setRevisionLevel('مقبول');
                    }}
                  >
                    <Icon name="close-circle-outline" size={16} style={{ color: colors.error }} />
                    <Text style={styles.clearRevisionText}>مسح</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>السورة للمراجعة</Text>
                <SurahSearchInput
                  value={revisionSurah}
                  onSelect={(surahNumber, _surahName) => setRevisionSurah(surahNumber.toString())}
                  placeholder="اختر السورة للمراجعة"
                />
              </View>

              <View style={styles.ayahInputs}>
                <View style={styles.ayahInputContainer}>
                  <Text style={styles.label}>من آية</Text>
                  <TextInput
                    style={styles.input}
                    value={revisionFromAyah}
                    onChangeText={setRevisionFromAyah}
                    placeholder="من آية"
                    placeholderTextColor={colors.grey}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.ayahInputContainer}>
                  <Text style={styles.label}>إلى آية</Text>
                  <TextInput
                    style={styles.input}
                    value={revisionToAyah}
                    onChangeText={setRevisionToAyah}
                    placeholder="إلى آية"
                    placeholderTextColor={colors.grey}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>مستوى المراجعة</Text>
                <View style={styles.levelButtons}>
                  {levels.map((levelOption) => (
                    <TouchableOpacity
                      key={`revision-${levelOption.key}`}
                      style={[
                        styles.levelButton,
                        revisionLevel === levelOption.key && { backgroundColor: levelOption.color }
                      ]}
                      onPress={() => setRevisionLevel(levelOption.key)}
                    >
                      <Text style={[
                        styles.levelButtonText,
                        revisionLevel === levelOption.key && styles.levelButtonTextActive
                      ]}>
                        {levelOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ملاحظات</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="أدخل ملاحظات عن اليوم"
                placeholderTextColor={colors.grey}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>


            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={20} style={{ color: colors.primary }} />
              <Text style={styles.infoText}>
                سيتم تتبع تقدم الطالب في حفظ القرآن الكريم بناءً على السورة والآية المدخلة
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              text="إلغاء"
              onPress={handleClose}
              style={styles.cancelButton}
            />
            <Button
              text="إضافة"
              onPress={handleAdd}
              style={styles.addButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
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
    maxHeight: '90%',
    overflow: 'hidden' as const,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '20',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Cairo_400Regular',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
  },
  textArea: {
    height: 100,
  },
  levelButtons: {
    flexDirection: 'row' as const,
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    flex: 1,
    minWidth: 100,
  },
  levelButtonText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center' as const,
    fontFamily: 'Cairo_400Regular',
  },
  levelButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  pickerButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
  },
  surahPicker: {
    maxHeight: 200,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    borderRadius: 8,
    marginTop: 8,
  },
  surahOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey + '10',
  },
  surahOptionSelected: {
    backgroundColor: colors.primary + '20',
  },
  surahOptionText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
  },
  surahOptionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold' as const,
  },
  positionPreview: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  positionPreviewText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    fontWeight: 'bold' as const,
  },
  infoBox: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Cairo_400Regular',
  },
  footer: {
    flexDirection: 'row' as const,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '20',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  revisionSection: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  revisionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    gap: 8,
  },
  revisionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    flex: 1,
  },
  clearRevisionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.error + '10',
  },
  clearRevisionText: {
    fontSize: 12,
    color: colors.error,
    fontFamily: 'Cairo_400Regular',
    fontWeight: 'bold' as const,
  },
  ayahInputs: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  ayahInputContainer: {
    flex: 1,
  },
  newStudentHint: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: colors.accent + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  newStudentHintText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Cairo_400Regular',
  },
  memorizationSection: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionHeaderWithClear: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.error + '10',
  },
  clearButtonText: {
    fontSize: 12,
    color: colors.error,
    fontFamily: 'Cairo_400Regular',
    fontWeight: 'bold' as const,
  },
  infoHint: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoHintText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Cairo_400Regular',
  },
};
