
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { commonStyles, colors } from '../styles/commonStyles';
import { Student, StudentLevel, DailyProgress } from '../types/Student';
import { StudentCard } from '../components/StudentCard';
import { AddStudentModal } from '../components/AddStudentModal';
import { ExportModal } from '../components/ExportModal';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { loadStudents, saveStudents } from '../utils/storage';
import { demoStudents } from '../utils/demoData';

export default function HomeScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      setIsLoading(true);
      const loadedStudents = await loadStudents();
      
      // Ensure all students have the dailyProgress array
      const updatedStudents = loadedStudents.map(student => {
        if (!student.dailyProgress) {
          return {
            ...student,
            dailyProgress: [],
          };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      console.log('Students loaded:', updatedStudents.length);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = async () => {
    try {
      Alert.alert(
        'تحميل البيانات التجريبية',
        'هل تريد تحميل بيانات تجريبية لتجربة التطبيق؟',
        [
          { text: 'إلغاء', style: 'cancel' },
          { 
            text: 'تحميل', 
            onPress: async () => {
              const updatedStudents = [...students, ...demoStudents];
              setStudents(updatedStudents);
              await saveStudents(updatedStudents);
              console.log('Demo data loaded');
              Alert.alert('تم', 'تم تحميل البيانات التجريبية بنجاح');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error loading demo data:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات التجريبية');
    }
  };

  const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      const newStudent: Student = {
        ...student,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        dailyProgress: student.dailyProgress || [],
      };
      
      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      await saveStudents(updatedStudents);
      console.log('Student added:', newStudent.name);
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة الطالب');
    }
  };

  const updateStudent = async (updatedStudent: Student) => {
    try {
      const updatedStudents = students.map(s => 
        s.id === updatedStudent.id ? updatedStudent : s
      );
      setStudents(updatedStudents);
      await saveStudents(updatedStudents);
      console.log('Student updated:', updatedStudent.name);
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الطالب');
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      const updatedStudents = students.filter(s => s.id !== studentId);
      setStudents(updatedStudents);
      await saveStudents(updatedStudents);
      console.log('Student deleted:', studentId);
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حذف الطالب');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'مسح جميع البيانات',
      'هل أنت متأكد من مسح جميع بيانات الطلاب؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'مسح', 
          style: 'destructive',
          onPress: async () => {
            try {
              setStudents([]);
              await saveStudents([]);
              console.log('All data cleared');
              Alert.alert('تم', 'تم مسح جميع البيانات');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء مسح البيانات');
            }
          }
        }
      ]
    );
  };

  const filteredStudents = selectedLevel === 'all' 
    ? students 
    : students.filter(student => student.level === selectedLevel);

  const getStudentCountByLevel = (level: StudentLevel) => {
    return students.filter(student => student.level === level).length;
  };

  const levelButtons = [
    { key: 'all' as const, label: 'الكل', count: students.length },
    { key: 'لم تتم القراءة' as const, label: 'لم تتم القراءة', count: getStudentCountByLevel('لم تتم القراءة') },
    { key: 'مقبول' as const, label: 'مقبول', count: getStudentCountByLevel('مقبول') },
    { key: 'جيد' as const, label: 'جيد', count: getStudentCountByLevel('جيد') },
    { key: 'جيد جداً' as const, label: 'جيد جداً', count: getStudentCountByLevel('جيد جداً') },
    { key: 'ممتاز' as const, label: 'ممتاز', count: getStudentCountByLevel('ممتاز') },
  ];

  if (isLoading) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="hourglass-outline" size={48} style={{ color: colors.grey }} />
        <Text style={[commonStyles.arabicText, { marginTop: 16 }]}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>حافظ</Text>
        <View style={styles.headerButtons}>
          {students.length > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowExportModal(true)}
            >
              <Icon name="share-outline" size={24} style={{ color: colors.text }} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowAddModal(true)}
          >
            <Icon name="add" size={24} style={{ color: colors.text }} />
          </TouchableOpacity>
          {students.length > 0 && (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: colors.error }]}
              onPress={clearAllData}
            >
              <Icon name="trash-outline" size={24} style={{ color: '#fff' }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {students.length > 0 && (
        <>
          {/* Level Filter Buttons */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.levelFilterContainer}
            contentContainerStyle={styles.levelFilterContent}
          >
            {levelButtons.map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.levelButton,
                  selectedLevel === level.key && styles.levelButtonActive
                ]}
                onPress={() => setSelectedLevel(level.key)}
              >
                <Text style={[
                  styles.levelButtonText,
                  selectedLevel === level.key && styles.levelButtonTextActive
                ]}>
                  {level.label}
                </Text>
                <Text style={[
                  styles.levelButtonCount,
                  selectedLevel === level.key && styles.levelButtonCountActive
                ]}>
                  ({level.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Students List */}
          <ScrollView style={styles.studentsContainer}>
            {filteredStudents.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="book-outline" size={64} style={{ color: colors.grey }} />
                <Text style={styles.emptyStateText}>
                  لا يوجد طلاب في هذا المستوى
                </Text>
              </View>
            ) : (
              filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onUpdate={updateStudent}
                  onDelete={deleteStudent}
                />
              ))
            )}
          </ScrollView>
        </>
      )}

      {/* Empty State - No Students */}
      {students.length === 0 && (
        <View style={styles.welcomeContainer}>
          <Icon name="book-outline" size={80} style={{ color: colors.primary }} />
          <Text style={styles.welcomeTitle}>مرحباً بك في متتبع حفظة القرآن</Text>
          <Text style={styles.welcomeText}>
            تطبيق شامل لمتابعة تقدم الطلاب في حفظ القرآن الكريم
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Icon name="people-outline" size={24} style={{ color: colors.accent }} />
              <Text style={styles.featureText}>إدارة الطلاب في 3 مستويات</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="book-outline" size={24} style={{ color: colors.accent }} />
              <Text style={styles.featureText}>تتبع موقع الطالب في القرآن</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="calendar-outline" size={24} style={{ color: colors.accent }} />
              <Text style={styles.featureText}>تسجيل التقدم اليومي</Text>
            </View>
            <View style={styles.feature}>
              <Icon name="share-outline" size={24} style={{ color: colors.accent }} />
              <Text style={styles.featureText}>تصدير التقارير ومشاركتها</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              text="إضافة طالب جديد"
              onPress={() => setShowAddModal(true)}
              style={styles.primaryButton}
            />
            <Button
              text="تحميل بيانات تجريبية"
              onPress={loadDemoData}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addStudent}
      />

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        students={students}
      />
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
  },
  headerButtons: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  levelFilterContainer: {
    maxHeight: 60,
    backgroundColor: colors.background,
  },
  levelFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
  },
  levelButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'Cairo_400Regular',
  },
  levelButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  levelButtonCount: {
    color: colors.grey,
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
  },
  levelButtonCountActive: {
    color: '#fff',
  },
  studentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center' as const,
    marginTop: 16,
    fontFamily: 'Cairo_400Regular',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text,
    textAlign: 'center' as const,
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'Cairo_700Bold',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Cairo_400Regular',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
    flex: 1,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
