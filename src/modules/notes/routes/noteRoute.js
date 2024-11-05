import { Router } from 'express';
import { createNoteCtrl, deleteNoteCtrl, getNoteByIdCtrl, getNotesCtrl, updateNoteCtrl } from '../controller/noteController.js';

import validateJwt from '../../auth/middleware/validateJwt.js';
import logEndpointAccess from '../../logger/middleware/loggerMiddleware.js';

const noteRoute = Router();

noteRoute.get(
  '/subject/:idSubject/note/:idNote',
  logEndpointAccess('/subject/:idSubject/note/:idNote'),
  validateJwt,
  getNoteByIdCtrl
);

noteRoute.get('/subject/:idSubject/note', logEndpointAccess('/subject/:idSubject/note'), validateJwt, getNotesCtrl);

noteRoute.post('/subject/:idSubject/note', logEndpointAccess('/subject/:idSubject/note'), validateJwt, createNoteCtrl);

noteRoute.put(
  '/subject/:idSubject/note/:idNote',
  logEndpointAccess('/subject/:idSubject/note/:idNote'),
  validateJwt,
  updateNoteCtrl
);

noteRoute.delete(
  '/subject/:idSubject/note/:idNote',
  logEndpointAccess('/subject/:idSubject/note/:idNote'),
  validateJwt,
  deleteNoteCtrl
);

export default noteRoute;
