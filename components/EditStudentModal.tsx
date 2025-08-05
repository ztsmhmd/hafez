
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Student, StudentLevel } from '../types/Student';
import { colors } from '../styles/commonStyles';
import Button from './Button';
import Icon from './Icon';
import { getSurahName } from '../utils/quranData';
import { SurahSearchInput } from './SurahSearchInput';

interface EditStudentModalProps {
  visible: boolean;
  onClose: () => void;
  student: Student;
  onUpdate: (student: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ 
  visible, 
  onClose, 
  student, 
  onUpdate 
}) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [revisionSurah, setRevisionSurah] = useState('');
  const [revisionFromAyah, setRevisionFromAyah] = useState('');
  const [revisionToAyah, setRevisionToAyah] = useState('');
  const [revisionLevel, setRevisionLevel] = useState<StudentLevel>('مقبول');

  useEffect(() => {
    if (visible && student) {
      setName(student.name);
      setNotes(student.notes);
      
      // Set revision data if it exists
      if (student.currentSurahMurajaa) {
        setRevisionSurah(student.currentSurahMurajaa.surahNumber.toString());
        setRevisionFromAyah(student.currentSurahMurajaa.fromAyah.toString());
        setRevisionToAyah(student.currentSurahMurajaa.toAyah.toString());
        setRevisionLevel(student.currentSurahMurajaa.level || 'مقبول');
      } else {
        setRevisionSurah('');
        setRevisionFromAyah('');
        setRevisionToAyah('');
        setRevisionLevel('مقبول');
      }
    }
  }, [visible, student]);

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الطالب');
      return;
    }

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
    }

    const updatedStudent: Student = {
      ...student,
      name: name.trim(),
      notes: notes.trim(),
      lastUpdated: new Date().toISOString(),
    };

    // Update revision data
    if (revisionSurah && revisionFromAyah && revisionToAyah) {
      updatedStudent.currentSurahMurajaa = {
        surahNumber: parseInt(revisionSurah),
        fromAyah: parseInt(revisionFromAyah),
        toAyah: parseInt(revisionToAyah),
        level: revisionLevel,
      };
    } else {
      // Remove revision data if fields are empty
      delete updatedStudent.currentSurahMurajaa;
    }

    onUpdate(updatedStudent);
    handleClose();
  };

  const calculateProgress = () => {
    if (student.dailyProgress.length === 0) return 0;
    // Calculate progress based on level scores: لم تتم القراءة=0, مقبول=1, جيد=2, جيد جداً=3, ممتاز=4
    const totalScore = student.dailyProgress.reduce((sum, day) => {
      let levelScore = 0;
      switch (day.level) {
        case 'لم تتم القراءة': levelScore = 0; break;
        case 'مقبول': levelScore = 1; break;
        case 'جيد': levelScore = 2; break;
        case 'جيد جداً': levelScore = 3; break;
        case 'ممتاز': levelScore = 4; break;
        default: levelScore = 1;
      }
      return sum + levelScore;
    }, 0);
    return Math.round((totalScore / (student.dailyProgress.length * 4)) * 100);
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'لم تتم القراءة': return 'لم تتم القراءة';
      case 'مقبول': return 'مقبول';
      case 'جيد': return 'جيد';
      case 'جيد جداً': return 'جيد جداً';
      case 'ممتاز': return 'ممتاز';
      default: return level;
    }
  };

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
            <Text style={styles.title}>تعديل بيانات الطالب</Text>
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
              />
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>المستوى الحالي</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{getLevelText(student.level)}</Text>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>التقدم الإجمالي</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{calculateProgress()}%</Text>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <Text style={styles.label}>عدد الأيام المسجلة</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>{student.dailyProgress.length} يوم</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ملاحظات</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="أدخل ملاحظات إضافية"
                placeholderTextColor={colors.grey}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>المراجعة الحالية</Text>
              <View style={styles.revisionContainer}>
                <SurahSearchInput
                  value={revisionSurah}
                  onSelect={(surahNumber, _surahName) => setRevisionSurah(surahNumber.toString())}
                  placeholder="اختر السورة للمراجعة"
                />
                <View style={styles.ayahInputs}>
                  <TextInput
                    style={[styles.input, styles.ayahInput]}
                    value={revisionFromAyah}
                    onChangeText={setRevisionFromAyah}
                    placeholder="من آية"
                    placeholderTextColor={colors.grey}
                    keyboardType="numeric"
                  />
                  <Text style={styles.toText}>إلى</Text>
                  <TextInput
                    style={[styles.input, styles.ayahInput]}
                    value={revisionToAyah}
                    onChangeText={setRevisionToAyah}
                    placeholder="إلى آية"
                    placeholderTextColor={colors.grey}
                    keyboardType="numeric"
                  />
                </View>
                
                {/* Revision Level Selection */}
                {(revisionSurah || revisionFromAyah || revisionToAyah) && (
                  <View style={styles.revisionLevelContainer}>
                    <Text style={styles.revisionLevelLabel}>مستوى المراجعة:</Text>
                    <View style={styles.levelButtons}>
                      {[
                        { key: 'لم تتم القراءة' as const, label: 'لم تتم القراءة', color: '#9E9E9E' },
                        { key: 'مقبول' as const, label: 'مقبول', color: '#F44336' },
                        { key: 'جيد' as const, label: 'جيد', color: '#FF9800' },
                        { key: 'جيد جداً' as const, label: 'جيد جداً', color: '#2196F3' },
                        { key: 'ممتاز' as const, label: 'ممتاز', color: '#4CAF50' },
                      ].map((levelOption) => (
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
                )}
              </View>
            </View>

            <View style={styles.warningBox}>
              <Icon name="information-circle-outline" size={20} style={{ color: colors.primary }} />
              <Text style={styles.warningText}>
                لا يمكن تعديل المستوى والتقدم من هنا. استخدم "إضافة يوم جديد" لتحديث المستوى والتقدم.
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
              text="حفظ التغييرات"
              onPress={handleUpdate}
              style={styles.updateButton}
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
  infoGroup: {
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
  infoBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '30',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
  },
  warningBox: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  warningText: {
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
  updateButton: {
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
  revisionLevelContainer: {
    marginTop: 12,
  },
  revisionLevelLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Cairo_400Regular',
    fontWeight: 'bold' as const,
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
    minWidth: 80,
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
};
