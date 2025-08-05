
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Student, StudentLevel } from '../types/Student';
import { colors } from '../styles/commonStyles';
import Button from './Button';
import Icon from './Icon';
import { getSurahName } from '../utils/quranData';
import { SurahSearchInput } from './SurahSearchInput';

interface AddStudentModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (student: Omit<Student, 'id' | 'createdAt'>) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<StudentLevel>('مقبول');
  const [notes, setNotes] = useState('');
  const [revisionSurah, setRevisionSurah] = useState('');
  const [revisionFromAyah, setRevisionFromAyah] = useState('');
  const [revisionToAyah, setRevisionToAyah] = useState('');
  const [revisionLevel, setRevisionLevel] = useState<StudentLevel>('مقبول');

  const resetForm = () => {
    setName('');
    setLevel('مقبول');
    setNotes('');
    setRevisionSurah('');
    setRevisionFromAyah('');
    setRevisionToAyah('');
    setRevisionLevel('مقبول');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الطالب');
      return;
    }

    const newStudent: Omit<Student, 'id' | 'createdAt'> = {
      name: name.trim(),
      level,
      notes: notes.trim(),
      dailyProgress: [],
    };

    // Validate revision data if provided
    if (revisionSurah || revisionFromAyah || revisionToAyah) {
      const surahNum = parseInt(revisionSurah);
      const fromAyah = parseInt(revisionFromAyah);
      const toAyah = parseInt(revisionToAyah);

      if (!surahNum || surahNum < 1 || surahNum > 114) {
        Alert.alert('خطأ', 'يرجى إدخال رقم سورة صحيح (1-114)');
        return;
      }

      if (!fromAyah || !toAyah || fromAyah < 1 || toAyah < fromAyah) {
        Alert.alert('خطأ', 'يرجى إدخال أرقام آيات صحيحة');
        return;
      }

      newStudent.currentSurahMurajaa = {
        surahNumber: surahNum,
        fromAyah: fromAyah,
        toAyah: toAyah,
        level: revisionLevel,
      };
    }

    onAdd(newStudent);
    handleClose();
  };

  const levels = [
    { key: 'لم تتم القراءة' as const, label: 'لم تتم القراءة', color: '#9E9E9E' },
    { key: 'مقبول' as const, label: 'مقبول', color: '#F44336' },
    { key: 'جيد' as const, label: 'جيد', color: '#FF9800' },
    { key: 'جيد جداً' as const, label: 'جيد جداً', color: '#2196F3' },
    { key: 'ممتاز' as const, label: 'ممتاز', color: '#4CAF50' },
  ];

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
            <Text style={styles.title}>إضافة طالب جديد</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} style={{ color: colors.text }} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>اسم الطالب *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل اسم الطالب"
                placeholderTextColor={colors.grey}
                autoFocus
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ملاحظات</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="أدخل ملاحظات عن الطالب (اختياري)"
                placeholderTextColor={colors.grey}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.infoBox}>
              <Icon name="information-circle-outline" size={20} style={{ color: colors.primary }} />
              <Text style={styles.infoText}>
                بعد إضافة الطالب، يمكنك تسجيل تقدمه اليومي في حفظ القرآن الكريم من خلال النقر على زر "إضافة يوم جديد"
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
              text="إضافة الطالب"
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
    marginBottom: 8,
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
  levelNote: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    fontStyle: 'italic' as const,
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
  revisionContainer: {
    gap: 8,
  },
  ayahInputs: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  ayahInput: {
    flex: 1,
  },
  toText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
  },
  surahPreview: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
  },
};
