import { Activities } from '../modules/activities/models/activitiesModel.js';
import { Subtasks } from '../modules/activities/models/subtasksModel.js';
import { Priorities } from '../modules/priorities/models/prioritiesModel.js';
import { Subjects } from '../modules/subjects/models/subjectModel.js';
import { Users } from '../modules/users/models/userModel.js';
import { Notes } from '../modules/notes/models/notesModel.js';

// Relación entre Prioridades y Actividades: De uno a muchos.
Priorities.hasMany(Activities, { foreignKey: 'prioridad_id' });
Activities.belongsTo(Priorities, { foreignKey: 'prioridad_id' });

//Relación entre User y Activities: De uno a muchos.
Users.hasMany(Activities, { foreignKey: 'user_id' });
Activities.belongsTo(Users, { foreignKey: 'user_id' });

//Relación entre Materias y Actividades
Subjects.hasMany(Activities, { foreignKey: 'subject_id' });
Activities.belongsTo(Subjects, { foreignKey: 'subject_id' });

// Relación entre Actividades y Subtareas
Activities.hasMany(Subtasks, { foreignKey: 'actividad_id' });
Subtasks.belongsTo(Activities, { foreignKey: 'actividad_id' });

// Relación entre Notas y Materias
Subjects.hasMany(Notes, { foreignKey: 'subject_id' });
Notes.belongsTo(Subjects, { foreignKey: 'subject_id' });
