const User = require('./User');
const Patient = require('./Patient');
const Visit = require('./Visit');
const Diagnosis = require('./Diagnosis');
const Treatment = require('./Treatment');
const Owner = require('./Owner');

User.hasMany(Patient, { foreignKey: 'doctorId', as: 'patients' });
Patient.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

Owner.hasMany(Patient, { foreignKey: 'ownerId', as: 'pets' });
Patient.belongsTo(Owner, { foreignKey: 'ownerId', as: 'owner' });

Patient.hasMany(Visit, { foreignKey: 'patientId', as: 'visits' });
Visit.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(Visit, { foreignKey: 'doctorId', as: 'visits' });
Visit.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

Visit.hasMany(Diagnosis, { foreignKey: 'visitId', as: 'diagnosis' });
Diagnosis.belongsTo(Visit, { foreignKey: 'visitId', as: 'visit' });

Visit.hasMany(Treatment, { foreignKey: 'visitId', as: 'treatments' });
Treatment.belongsTo(Visit, { foreignKey: 'visitId', as: 'visit' });

module.exports = {
  User,
  Patient,
  Visit,
  Diagnosis,
  Treatment,
  Owner
};