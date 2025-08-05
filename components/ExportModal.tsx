
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { Student } from '../types/Student';
import { colors } from '../styles/commonStyles';
import Button from './Button';
import Icon from './Icon';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { getSurahName, formatQuranPosition, getProgressPercentage } from '../utils/quranData';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  students: Student[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ visible, onClose, students }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState<'concise' | 'detailed'>('concise');

  const generateConciseReport = () => {
    const reportTime = new Date().toLocaleTimeString('en-GB');
    const reportDate = new Date().toLocaleDateString('en-GB');

    let report = `📊 تقرير حفظة القرآن الكريم (موجز)\n`;
    report += `📅 التاريخ: ${reportDate} - ${reportTime}\n`;
    report += `👥 عدد الطلاب: ${students.length}\n\n`;

    // Statistics by level
    const levelCounts = {
      'لم تتم القراءة': students.filter(s => s.level === 'لم تتم القراءة').length,
      'مقبول': students.filter(s => s.level === 'مقبول').length,
      'جيد': students.filter(s => s.level === 'جيد').length,
      'جيد جداً': students.filter(s => s.level === 'جيد جداً').length,
      'ممتاز': students.filter(s => s.level === 'ممتاز').length,
    };

    report += `📈 إحصائيات المستويات:\n`;
    report += `• لم تتم القراءة: ${levelCounts['لم تتم القراءة']} طالب\n`;
    report += `• مقبول: ${levelCounts['مقبول']} طالب\n`;
    report += `• جيد: ${levelCounts['جيد']} طالب\n`;
    report += `• جيد جداً: ${levelCounts['جيد جداً']} طالب\n`;
    report += `• ممتاز: ${levelCounts['ممتاز']} طالب\n\n`;

    report += `═══════════════════════════\n\n`;

    students.forEach((student, index) => {
      report += `👤 ${index + 1}. ${student.name}\n`;

      // Get latest progress
      const latestProgress = student.dailyProgress.length > 0
        ? student.dailyProgress[student.dailyProgress.length - 1]
        : null;

      // Show memorization level
      if (latestProgress) {
        report += `📚 مستوى الحفظ: ${latestProgress.level}\n`;
        // Always show revision level
        const revisionLevel = student.level;
        report += `🔄 مستوى المراجعة: ${revisionLevel}\n`;

        // Only show current position if student has progress with surah/ayah
        if (latestProgress.surahNumber > 0 && latestProgress.ayahNumber > 0) {
          const position = formatQuranPosition(latestProgress.surahNumber, latestProgress.ayahNumber);
          const progress = getProgressPercentage(latestProgress.surahNumber, latestProgress.ayahNumber);
          report += `📖 الموقع الحالي: ${position}\n`;
        }

        report += `📅 آخر تحديث: ${latestProgress.date}\n`;
      }


      // Show revision info if student has revision
      if (student.currentSurahMurajaa) {
        const revisionText = `${getSurahName(student.currentSurahMurajaa.surahNumber)} - من آية ${student.currentSurahMurajaa.fromAyah} إلى آية ${student.currentSurahMurajaa.toAyah}`;
        report += `🔄 المراجعة: ${revisionText}\n`;
      }

      report += `📝 عدد الأيام: ${student.dailyProgress.length}\n`;

      if (student.notes) {
        report += `💭 ملاحظات: ${student.notes}\n`;
      }

      report += `\n─────────────────────────────\n\n`;
    });

    report += `📱 تم إنشاء هذا التقرير بواسطة تطبيق حافظ\n`;

    return report;
  };

  const generateDetailedReport = () => {
    const reportDate = new Date().toLocaleDateString('en-GB');
    const reportTime = new Date().toLocaleTimeString('en-GB');

    let report = `📊 تقرير حفظة القرآن الكريم (مفصل)\n`;
    report += `📅 التاريخ: ${reportDate} - ${reportTime}\n`;
    report += `👥 عدد الطلاب: ${students.length}\n\n`;

    // Statistics by level
    const levelCounts = {
      'لم تتم القراءة': students.filter(s => s.level === 'لم تتم القراءة').length,
      'مقبول': students.filter(s => s.level === 'مقبول').length,
      'جيد': students.filter(s => s.level === 'جيد').length,
      'جيد جداً': students.filter(s => s.level === 'جيد جداً').length,
      'ممتاز': students.filter(s => s.level === 'ممتاز').length,
    };

    report += `📈 إحصائيات المستويات:\n`;
    report += `• لم تتم القراءة: ${levelCounts['لم تتم القراءة']} طالب\n`;
    report += `• مقبول: ${levelCounts['مقبول']} طالب\n`;
    report += `• جيد: ${levelCounts['جيد']} طالب\n`;
    report += `• جيد جداً: ${levelCounts['جيد جداً']} طالب\n`;
    report += `• ممتاز: ${levelCounts['ممتاز']} طالب\n\n`;

    // Additional statistics
    const totalDays = students.reduce((sum, s) => sum + s.dailyProgress.length, 0);
    const avgDaysPerStudent = students.length > 0 ? Math.round(totalDays / students.length) : 0;
    const studentsWithProgress = students.filter(s => s.dailyProgress.length > 0).length;
    const studentsWithoutProgress = students.length - studentsWithProgress;
    const studentsWithRevision = students.filter(s => s.currentSurahMurajaa).length;
    const studentsWithoutRevision = students.length - studentsWithRevision;

    // Revision level statistics
    const revisionLevelCounts = {
      'لم تتم القراءة': students.filter(s => s.currentSurahMurajaa?.level === 'لم تتم القراءة').length,
      'مقبول': students.filter(s => s.currentSurahMurajaa?.level === 'مقبول').length,
      'جيد': students.filter(s => s.currentSurahMurajaa?.level === 'جيد').length,
      'جيد جداً': students.filter(s => s.currentSurahMurajaa?.level === 'جيد جداً').length,
      'ممتاز': students.filter(s => s.currentSurahMurajaa?.level === 'ممتاز').length,
    };

    report += `📊 إحصائيات إضافية:\n`;
    report += `• إجمالي الأيام المسجلة: ${totalDays} يوم\n`;
    report += `• متوسط الأيام لكل طالب: ${avgDaysPerStudent} يوم\n`;
    report += `• الطلاب الذين بدأوا الحفظ: ${studentsWithProgress} طالب\n`;
    report += `• الطلاب الذين لم يبدأوا بعد: ${studentsWithoutProgress} طالب\n`;
    report += `• الطلاب الذين لديهم مراجعة: ${studentsWithRevision} طالب\n`;
    report += `• الطلاب بدون مراجعة محددة: ${studentsWithoutRevision} طالب\n\n`;

    if (studentsWithRevision > 0) {
      report += `🔄 إحصائيات المراجعة:\n`;
      if (revisionLevelCounts['لم تتم القراءة'] > 0) {
        report += `• مراجعة لم تتم القراءة: ${revisionLevelCounts['لم تتم القراءة']} طالب\n`;
      }
      if (revisionLevelCounts['مقبول'] > 0) {
        report += `• مراجعة مقبولة: ${revisionLevelCounts['مقبول']} طالب\n`;
      }
      if (revisionLevelCounts['جيد'] > 0) {
        report += `• مراجعة جيدة: ${revisionLevelCounts['جيد']} طالب\n`;
      }
      if (revisionLevelCounts['جيد جداً'] > 0) {
        report += `• مراجعة جيدة جداً: ${revisionLevelCounts['جيد جداً']} طالب\n`;
      }
      if (revisionLevelCounts['ممتاز'] > 0) {
        report += `• مراجعة ممتازة: ${revisionLevelCounts['ممتاز']} طالب\n`;
      }
      report += `\n`;
    }

    report += `═══════════════════════════\n\n`;

    students.forEach((student, index) => {
      report += `👤 ${index + 1}. ${student.name}\n`;
      report += `📊 المستوى: ${student.level}\n`;

      // Get latest progress
      const latestProgress = student.dailyProgress.length > 0
        ? student.dailyProgress[student.dailyProgress.length - 1]
        : null;

      // Show memorization level
      if (latestProgress) {
        report += `📚 مستوى الحفظ: ${latestProgress.level}\n`;

        const revisionLevel = student.level;
        report += `🔄 مستوى المراجعة: ${revisionLevel}\n`;

        // Only show current position if student has progress with surah/ayah
        if (latestProgress.surahNumber > 0 && latestProgress.ayahNumber > 0) {
          const position = formatQuranPosition(latestProgress.surahNumber, latestProgress.ayahNumber);
          const progress = getProgressPercentage(latestProgress.surahNumber, latestProgress.ayahNumber);
          report += `📖 الموقع الحالي: ${position}\n`;
          report += `📈 نسبة التقدم: ${progress}%\n`;
        }

        report += `📅 آخر تحديث: ${latestProgress.date}\n`;
      }


      // Show revision info if student has revision
      if (student.currentSurahMurajaa) {
        const revisionText = `${getSurahName(student.currentSurahMurajaa.surahNumber)} - من آية ${student.currentSurahMurajaa.fromAyah} إلى آية ${student.currentSurahMurajaa.toAyah}`;
        report += `🔄 المراجعة الحالية: ${revisionText}\n`;
      }

      report += `📝 عدد الأيام المسجلة: ${student.dailyProgress.length}\n`;
      report += `📅 تاريخ الإضافة: ${new Date(student.createdAt).toLocaleDateString('ar-SA')}\n`;

      if (student.notes) {
        report += `💭 ملاحظات: ${student.notes}\n`;
      }

      // Recent progress (last 5 days for detailed report)
      if (student.dailyProgress.length > 0) {
        report += `\n📋 آخر 5 أيام:\n`;
        student.dailyProgress
          .slice(-5)
          .reverse()
          .forEach((day, dayIndex) => {
            const dayPosition = formatQuranPosition(day.surahNumber, day.ayahNumber);
            report += `   ${dayIndex + 1}. ${day.date} - ${dayPosition} - ${day.level}\n`;
            if (day.notes) {
              report += `      💭 ${day.notes}\n`;
            }
          });
      }

      report += `\n─────────────────────────────\n\n`;
    });

    report += `📱 تم إنشاء هذا التقرير بواسطة تطبيق حافظ\n`;

    return report;
  };

  const generateReport = () => {
    return reportType === 'concise' ? generateConciseReport() : generateDetailedReport();
  };

  const copyToClipboard = async () => {
    try {
      setIsExporting(true);
      const report = generateReport();
      await Clipboard.setStringAsync(report);
      Alert.alert('تم النسخ', 'تم نسخ التقرير إلى الحافظة بنجاح');
      onClose();
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء نسخ التقرير');
    } finally {
      setIsExporting(false);
    }
  };

  const shareViaWhatsApp = async () => {
    try {
      setIsExporting(true);
      const report = generateReport();
      const encodedReport = encodeURIComponent(report);
      const whatsappUrl = `whatsapp://send?text=${encodedReport}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        onClose();
      } else {
        Alert.alert('خطأ', 'تطبيق واتساب غير مثبت على الجهاز');
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة التقرير عبر واتساب');
    } finally {
      setIsExporting(false);
    }
  };

  const shareViaTelegram = async () => {
    try {
      setIsExporting(true);
      const report = generateReport();
      const encodedReport = encodeURIComponent(report);
      const telegramUrl = `tg://msg?text=${encodedReport}`;

      const canOpen = await Linking.canOpenURL(telegramUrl);
      if (canOpen) {
        await Linking.openURL(telegramUrl);
        onClose();
      } else {
        Alert.alert('خطأ', 'تطبيق تيليجرام غير مثبت على الجهاز');
      }
    } catch (error) {
      console.error('Error sharing via Telegram:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة التقرير عبر تيليجرام');
    } finally {
      setIsExporting(false);
    }
  };

  const shareGeneral = async () => {
    try {
      setIsExporting(true);
      const report = generateReport();

      if (await Sharing.isAvailableAsync()) {
        // Create a temporary file for sharing
        const fileName = `quran_tracker_report_${new Date().toISOString().split('T')[0]}.txt`;
        // Note: In a real app, you'd write to a temporary file
        // For now, we'll use the clipboard method
        await Clipboard.setStringAsync(report);
        Alert.alert('تم التحضير', 'تم نسخ التقرير إلى الحافظة. يمكنك الآن لصقه في أي تطبيق تريد مشاركته معه.');
        onClose();
      } else {
        await copyToClipboard();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء مشاركة التقرير');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>تصدير التقرير</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} style={{ color: colors.text }} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.infoContainer}>
              <Icon name="information-circle-outline" size={24} style={{ color: colors.primary }} />
              <Text style={styles.infoText}>
                سيتم إنشاء تقرير شامل يحتوي على معلومات جميع الطلاب وتقدمهم في حفظ القرآن الكريم
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>إحصائيات سريعة:</Text>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>إجمالي الطلاب:</Text>
                <Text style={styles.statValue}>{students.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>لم تتم القراءة:</Text>
                <Text style={styles.statValue}>{students.filter(s => s.level === 'لم تتم القراءة').length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>مستوى مقبول:</Text>
                <Text style={styles.statValue}>{students.filter(s => s.level === 'مقبول').length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>مستوى جيد:</Text>
                <Text style={styles.statValue}>{students.filter(s => s.level === 'جيد').length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>مستوى جيد جداً:</Text>
                <Text style={styles.statValue}>{students.filter(s => s.level === 'جيد جداً').length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>مستوى ممتاز:</Text>
                <Text style={styles.statValue}>{students.filter(s => s.level === 'ممتاز').length}</Text>
              </View>
            </View>

            <View style={styles.reportTypeContainer}>
              <Text style={styles.reportTypeTitle}>نوع التقرير:</Text>
              <View style={styles.reportTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.reportTypeButton,
                    reportType === 'concise' && styles.reportTypeButtonActive
                  ]}
                  onPress={() => setReportType('concise')}
                >
                  <Icon
                    name="document-text-outline"
                    size={20}
                    style={{
                      color: reportType === 'concise' ? '#fff' : colors.primary
                    }}
                  />
                  <Text style={[
                    styles.reportTypeButtonText,
                    reportType === 'concise' && styles.reportTypeButtonTextActive
                  ]}>
                    موجز
                  </Text>
                  <Text style={[
                    styles.reportTypeButtonDesc,
                    reportType === 'concise' && styles.reportTypeButtonDescActive
                  ]}>
                    معلومات أساسية
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.reportTypeButton,
                    reportType === 'detailed' && styles.reportTypeButtonActive
                  ]}
                  onPress={() => setReportType('detailed')}
                >
                  <Icon
                    name="document-outline"
                    size={20}
                    style={{
                      color: reportType === 'detailed' ? '#fff' : colors.primary
                    }}
                  />
                  <Text style={[
                    styles.reportTypeButtonText,
                    reportType === 'detailed' && styles.reportTypeButtonTextActive
                  ]}>
                    مفصل
                  </Text>
                  <Text style={[
                    styles.reportTypeButtonDesc,
                    reportType === 'detailed' && styles.reportTypeButtonDescActive
                  ]}>
                    معلومات شاملة
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.exportOptions}>
              <Text style={styles.optionsTitle}>خيارات التصدير:</Text>

              <TouchableOpacity
                style={styles.exportButton}
                onPress={copyToClipboard}
                disabled={isExporting}
              >
                <Icon name="copy-outline" size={24} style={{ color: colors.primary }} />
                <View style={styles.exportButtonContent}>
                  <Text style={styles.exportButtonTitle}>نسخ إلى الحافظة</Text>
                  <Text style={styles.exportButtonDesc}>نسخ التقرير كنص</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportButton}
                onPress={shareViaWhatsApp}
                disabled={isExporting}
              >
                <Icon name="logo-whatsapp" size={24} style={{ color: '#25D366' }} />
                <View style={styles.exportButtonContent}>
                  <Text style={styles.exportButtonTitle}>مشاركة عبر واتساب</Text>
                  <Text style={styles.exportButtonDesc}>إرسال التقرير مباشرة</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportButton}
                onPress={shareViaTelegram}
                disabled={isExporting}
              >
                <Icon name="paper-plane-outline" size={24} style={{ color: '#0088cc' }} />
                <View style={styles.exportButtonContent}>
                  <Text style={styles.exportButtonTitle}>مشاركة عبر تيليجرام</Text>
                  <Text style={styles.exportButtonDesc}>إرسال التقرير مباشرة</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.exportButton}
                onPress={shareGeneral}
                disabled={isExporting}
              >
                <Icon name="share-outline" size={24} style={{ color: colors.accent }} />
                <View style={styles.exportButtonContent}>
                  <Text style={styles.exportButtonTitle}>مشاركة عامة</Text>
                  <Text style={styles.exportButtonDesc}>مشاركة عبر تطبيقات أخرى</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              text="إلغاء"
              onPress={onClose}
              style={styles.cancelButton}
              disabled={isExporting}
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
  infoContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    backgroundColor: colors.primary + '10',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontFamily: 'Cairo_400Regular',
  },
  statsContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Cairo_700Bold',
  },
  statItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'Cairo_400Regular',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: colors.primary,
    fontFamily: 'Cairo_700Bold',
  },
  exportOptions: {
    marginBottom: 10,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Cairo_700Bold',
  },
  exportButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  exportButtonContent: {
    flex: 1,
  },
  exportButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 2,
    fontFamily: 'Cairo_700Bold',
  },
  exportButtonDesc: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.grey + '20',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  reportTypeContainer: {
    marginBottom: 20,
  },
  reportTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Cairo_700Bold',
  },
  reportTypeButtons: {
    flexDirection: 'row' as const,
    gap: 12,
  },
  reportTypeButton: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center' as const,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.grey + '30',
  },
  reportTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  reportTypeButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.text,
    fontFamily: 'Cairo_700Bold',
  },
  reportTypeButtonTextActive: {
    color: '#fff',
  },
  reportTypeButtonDesc: {
    fontSize: 12,
    color: colors.grey,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center' as const,
  },
  reportTypeButtonDescActive: {
    color: '#fff',
  },
};
