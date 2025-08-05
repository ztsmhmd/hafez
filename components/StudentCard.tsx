
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Student, DailyProgress } from '../types/Student';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { EditStudentModal } from './EditStudentModal';
import { AddDailyProgressModal } from './AddDailyProgressModal';
import { getSurahName, formatQuranPosition, getProgressPercentage } from '../utils/quranData';

interface StudentCardProps {
  student: Student;
  onUpdate: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'لم تتم القراءة': return '#9E9E9E'; // Grey
      case 'مقبول': return '#F44336'; // Red
      case 'جيد': return '#FF9800'; // Orange
      case 'جيد جداً': return '#2196F3'; // Blue
      case 'ممتاز': return '#4CAF50'; // Green
      default: return colors.grey;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'حذف الطالب',
      `هل أنت متأكد من حذف الطالب ${student.name}؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => onDelete(student.id)
        }
      ]
    );
  };

  const handleAddDailyProgress = (progress: Omit<DailyProgress, 'id' | 'createdAt'> | null, updatedRevision?: Student['currentSurahMurajaa']) => {
    let updatedDailyProgress = student.dailyProgress;
    let latestLevel = student.level;

    // Always add progress data (even if surah/ayah are 0) to track memorization level
    if (progress) {
      const newProgress: DailyProgress = {
        ...progress,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      updatedDailyProgress = [...student.dailyProgress, newProgress];
      latestLevel = progress.level;
    }

    const updatedStudent: Student = {
      ...student,
      level: latestLevel,
      dailyProgress: updatedDailyProgress,
      lastUpdated: new Date().toISOString(),
    };

    // Update revision if provided
    if (updatedRevision !== undefined) {
      if (updatedRevision) {
        updatedStudent.currentSurahMurajaa = updatedRevision;
      } else {
        delete updatedStudent.currentSurahMurajaa;
      }
    }

    onUpdate(updatedStudent);
  };

  // Get current position (latest progress)
  const latestProgress = student.dailyProgress.length > 0 
    ? student.dailyProgress[student.dailyProgress.length - 1]
    : null;

  // Only show position if we have actual surah/ayah data
  const hasActualProgress = latestProgress && latestProgress.surahNumber > 0 && latestProgress.ayahNumber > 0;

  const currentPosition = hasActualProgress 
    ? formatQuranPosition(latestProgress.surahNumber, latestProgress.ayahNumber)
    : 'لم يبدأ بعد';

  const quranProgress = hasActualProgress 
    ? getProgressPercentage(latestProgress.surahNumber, latestProgress.ayahNumber)
    : 0;

  return (
    <View style={styles.card}>
      {/* Header with student info and actions */}
      <View style={styles.cardHeader}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <View style={styles.studentMeta}>
            <View style={styles.levelContainer}>
              <View style={[styles.levelIndicator, { backgroundColor: getLevelColor(student.level) }]} />
              <Text style={[styles.studentLevel, { color: getLevelColor(student.level) }]}>
                {getLevelText(student.level)}
              </Text>
            </View>
            <Text style={styles.daysCount}>
              {student.dailyProgress.length} يوم
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.addButton]}
            onPress={() => setShowAddProgressModal(true)}
          >
            <Icon name="add" size={18} style={{ color: '#fff' }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => setShowEditModal(true)}
          >
            <Icon name="create-outline" size={18} style={{ color: colors.primary }} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="trash-outline" size={18} style={{ color: '#F44336' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content area */}
      <View style={styles.cardContent}>
        {/* Progress and Revision - Only show if they exist */}
        <View style={styles.mainInfoRow}>
          {/* Quran Progress - Only show if student has actual progress with surah/ayah */}
          {hasActualProgress && (
            <View style={styles.progressContainer}>
              <View style={styles.sectionHeader}>
                <Icon name="book-outline" size={16} style={{ color: colors.primary }} />
                <Text style={styles.sectionTitle}>الموقع الحالي</Text>
                <Text style={styles.progressPercentage}>{quranProgress}%</Text>
              </View>
              <Text style={styles.currentPosition}>{currentPosition}</Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${quranProgress}%`,
                      backgroundColor: getLevelColor(student.level)
                    }
                  ]} 
                />
              </View>
            </View>
          )}

          {/* Revision Section - Only show if student has revision */}
          {student.currentSurahMurajaa && (
            <View style={styles.revisionContainer}>
              <View style={styles.sectionHeader}>
                <Icon name="refresh-outline" size={16} style={{ color: colors.accent }} />
                <Text style={styles.sectionTitle}>المراجعة</Text>
                {student.currentSurahMurajaa.level && (
                  <View style={[styles.revisionLevelBadge, { backgroundColor: getLevelColor(student.currentSurahMurajaa.level) }]}>
                    <Text style={styles.revisionLevelText}>{getLevelText(student.currentSurahMurajaa.level)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.revisionText}>
                {getSurahName(student.currentSurahMurajaa.surahNumber)}
              </Text>
              <Text style={styles.revisionAyahs}>
                آية {student.currentSurahMurajaa.fromAyah} - {student.currentSurahMurajaa.toAyah}
              </Text>
            </View>
          )}
        </View>

        {/* Recent Progress - Compact */}
        {student.dailyProgress.length > 0 && (
          <View style={styles.recentProgressContainer}>
            <View style={styles.sectionHeader}>
              <Icon name="calendar-outline" size={16} style={{ color: colors.grey }} />
              <Text style={styles.sectionTitle}>آخر التحديثات</Text>
            </View>
            <View style={styles.recentProgressList}>
              {student.dailyProgress
                .slice(-3)
                .reverse()
                .map((day, index) => (
                  <View key={day.id} style={styles.recentProgressItem}>
                    <Text style={styles.recentProgressDate}>{day.date}</Text>
                    <Text style={styles.recentProgressSurah}>
                      {day.surahNumber > 0 && day.ayahNumber > 0 
                        ? `${getSurahName(day.surahNumber)} - ${day.ayahNumber}`
                        : 'تسجيل مستوى فقط'
                      }
                    </Text>
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor(day.level) }]}>
                      <Text style={styles.levelBadgeText}>{getLevelText(day.level)}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Notes - Compact */}
        {student.notes && (
          <View style={styles.notesContainer}>
            <View style={styles.sectionHeader}>
              <Icon name="document-text-outline" size={16} style={{ color: colors.grey }} />
              <Text style={styles.sectionTitle}>ملاحظات</Text>
            </View>
            <Text style={styles.notesText} numberOfLines={2}>{student.notes}</Text>
          </View>
        )}
      </View>

      <EditStudentModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        onUpdate={onUpdate}
      />

      <AddDailyProgressModal
        visible={showAddProgressModal}
        onClose={() => setShowAddProgressModal(false)}
        onAdd={handleAddDailyProgress}
        currentLevel={student.level}
        currentSurah={latestProgress?.surahNumber || 1}
        currentAyah={latestProgress?.ayahNumber || 1}
        currentRevision={student.currentSurahMurajaa}
      />
    </View>
  );
};

const styles = {
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.grey + '20',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 6,
    fontFamily: 'Cairo_700Bold',
  },
  studentMeta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  levelContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  studentLevel: {
    fontSize: 13,
    fontFamily: 'Cairo_400Regular',
    fontWeight: 'bold' as const,
  },
  levelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  daysCount: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
  },
  cardActions: {
    flexDirection: 'row' as const,
    gap: 6,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  editButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  deleteButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#F44336' + '30',
  },
  cardContent: {
    gap: 12,
  },
  mainInfoRow: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  progressContainer: {
    flex: 2,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  revisionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    fontWeight: 'bold' as const,
    flex: 1,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: colors.primary,
    fontFamily: 'Cairo_700Bold',
  },
  currentPosition: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
    marginBottom: 8,
    fontWeight: 'bold' as const,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 3,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  revisionText: {
    fontSize: 13,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  revisionAyahs: {
    fontSize: 11,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
  },
  recentProgressContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  recentProgressList: {
    gap: 6,
  },
  recentProgressItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingVertical: 4,
  },
  recentProgressDate: {
    fontSize: 11,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    minWidth: 60,
  },
  recentProgressSurah: {
    fontSize: 11,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 40,
    alignItems: 'center' as const,
  },
  levelBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Cairo_700Bold',
    fontWeight: 'bold' as const,
  },
  notesContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    fontFamily: 'Cairo_400Regular',
  },
  revisionLevelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 30,
    alignItems: 'center' as const,
  },
  revisionLevelText: {
    fontSize: 9,
    color: '#fff',
    fontFamily: 'Cairo_700Bold',
    fontWeight: 'bold' as const,
  },
  noRevisionText: {
    fontSize: 13,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
  },
};
