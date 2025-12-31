import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description?: string;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
}

interface Props { navigation?: any }

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // Basic Info
  const [name, setName] = useState('John Doe');
  const [headline, setHeadline] = useState('Software Engineer @ Acme');
  const [location, setLocation] = useState('Bengaluru, India');
  const [about, setAbout] = useState('Passionate engineer building delightful mobile experiences. Previously at FooCorp.');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Social Links
  const [linkedin, setLinkedin] = useState('linkedin.com/in/johndoe');
  const [github, setGithub] = useState('github.com/johndoe');
  const [twitter, setTwitter] = useState('@johndoe');
  const [website, setWebsite] = useState('johndoe.dev');

  // Experience
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { id: '1', company: 'Acme Inc.', role: 'Senior Engineer', duration: '2023 – Present', description: 'Leading the mobile platform.' },
    { id: '2', company: 'FooCorp', role: 'Engineer', duration: '2020 – 2023', description: 'Shipped multiple consumer apps.' },
  ]);

  // Education
  const [education, setEducation] = useState<EducationItem[]>([
    { id: '1', institution: 'IIT Example', degree: 'B.Tech, CSE', duration: '2016 – 2020' },
  ]);

  // Skills
  const [skills, setSkills] = useState<string[]>(['React Native', 'TypeScript', 'Node.js', 'UI/UX']);
  const [newSkill, setNewSkill] = useState('');

  const onSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    navigation?.goBack?.();
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      company: '',
      role: '',
      duration: '',
      description: '',
    };
    setExperiences([...experiences, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      duration: '',
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setEducation(education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced Header */}
      <View style={[styles.headerBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Photo</Text>
          <View style={styles.photoContainer}>
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.photoInitials}>JD</Text>
            </View>
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={[styles.photoButton, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert('Upload Photo', 'Photo upload functionality')}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.photoButtonText}>Change Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoButtonSecondary, { borderColor: colors.border }]}
                onPress={() => Alert.alert('Remove Photo', 'Photo removed')}
              >
                <Ionicons name="trash-outline" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Ionicons name="person-outline" size={18} color={colors.text} /> Basic Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.textSecondary}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Headline *</Text>
            <TextInput
              value={headline}
              onChangeText={setHeadline}
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.textSecondary}
              placeholder="e.g., Software Engineer @ Company"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="City, Country"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Ionicons name="document-text-outline" size={18} color={colors.text} /> About
          </Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            style={[styles.textarea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
            placeholderTextColor={colors.textSecondary}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {about.length} characters
          </Text>
        </View>

        {/* Social Links */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Ionicons name="link-outline" size={18} color={colors.text} /> Social Links
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>LinkedIn</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="logo-linkedin" size={20} color="#0077b5" />
              <TextInput
                value={linkedin}
                onChangeText={setLinkedin}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="linkedin.com/in/username"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>GitHub</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="logo-github" size={20} color={colors.text} />
              <TextInput
                value={github}
                onChangeText={setGithub}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="github.com/username"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Twitter</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="logo-twitter" size={20} color="#1da1f2" />
              <TextInput
                value={twitter}
                onChangeText={setTwitter}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="@username"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Website</Text>
            <View style={[styles.inputWithIcon, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Ionicons name="globe-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={website}
                onChangeText={setWebsite}
                style={[styles.inputField, { color: colors.text }]}
                placeholderTextColor={colors.textSecondary}
                placeholder="yourwebsite.com"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Experience Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="briefcase-outline" size={18} color={colors.text} /> Experience
            </Text>
            <TouchableOpacity onPress={addExperience} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {experiences.map((exp, index) => (
            <View key={exp.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemNumber, { color: colors.textSecondary }]}>#{index + 1}</Text>
                <TouchableOpacity onPress={() => removeExperience(exp.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Company</Text>
                <TextInput
                  value={exp.company}
                  onChangeText={(text) => updateExperience(exp.id, 'company', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="Company name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Role</Text>
                <TextInput
                  value={exp.role}
                  onChangeText={(text) => updateExperience(exp.id, 'role', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="Your role"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
                <TextInput
                  value={exp.duration}
                  onChangeText={(text) => updateExperience(exp.id, 'duration', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="e.g., 2020 - Present"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                <TextInput
                  value={exp.description}
                  onChangeText={(text) => updateExperience(exp.id, 'description', text)}
                  style={[styles.textareaSmall, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="Brief description of your role..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Education Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              <Ionicons name="school-outline" size={18} color={colors.text} /> Education
            </Text>
            <TouchableOpacity onPress={addEducation} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {education.map((edu, index) => (
            <View key={edu.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemNumber, { color: colors.textSecondary }]}>#{index + 1}</Text>
                <TouchableOpacity onPress={() => removeEducation(edu.id)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Institution</Text>
                <TextInput
                  value={edu.institution}
                  onChangeText={(text) => updateEducation(edu.id, 'institution', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="University/College name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Degree</Text>
                <TextInput
                  value={edu.degree}
                  onChangeText={(text) => updateEducation(edu.id, 'degree', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="e.g., B.Tech, Computer Science"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
                <TextInput
                  value={edu.duration}
                  onChangeText={(text) => updateEducation(edu.id, 'duration', text)}
                  style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                  placeholderTextColor={colors.textSecondary}
                  placeholder="e.g., 2016 - 2020"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Skills Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Ionicons name="bulb-outline" size={18} color={colors.text} /> Skills
          </Text>

          <View style={styles.skillsInput}>
            <TextInput
              value={newSkill}
              onChangeText={setNewSkill}
              style={[styles.input, { flex: 1, backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholderTextColor={colors.textSecondary}
              placeholder="Add a skill..."
              onSubmitEditing={addSkill}
            />
            <TouchableOpacity
              style={[styles.addSkillButton, { backgroundColor: colors.primary }]}
              onPress={addSkill}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <View key={index} style={[styles.skillChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                <TouchableOpacity onPress={() => removeSkill(skill)}>
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={onSave}
          style={[styles.saveButtonLarge, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  saveButton: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    gap: 16,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInitials: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  photoButtonSecondary: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  inputField: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    minHeight: 120,
    fontSize: 15,
  },
  textareaSmall: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
    fontSize: 15,
  },
  charCount: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  addButton: {
    padding: 4,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillsInput: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addSkillButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default EditProfileScreen;
