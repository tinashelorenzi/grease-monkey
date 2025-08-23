import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { Text, Card } from './index';

const { width: screenWidth } = Dimensions.get('window');

interface ServiceRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onServiceSelected: (serviceType: string, requestType: 'find' | 'visit') => void;
}

interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedTime: string;
}

const serviceTypes: ServiceType[] = [
  {
    id: 'oil-change',
    title: 'Oil Change',
    description: 'Complete oil and filter replacement',
    icon: 'water',
    color: theme.colors.semantic.info.primary,
    estimatedTime: '30-45 min',
  },
  {
    id: 'battery-service',
    title: 'Battery Service',
    description: 'Battery testing, charging, or replacement',
    icon: 'battery-charging',
    color: theme.colors.semantic.warning.primary,
    estimatedTime: '20-30 min',
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    description: 'Computer diagnostics and error code reading',
    icon: 'speedometer',
    color: theme.colors.semantic.success.primary,
    estimatedTime: '15-25 min',
  },
  {
    id: 'brake-service',
    title: 'Brake Service',
    description: 'Brake inspection, pad replacement, fluid check',
    icon: 'car-sport',
    color: theme.colors.semantic.error.primary,
    estimatedTime: '45-90 min',
  },
  {
    id: 'tire-service',
    title: 'Tire Service',
    description: 'Tire rotation, balancing, or replacement',
    icon: 'disc',
    color: theme.colors.primary.lightBlue,
    estimatedTime: '30-60 min',
  },
  {
    id: 'general-repair',
    title: 'General Repair',
    description: 'Various mechanical repairs and maintenance',
    icon: 'build',
    color: theme.colors.primary.darkBlue,
    estimatedTime: 'Varies',
  },
];

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  visible,
  onClose,
  onServiceSelected,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [showRequestOptions, setShowRequestOptions] = useState(false);

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setShowRequestOptions(true);
  };

  const handleRequestTypeSelect = (requestType: 'find' | 'visit') => {
    if (selectedService) {
      onServiceSelected(selectedService.id, requestType);
      setSelectedService(null);
      setShowRequestOptions(false);
    }
  };

  const handleBack = () => {
    if (showRequestOptions) {
      setShowRequestOptions(false);
      setSelectedService(null);
    } else {
      onClose();
    }
  };

  const renderServiceSelection = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Select Service Type</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.servicesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesListContent}
      >
        {serviceTypes.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => handleServiceSelect(service)}
            activeOpacity={0.7}
          >
            <View style={styles.serviceCardHeader}>
              <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                <Ionicons name={service.icon as any} size={24} color={service.color} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </View>
            
            <View style={styles.serviceDetails}>
              <View style={styles.serviceDetail}>
                <Ionicons name="time-outline" size={16} color={theme.colors.text.tertiary} />
                <Text style={styles.serviceDetailText}>{service.estimatedTime}</Text>
              </View>
              <View style={styles.serviceDetail}>
                <Ionicons name="location-outline" size={16} color={theme.colors.text.tertiary} />
                <Text style={styles.serviceDetailText}>Find nearby mechanics</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderRequestOptions = () => (
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>How would you like to proceed?</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.requestOptionsContent}>
        <Card style={styles.selectedServiceCard}>
          <View style={styles.selectedServiceHeader}>
            <View style={[styles.selectedServiceIcon, { backgroundColor: selectedService?.color + '20' }]}>
              <Ionicons name={selectedService?.icon as any} size={20} color={selectedService?.color} />
            </View>
            <Text style={styles.selectedServiceTitle}>{selectedService?.title}</Text>
          </View>
        </Card>

        <View style={styles.requestOptions}>
          <TouchableOpacity
            style={styles.requestOption}
            onPress={() => handleRequestTypeSelect('find')}
            activeOpacity={0.7}
          >
            <View style={styles.requestOptionIcon}>
              <Ionicons name="search" size={32} color={theme.colors.primary.darkBlue} />
            </View>
                         <View style={styles.requestOptionContent}>
               <Text style={styles.requestOptionTitle}>Find a Mechanic</Text>
               <Text style={styles.requestOptionDescription}>
                 Browse available mechanics in your area, compare rates, and choose the best option for your needs
               </Text>
             </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.requestOption}
            onPress={() => handleRequestTypeSelect('visit')}
            activeOpacity={0.7}
          >
            <View style={styles.requestOptionIcon}>
              <Ionicons name="car" size={32} color={theme.colors.primary.darkBlue} />
            </View>
                         <View style={styles.requestOptionContent}>
               <Text style={styles.requestOptionTitle}>Request a Visit</Text>
               <Text style={styles.requestOptionDescription}>
                 Have a mechanic come to your location for convenient mobile service with competitive pricing
               </Text>
             </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {showRequestOptions ? renderRequestOptions() : renderServiceSelection()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[12],
    paddingBottom: theme.spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  servicesList: {
    flex: 1,
  },
  servicesListContent: {
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
  },
  serviceCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    marginBottom: theme.spacing[4],
    ...theme.shadows.component.card.default,
  },
  serviceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  serviceDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: theme.spacing[6],
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  serviceDetailText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  requestOptionsContent: {
    flex: 1,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[5],
  },
  selectedServiceCard: {
    marginBottom: theme.spacing[6],
  },
  selectedServiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedServiceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  selectedServiceTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  requestOptions: {
    gap: theme.spacing[4],
  },
  requestOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing[5],
    ...theme.shadows.component.card.default,
  },
  requestOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.darkBlue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[4],
  },
  requestOptionContent: {
    flex: 1,
  },
  requestOptionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  requestOptionDescription: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
});
